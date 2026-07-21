import os
import re
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Import deep-translator for fallback / fast translations
from deep_translator import GoogleTranslator

# Import custom Indic NLP utility
from utils import indic_nlp

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

# Load environment variables
load_dotenv()

# Setup Google Generative AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
has_gemini = False

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        has_gemini = True
        logger.info("Successfully configured Google Generative AI.")
    except Exception as e:
        logger.error(f"Error configuring Google Generative AI: {e}")
else:
    logger.warning("⚠️ GEMINI_API_KEY not found in environment. AI service will run in simulated fallback mode.")

app = FastAPI(
    title="AI Content Generation & Multilingual Communication Engine",
    description="Microservice for content generation, Indian languages translation, personalization, and tone optimization",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported Indian languages and codes
INDIAN_LANG_MAP = {
    "Hindi": "hi",
    "Bengali": "bn",
    "Telugu": "te",
    "Marathi": "mr",
    "Tamil": "ta",
    "Kannada": "kn",
    "Gujarati": "gu",
    "Malayalam": "ml",
    "Punjabi": "pa",
    "Urdu": "ur",
    "Odia": "or"
}

# --- Pydantic Request Schemas ---

class GenerateRequest(BaseModel):
    prompt: str
    tone: str
    recipient_profile: Dict[str, Any]
    objective: str
    channel: str

class TranslateRequest(BaseModel):
    text: str
    target_languages: List[str]

class OptimizeRequest(BaseModel):
    text: str
    desired_tone: str

class ReviewRequest(BaseModel):
    text: str

# --- Simulation Fallbacks ---

def simulate_generation(req: GenerateRequest) -> Dict[str, Any]:
    """Generates highly realistic simulated content based on rules and placeholders."""
    role = req.recipient_profile.get("role", "General Audience")
    region = req.recipient_profile.get("region", "All Regions")
    lang = req.recipient_profile.get("preferred_language", "English")
    
    # Text templates based on objective & channel
    if req.channel.lower() == "sms":
        if "urgent" in req.objective.lower() or "alert" in req.objective.lower():
            body = f"URGENT: {req.prompt}. Actions required immediately for residents of {region}. Please share with other {role}s in your circle."
        elif "educational" in req.objective.lower() or "awareness" in req.objective.lower():
            body = f"Awareness Campaign: Let's discuss {req.prompt}. Designed specifically for {role}s in {region}. Visited website for details."
        else:
            body = f"Notification: {req.prompt}. Target: {role}s in {region}. Contact support for questions."
        return {
            "channel": "SMS",
            "subject": "",
            "body": body[:160],  # Keep it in SMS boundary
            "metadata": {"length": len(body), "simulated": True, "personalization_applied": ["role", "region", "language"]}
        }
        
    elif req.channel.lower() == "whatsapp":
        emoji = "📢"
        if "urgent" in req.objective.lower():
            emoji = "🚨 *URGENT NOTICE* 🚨"
        elif "marketing" in req.objective.lower():
            emoji = "✨ *EXCLUSIVE UPDATE* ✨"
            
        body = (
            f"{emoji}\n\n"
            f"Dear {role},\n\n"
            f"We are writing to share a vital announcement concerning: *{req.prompt}*.\n\n"
            f"📍 *Location Impact:* {region}\n"
            f"🎯 *Objective:* {req.objective}\n"
            f"💬 *Language Preference:* {lang}\n\n"
            f"Please take note and act accordingly. Reply to this message for instant support! 🙏"
        )
        return {
            "channel": "WhatsApp",
            "subject": "",
            "body": body,
            "metadata": {"simulated": True, "personalization_applied": ["role", "region", "language"]}
        }
        
    else:  # Email
        subject = f"[{req.tone.upper()}] Important Update on {req.prompt[:40]}..."
        body = (
            f"Hello {role},\n\n"
            f"This is an official communication regarding: {req.prompt}.\n\n"
            f"As part of our community operations in {region}, we are highlighting this update to align with our objective of: {req.objective}.\n\n"
            f"Details of the Campaign:\n"
            f"- Preferred Language: {lang}\n"
            f"- Communication Policy: Compliant with standard governance guidelines.\n\n"
            f"Please review the attachments or links inside your dashboard to respond. Let us know if you require any translation assistance.\n\n"
            f"Best regards,\n"
            f"Mass Communication Team"
        )
        return {
            "channel": "Email",
            "subject": subject,
            "body": body,
            "metadata": {"simulated": True, "personalization_applied": ["role", "region", "language"]}
        }

def simulate_optimization(text: str, tone: str) -> Dict[str, Any]:
    # Analyze simulated scores
    scores = {"professional": 0.4, "friendly": 0.3, "urgent": 0.2, "empathetic": 0.1}
    t = tone.lower()
    if "professional" in t:
        scores = {"professional": 0.85, "friendly": 0.1, "urgent": 0.05, "empathetic": 0.0}
        opt_text = f"Official Notification: {text} Please note this directive and comply accordingly."
        suggestions = [
            "Replaced informal salutations with formal greetings.",
            "Converted active commands to structured guidelines.",
            "Removed exclamation marks and informal modifiers."
        ]
    elif "friendly" in t:
        scores = {"professional": 0.1, "friendly": 0.85, "urgent": 0.05, "empathetic": 0.0}
        opt_text = f"Hi there! 😊 {text} We're super excited to share this with you. Let's work together on this! Cheers."
        suggestions = [
            "Added casual greetings and warm sign-offs.",
            "Incorporated standard emojis to boost readability.",
            "Simplified vocabulary for internal staff friendliness."
        ]
    elif "urgent" in t:
        scores = {"professional": 0.2, "friendly": 0.0, "urgent": 0.8, "empathetic": 0.0}
        opt_text = f"🚨 ACTION REQUIRED: {text} Please review this immediately! Deadline is approaching."
        suggestions = [
            "Preceded text with standard urgency emoji flags.",
            "Highlighted the call to action immediately at the start.",
            "Minimized background narrative for direct action points."
        ]
    else:  # Empathetic
        scores = {"professional": 0.1, "friendly": 0.2, "urgent": 0.0, "empathetic": 0.7}
        opt_text = f"We understand the challenges and want to support you. ❤️ {text} Please reach out if you need anything at all."
        suggestions = [
            "Adjusted language to sound supporting and collaborative.",
            "Softened commands into polite requests.",
            "Added supportive callout links."
        ]

    return {
        "originalSentiment": scores,
        "suggestions": suggestions,
        "optimizedText": opt_text
    }

# --- Route Handlers ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "has_gemini": has_gemini,
        "message": "FastAPI AI Content & Multilingual Engine is active"
    }

@app.post("/api/ai/generate")
def generate_content(request: GenerateRequest):
    """
    Exposes content generation, tailored specifically for recipients and communication objectives.
    """
    if not has_gemini:
        return simulate_generation(request)

    # Gemini Prompt Assembly
    sys_prompt = (
        "You are an expert campaign content creator and personalization engine for a Mass Communication platform. "
        "Your task is to draft optimized communication based on the following specifications.\n\n"
        f"Delivery Channel: {request.channel}\n"
        f"Communication Objective: {request.objective}\n"
        f"Tone of Voice: {request.tone}\n"
        f"Recipient Profile: Role='{request.recipient_profile.get('role', 'Any')}', Region='{request.recipient_profile.get('region', 'Any')}', Preferred Language='{request.recipient_profile.get('preferred_language', 'English')}'\n"
        f"Announcement context/details: {request.prompt}\n\n"
        "Guidelines:\n"
        "1. If Channel is 'SMS', keep it strictly short, concise, and under 160 characters. No subject line. Output only the text.\n"
        "2. If Channel is 'WhatsApp', make it highly readable, structure with bullet points or bold text, and use appropriate emojis.\n"
        "3. If Channel is 'Email', provide a clear 'Subject: [Subject text]' on the first line and then the 'Body: [Body text]'.\n"
        "4. Personalize the messaging directly. Use terms relevant to their role and location.\n"
        "5. Output the result in JSON format with keys: 'subject', 'body', 'metadata' (list of personalization actions applied)."
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Request JSON output
        response = model.generate_content(
            sys_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        import json
        result = json.loads(response.text)
        # Ensure correct structure
        if "body" not in result:
            result = {"subject": "", "body": response.text, "metadata": {"personalization_applied": ["AI generated"]}}
        
        return result
    except Exception as e:
        logger.error(f"Gemini generation error: {e}. Falling back to simulation.")
        return simulate_generation(request)

@app.post("/api/ai/translate")
def translate_content(request: TranslateRequest):
    """
    Translates input text into major Indian languages using translation models and runs Indic NLP script validations.
    """
    results = {}
    
    for lang in request.target_languages:
        if lang not in INDIAN_LANG_MAP:
            # Skip untracked language or return empty
            continue
            
        lang_code = INDIAN_LANG_MAP[lang]
        translated_text = ""
        used_fallback = False
        
        # 1. Try Gemini Translator first if key exists
        if has_gemini:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"Translate the following English text to {lang}.\n"
                    "Provide ONLY the pure translation in the native script. "
                    "Do NOT include any introduction, explanations, notes, or brackets. "
                    "Do NOT change variables or URLs.\n\n"
                    f"Text: {request.text}"
                )
                response = model.generate_content(prompt)
                translated_text = response.text.strip()
                
                # Check if Gemini output is valid
                script_check = indic_nlp.validate_translation_script(translated_text, lang)
                if not script_check["isValid"]:
                    logger.warning(f"Gemini translation for {lang} failed script validation. Falling back to Google Translate.")
                    used_fallback = True
            except Exception as e:
                logger.error(f"Gemini translation error for {lang}: {e}")
                used_fallback = True
        else:
            used_fallback = True
            
        # 2. Fallback to deep-translator (Google Translator API)
        if used_fallback or not translated_text:
            try:
                translated_text = GoogleTranslator(source='auto', target=lang_code).translate(request.text)
            except Exception as e:
                logger.error(f"GoogleTranslator error for {lang}: {e}")
                translated_text = f"[Translation unavailable for {lang}]"
                
        # 3. Perform Indic NLP verification and metrics calculation
        script_validation = indic_nlp.validate_translation_script(translated_text, lang)
        nlp_metrics = indic_nlp.get_indic_nlp_metrics(translated_text, lang)
        
        results[lang] = {
            "translation": translated_text,
            "script_validation": script_validation,
            "nlp_metrics": nlp_metrics
        }
        
    return results

@app.post("/api/ai/optimize")
def optimize_content(request: OptimizeRequest):
    """
    Exposes sentiment-aware content optimization and tone correction suggestions.
    """
    if not has_gemini:
        return simulate_optimization(request.text, request.desired_tone)

    prompt = (
        "You are an expert copywriter. Analyze the following campaign text and optimize it for a desired tone.\n\n"
        f"Original Text: {request.text}\n"
        f"Desired Tone: {request.desired_tone}\n\n"
        "Provide a JSON response with the following keys:\n"
        "1. 'originalSentiment': A dictionary of scoring for tones ('professional', 'friendly', 'urgent', 'empathetic') sum up to 1.0 based on original text.\n"
        "2. 'suggestions': An array of 3 specific improvements made to adjust the tone.\n"
        "3. 'optimizedText': The revised, polished, and tone-optimized text."
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Gemini optimization error: {e}. Falling back to simulation.")
        return simulate_optimization(request.text, request.desired_tone)

@app.post("/api/ai/review")
def review_content(request: ReviewRequest):
    """
    Exposes compliance validation, checks for left-over bracket placeholders, readability, spam triggers.
    """
    text = request.text
    
    # 1. Rule-based static check (instant & 100% reliable)
    placeholders_found = re.findall(r'\[.*?\]|\{.*?\}', text)
    has_placeholders = len(placeholders_found) > 0
    
    # Basic local spam/profanity check
    spam_words = ["congratulations", "win free", "click here now", "guaranteed money", "lottery", "cash prize"]
    profanity_words = ["abuse", "stupid", "idiot", "hate", "kill"] # simplified filter
    
    spam_matches = [w for w in spam_words if w in text.lower()]
    profanity_matches = [w for w in profanity_words if w in text.lower()]
    
    # 2. AI validation
    ai_status = "PASSED"
    ai_warnings = []
    ai_readability = "Easy"
    
    if has_gemini:
        prompt = (
            "You are a communications compliance officer. Review the following text for deployment readiness. "
            "Verify there is no hate speech, aggressive language, spam patterns, or structural issues.\n\n"
            f"Campaign Text: {text}\n\n"
            "Provide a JSON response with keys:\n"
            "- 'status': either 'PASSED', 'WARNING', or 'FAILED'\n"
            "- 'warnings': a list of string messages detailing compliance risks or structural warnings\n"
            "- 'readability': a general reading difficulty level (e.g. 'Easy', 'Medium', 'Difficult')"
        )
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            import json
            ai_res = json.loads(response.text)
            ai_status = ai_res.get("status", "PASSED")
            ai_warnings = ai_res.get("warnings", [])
            ai_readability = ai_res.get("readability", "Easy")
        except Exception as e:
            logger.error(f"Gemini review error: {e}")
            
    # Combine static & AI rules
    final_warnings = list(ai_warnings)
    if has_placeholders:
        final_warnings.append(f"Unresolved placeholders detected: {', '.join(placeholders_found)}")
    if spam_matches:
        final_warnings.append(f"Spam trigger words detected: {', '.join(spam_matches)}")
    if profanity_matches:
        final_warnings.append(f"Inappropriate words detected: {', '.join(profanity_matches)}")
        
    final_status = "PASSED"
    if any("placeholder" in w or "Inappropriate" in w for w in final_warnings):
        final_status = "FAILED"
    elif final_warnings:
        final_status = "WARNING"
        
    # Basic readability calculation fallback
    words = text.split()
    avg_len = sum(len(w) for w in words) / len(words) if words else 0
    local_readability = "Easy"
    if avg_len > 7 or len(words) > 25:
        local_readability = "Difficult"
    elif avg_len > 5 or len(words) > 15:
        local_readability = "Medium"
        
    return {
        "status": final_status,
        "warnings": final_warnings,
        "readability": ai_readability if has_gemini else local_readability,
        "static_checks": {
            "has_placeholders": has_placeholders,
            "placeholders": placeholders_found,
            "spam_detected": len(spam_matches) > 0,
            "profanity_detected": len(profanity_matches) > 0
        }
    }
