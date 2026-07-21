import re

# Unicode blocks for major Indian languages and English
LANGUAGE_UNICODE_RANGES = {
    "Hindi": {"start": 0x0900, "end": 0x097F, "name": "Devanagari"},
    "Marathi": {"start": 0x0900, "end": 0x097F, "name": "Devanagari"},
    "Bengali": {"start": 0x0980, "end": 0x09FF, "name": "Bengali"},
    "Punjabi": {"start": 0x0A00, "end": 0x0A7F, "name": "Gurmukhi"},
    "Gujarati": {"start": 0x0A80, "end": 0x0AFF, "name": "Gujarati"},
    "Odia": {"start": 0x0B00, "end": 0x0B7F, "name": "Odia"},
    "Tamil": {"start": 0x0B80, "end": 0x0BFF, "name": "Tamil"},
    "Telugu": {"start": 0x0C00, "end": 0x0C7F, "name": "Telugu"},
    "Kannada": {"start": 0x0C80, "end": 0x0CFF, "name": "Kannada"},
    "Malayalam": {"start": 0x0D00, "end": 0x0D7F, "name": "Malayalam"},
    "Urdu": {"start": 0x0600, "end": 0x06FF, "name": "Arabic/Urdu"},
    "English": {"start": 0x0020, "end": 0x007F, "name": "Basic Latin"}
}

def clean_text_for_script_check(text: str) -> str:
    """Removes digits, spaces, and standard English punctuation to avoid false hits."""
    # Keep only letters/characters and non-ascii marks
    cleaned = re.sub(r'[\s\d\.,!?;:"\'\(\)\[\]\-+\*/@#\$%\^&\*=\\<>`~_]+', '', text)
    return cleaned

def check_char_in_range(char: str, lang: str) -> bool:
    """Checks if a character falls in the Unicode range for a given language."""
    if lang not in LANGUAGE_UNICODE_RANGES:
        return False
    val = ord(char)
    rng = LANGUAGE_UNICODE_RANGES[lang]
    return rng["start"] <= val <= rng["end"]

def analyze_script(text: str):
    """
    Analyzes which script is primarily used in the text.
    Returns character count distribution per script.
    """
    cleaned = clean_text_for_script_check(text)
    if not cleaned:
        return {"primary": "English", "breakdown": {"English": 1.0}}

    counts = {lang: 0 for lang in LANGUAGE_UNICODE_RANGES}
    unknown_count = 0

    for char in cleaned:
        matched = False
        # Special case: Hindi and Marathi share Devanagari. Count it for both.
        # We will separate them in representation.
        for lang, rng in LANGUAGE_UNICODE_RANGES.items():
            if rng["start"] <= ord(char) <= rng["end"]:
                counts[lang] += 1
                matched = True
        if not matched:
            unknown_count += 1

    total_matched = sum(counts.values()) + unknown_count
    if total_matched == 0:
        return {"primary": "English", "breakdown": {"English": 1.0}}

    # Normalize counts
    breakdown = {}
    for lang, cnt in counts.items():
        if cnt > 0:
            breakdown[lang] = round(cnt / len(cleaned), 3)

    if unknown_count > 0:
        breakdown["Unknown"] = round(unknown_count / len(cleaned), 3)

    # Determine primary script based on max ratio
    # Ignore English if there are Indic characters present to prioritize the Indic script.
    indic_breakdown = {k: v for k, v in breakdown.items() if k not in ["English", "Unknown"]}
    
    if indic_breakdown:
        primary = max(indic_breakdown, key=indic_breakdown.get)
    elif breakdown:
        primary = max(breakdown, key=breakdown.get)
    else:
        primary = "English"

    return {
        "primary": primary,
        "breakdown": breakdown
    }

def validate_translation_script(text: str, target_language: str) -> dict:
    """
    Validates if the translated text actually matches the target language Unicode range.
    Returns validation status, script range name, and matching confidence.
    """
    if not text:
        return {"isValid": False, "confidence": 0.0, "message": "Text is empty", "scriptName": "N/A"}

    if target_language not in LANGUAGE_UNICODE_RANGES:
        return {
            "isValid": True, 
            "confidence": 1.0, 
            "message": f"Language '{target_language}' script range is not tracked; assuming valid.",
            "scriptName": "Unknown"
        }

    cleaned = clean_text_for_script_check(text)
    if not cleaned:
        # Text only contains spaces, numbers or punctuation, which is neutral
        return {
            "isValid": True,
            "confidence": 1.0,
            "message": "Text contains only numerals, symbols, or punctuation",
            "scriptName": LANGUAGE_UNICODE_RANGES[target_language]["name"]
        }

    target_range = LANGUAGE_UNICODE_RANGES[target_language]
    matches = sum(1 for char in cleaned if target_range["start"] <= ord(char) <= target_range["end"])
    confidence = matches / len(cleaned)

    # Script range validation threshold (e.g. 70% of non-punctuation chars must be in the block)
    is_valid = confidence >= 0.70

    # Special handling: Marathi and Hindi both map to Devanagari block
    if not is_valid and target_language in ["Hindi", "Marathi"]:
        is_valid = confidence >= 0.70

    return {
        "isValid": is_valid,
        "confidence": round(confidence, 3),
        "scriptName": target_range["name"],
        "message": "Script matches target language Unicode block" if is_valid else f"Low script match: only {round(confidence*100, 1)}% of characters match the {target_range['name']} Unicode block."
    }

def get_indic_nlp_metrics(text: str, language: str) -> dict:
    """
    Calculates Indic-specific NLP complexity metrics.
    Includes average word length, character count, token count, script analysis.
    """
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    
    avg_word_length = round(sum(len(w) for w in words) / word_count, 2) if word_count > 0 else 0
    
    # Calculate script analysis
    script_info = analyze_script(text)
    
    # Simple syllable/character density analysis (e.g., dependent vowel sign count in Devanagari/Dravidian scripts)
    # Most Indian scripts have dependent vowel signs (matras) in specific ranges
    dependent_vowels = 0
    for char in text:
        val = ord(char)
        # Devanagari vowel signs range: 0x093E to 0x094F
        # Tamil vowel signs range: 0x0BBE to 0x0BC8
        # Telugu vowel signs range: 0x0C3E to 0x0C4F
        # Kannada vowel signs range: 0x0CBE to 0x0CD6
        # Malayalam vowel signs range: 0x0D3E to 0x0D4C
        is_dep_vowel = (
            (0x093E <= val <= 0x094F) or
            (0x0982 <= val <= 0x0983) or (0x09BE <= val <= 0x09CC) or
            (0x0A3E <= val <= 0x0A4C) or
            (0x0ABE <= val <= 0x0ACC) or
            (0x0BBE <= val <= 0x0BC8) or
            (0x0C3E <= val <= 0x0C4D) or
            (0x0CBE <= val <= 0x0CD6) or
            (0x0D3E <= val <= 0x0D4D)
        )
        if is_dep_vowel:
            dependent_vowels += 1
            
    complexity_score = "Low"
    if word_count > 0:
        matra_density = dependent_vowels / word_count
        if matra_density > 2.5:
            complexity_score = "High"
        elif matra_density > 1.2:
            complexity_score = "Medium"
            
    return {
        "wordCount": word_count,
        "charCount": char_count,
        "avgWordLength": avg_word_length,
        "primaryScript": script_info["primary"],
        "scriptBreakdown": script_info["breakdown"],
        "matrasCount": dependent_vowels,
        "textComplexity": complexity_score
    }
