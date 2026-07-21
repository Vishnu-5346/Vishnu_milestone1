import React, { useState } from 'react';
import axios from 'axios';
import { 
  Sparkles, Globe, Copy, Check, AlertTriangle, ShieldCheck, 
  User, RefreshCw, Send, Heart, BookOpen, AlertCircle,
  Languages, MessageSquare, Mail, ChevronDown, ChevronUp, 
  BarChart2, CheckSquare, Square, Info
} from 'lucide-react';

const MAJOR_INDIAN_LANGUAGES = [
  { name: 'Hindi', native: 'हिन्दी' },
  { name: 'Bengali', native: 'বাংলা' },
  { name: 'Telugu', native: 'తెలుగు' },
  { name: 'Marathi', native: 'मराठी' },
  { name: 'Tamil', native: 'தமிழ்' },
  { name: 'Kannada', native: 'ಕನ್ನಡ' },
  { name: 'Gujarati', native: 'ગુજરાતી' },
  { name: 'Malayalam', native: 'മലയാളം' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { name: 'Urdu', native: 'اردو' },
  { name: 'Odia', native: 'ଓଡ଼ିଆ' }
];

const AIContent = () => {
  // Input fields state
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [channel, setChannel] = useState('Email');
  const [objective, setObjective] = useState('Informative');
  
  // Recipient Profile state (Personalization)
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [recipientRole, setRecipientRole] = useState('All Staff');
  const [recipientRegion, setRecipientRegion] = useState('All Regions');
  const [recipientLanguage, setRecipientLanguage] = useState('English');

  // Interactive outputs state
  const [generating, setGenerating] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [translations, setTranslations] = useState(null);
  const [optimizedData, setOptimizedData] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  // Translation selections
  const [selectedLanguages, setSelectedLanguages] = useState(['Hindi', 'Tamil']);
  
  // UI states
  const [activeTab, setActiveTab] = useState('draft'); // draft, translation, tone, compliance
  const [copiedId, setCopiedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle main generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setGenerating(true);
    setErrorMsg('');
    setGeneratedDraft(null);
    setTranslations(null);
    setOptimizedData(null);
    setReviewData(null);
    setActiveTab('draft');

    try {
      const response = await axios.post('/ai/generate', {
        prompt,
        tone,
        channel,
        objective,
        recipient_profile: {
          role: recipientRole,
          region: recipientRegion,
          preferred_language: recipientLanguage
        }
      });

      if (response.data && response.data.success) {
        const draft = response.data.data;
        setGeneratedDraft(draft);
        
        // Auto trigger compliance review for instant feedback
        triggerReview(draft.body);
      } else {
        throw new Error(response.data?.message || 'Failed to generate content');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Error occurred while contacting the AI server.');
    } finally {
      setGenerating(false);
    }
  };

  // Helper to trigger compliance review
  const triggerReview = async (text) => {
    if (!text) return;
    setReviewing(true);
    try {
      const response = await axios.post('/ai/review', { text });
      if (response.data && response.data.success) {
        setReviewData(response.data.data);
      }
    } catch (err) {
      console.error('Error running compliance check:', err);
    } finally {
      setReviewing(false);
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!generatedDraft || !generatedDraft.body) return;
    if (selectedLanguages.length === 0) return;

    setTranslating(true);
    setErrorMsg('');
    try {
      const response = await axios.post('/ai/translate', {
        text: generatedDraft.body,
        target_languages: selectedLanguages
      });

      if (response.data && response.data.success) {
        setTranslations(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to translate content');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error generating translation. Ensure FastAPI translator is active.');
    } finally {
      setTranslating(false);
    }
  };

  // Handle tone optimization suggestions
  const handleOptimize = async () => {
    if (!generatedDraft || !generatedDraft.body) return;

    setOptimizing(true);
    setErrorMsg('');
    try {
      const response = await axios.post('/ai/optimize', {
        text: generatedDraft.body,
        desired_tone: tone
      });

      if (response.data && response.data.success) {
        setOptimizedData(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to optimize content');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error running tone optimizer.');
    } finally {
      setOptimizing(false);
    }
  };

  // Apply suggestions
  const handleApplyOptimization = (newText) => {
    if (!generatedDraft) return;
    const updated = { ...generatedDraft, body: newText };
    setGeneratedDraft(updated);
    setOptimizedData(null); // Clear suggestions panel
    // Re-verify compliance
    triggerReview(newText);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-8 border-b border-gray-100 dark:border-[#334155] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Content & Multilingual Engine
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Personalize, translate to major Indian scripts, and optimize campaign communications instantly.
          </p>
        </div>
        <div className="flex gap-2">
          {generatedDraft && (
            <button
              onClick={() => triggerReview(generatedDraft.body)}
              disabled={reviewing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${reviewing ? 'animate-spin' : ''}`} />
              Re-run Review
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <span className="font-bold">Error:</span> {errorMsg}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Controls Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Campaign Builder
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Campaign Description / Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Announcement about safety protocols during monsoon heavy rainfall. Farmers should secure livestock and backup energy supplies."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Tone of Voice
                  </label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="Professional">Professional / Official</option>
                    <option value="Friendly">Friendly / Caring</option>
                    <option value="Urgent">Urgent Alert</option>
                    <option value="Empathetic">Empathetic / Supportive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Delivery Channel
                  </label>
                  <select 
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="Email">Email</option>
                    <option value="SMS">SMS Message</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Communication Objective
                </label>
                <select 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="Informative">Informative Notification</option>
                  <option value="Action Required">Urgent Action / Instruction</option>
                  <option value="Marketing">Awareness & Promotion</option>
                  <option value="Educational">Educational Campaign</option>
                </select>
              </div>

              {/* Personalization Section */}
              <div className="border border-gray-100 dark:border-[#334155] rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/10">
                <button
                  type="button"
                  onClick={() => setShowPersonalization(!showPersonalization)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-primary" />
                    Recipient Personalization Profile
                  </span>
                  {showPersonalization ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showPersonalization && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-gray-100 dark:border-[#334155]">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Recipient Role/Cohort
                      </label>
                      <input
                        type="text"
                        value={recipientRole}
                        onChange={(e) => setRecipientRole(e.target.value)}
                        placeholder="e.g. Farmers, Field Employees, Staff"
                        className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Region / Location
                        </label>
                        <input
                          type="text"
                          value={recipientRegion}
                          onChange={(e) => setRecipientRegion(e.target.value)}
                          placeholder="e.g. Rural Maharashtra"
                          className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Preferred Language
                        </label>
                        <select
                          value={recipientLanguage}
                          onChange={(e) => setRecipientLanguage(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white cursor-pointer"
                        >
                          <option value="English">English</option>
                          {MAJOR_INDIAN_LANGUAGES.map(lang => (
                            <option key={lang.name} value={lang.name}>{lang.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    AI Personalizing Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Campaign Copy
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Interactive Workspace (Right columns) */}
        <div className="lg:col-span-2 space-y-6">
          {generating && (
            <div className="bg-white dark:bg-[#1E293B] p-12 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Analyzing demographic targets and copywriting campaign...</p>
              <p className="text-xs text-gray-400 mt-1">Applying context: Tone: {tone} | Channel: {channel}</p>
            </div>
          )}

          {!generating && !generatedDraft && (
            <div className="bg-white dark:bg-[#1E293B] p-12 rounded-2xl border border-dashed border-gray-200 dark:border-[#334155] flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-primary dark:text-primary-400 rounded-full mb-4">
                <Sparkles className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">AI Copywriting Sandbox</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Configure your target parameters on the left pane and hit generate to draft, translate, analyze tone, and validate compliance on campaign copy.
              </p>
            </div>
          )}

          {!generating && generatedDraft && (
            <div className="space-y-6">
              {/* Workspace Navigation Tabs */}
              <div className="flex border-b border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm">
                <nav className="flex space-x-6 overflow-x-auto py-2.5">
                  <button
                    onClick={() => setActiveTab('draft')}
                    className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeTab === 'draft'
                        ? 'border-b-2 border-primary text-primary dark:text-primary-400 font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    1. Campaign Copy Draft
                  </button>
                  <button
                    onClick={() => setActiveTab('translation')}
                    className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeTab === 'translation'
                        ? 'border-b-2 border-primary text-primary dark:text-primary-400 font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    2. Multilingual Translations
                  </button>
                  <button
                    onClick={() => setActiveTab('tone')}
                    className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeTab === 'tone'
                        ? 'border-b-2 border-primary text-primary dark:text-primary-400 font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    3. Sentiment & Tone Analyzer
                  </button>
                  <button
                    onClick={() => setActiveTab('compliance')}
                    className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'compliance'
                        ? 'border-b-2 border-primary text-primary dark:text-primary-400 font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    4. Compliance Review
                    {reviewData && (
                      <span className={`h-2 w-2 rounded-full ${
                        reviewData.status === 'PASSED' ? 'bg-green-500' :
                        reviewData.status === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    )}
                  </button>
                </nav>
              </div>

              {/* Tab 1: Generated Draft */}
              {activeTab === 'draft' && (
                <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-[#334155] pb-3">
                    <div className="flex items-center gap-2">
                      {channel === 'Email' ? <Mail className="h-5 w-5 text-gray-400" /> : <MessageSquare className="h-5 w-5 text-gray-400" />}
                      <span className="text-sm font-bold text-gray-800 dark:text-white">{channel} Preview Format</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(
                        channel === 'Email' ? `Subject: ${generatedDraft.subject}\n\n${generatedDraft.body}` : generatedDraft.body,
                        'draft_copy'
                      )}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-primary transition bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      {copiedId === 'draft_copy' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Draft
                        </>
                      )}
                    </button>
                  </div>

                  {channel === 'Email' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-[#334155]">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Subject Line</span>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white mt-1">{generatedDraft.subject}</h4>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-[#334155] min-h-[150px]">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Message Body</span>
                        <p className="text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{generatedDraft.body}</p>
                      </div>
                    </div>
                  )}

                  {channel === 'WhatsApp' && (
                    <div className="flex justify-center py-4 bg-slate-100 dark:bg-slate-900 rounded-xl">
                      <div className="w-full max-w-sm bg-[#E5DDD5] dark:bg-gray-950 p-3 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800">
                        <div className="bg-white dark:bg-[#1E293B] p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap relative max-w-[85%] float-left">
                          <p className="leading-relaxed">{generatedDraft.body}</p>
                          <span className="text-[9px] text-gray-400 float-right mt-1">10:45 AM ✔</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {channel === 'SMS' && (
                    <div className="flex justify-center py-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div className="w-full max-w-xs bg-black text-white p-4 rounded-3xl shadow-lg border border-gray-800">
                        <div className="h-4 w-12 bg-gray-800 rounded-full mx-auto mb-4"></div>
                        <div className="bg-gray-900 p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Messages • Now</span>
                          <p className="leading-relaxed">{generatedDraft.body}</p>
                          <span className="text-[9px] text-gray-500 mt-1 block">Characters: {generatedDraft.body.length} / 160</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personalization Log */}
                  {generatedDraft.metadata && generatedDraft.metadata.personalization_applied && (
                    <div className="bg-blue-50/50 dark:bg-blue-950/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
                      <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">AI Personalization Applied:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-700 dark:text-blue-400">
                          {generatedDraft.metadata.personalization_applied.map((act, i) => (
                            <li key={i} className="capitalize">{act.replace('_', ' ')}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Translation Engine */}
              {activeTab === 'translation' && (
                <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm space-y-6">
                  <div>
                    <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Languages className="h-5 w-5 text-primary" />
                      Indic Multilingual Translation Engine
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Translate content to multiple regional scripts simultaneously, verifying correct character block validations.
                    </p>
                  </div>

                  {/* Language Selection Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {MAJOR_INDIAN_LANGUAGES.map((lang) => {
                      const isSelected = selectedLanguages.includes(lang.name);
                      return (
                        <button
                          key={lang.name}
                          onClick={() => toggleLanguage(lang.name)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/20 border-primary dark:border-[#3B82F6] text-primary dark:text-primary-400'
                              : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span>{lang.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{lang.native}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleTranslate}
                    disabled={translating || selectedLanguages.length === 0}
                    className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {translating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Translating scripts...
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4" />
                        Translate Campaign Content
                      </>
                    )}
                  </button>

                  {/* Translation Outputs */}
                  {translations && (
                    <div className="space-y-4 border-t border-gray-100 dark:border-[#334155] pt-4">
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generated Translations</h4>
                      {Object.keys(translations).map((lang) => {
                        const data = translations[lang];
                        const validation = data.script_validation;
                        const metrics = data.nlp_metrics;

                        return (
                          <div key={lang} className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200/60 dark:border-[#334155] space-y-3">
                            <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                              <span className="text-sm font-bold text-gray-800 dark:text-white">{lang} Output</span>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  validation.isValid ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/20' : 'bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/20'
                                }`}>
                                  {validation.isValid ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                  {validation.scriptName} Script Valid ({Math.round(validation.confidence * 100)}%)
                                </span>
                                <button
                                  onClick={() => copyToClipboard(data.translation, lang)}
                                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-primary flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedId === lang ? (
                                    <>
                                      <Check className="h-3 w-3 text-green-500" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">{data.translation}</p>

                            {/* Indic NLP Metrics Panel */}
                            {metrics && (
                              <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-dashed border-gray-200 dark:border-[#334155]">
                                <div>
                                  <span className="font-bold block text-gray-400 uppercase">Words</span>
                                  <span>{metrics.wordCount} words</span>
                                </div>
                                <div>
                                  <span className="font-bold block text-gray-400 uppercase">Avg Word Length</span>
                                  <span>{metrics.avgWordLength} chars</span>
                                </div>
                                <div>
                                  <span className="font-bold block text-gray-400 uppercase">Vowel Marks</span>
                                  <span>{metrics.matrasCount} syllables</span>
                                </div>
                                <div>
                                  <span className="font-bold block text-gray-400 uppercase">Complexity</span>
                                  <span className={`font-bold ${
                                    metrics.textComplexity === 'High' ? 'text-amber-600 dark:text-amber-400' :
                                    metrics.textComplexity === 'Medium' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                                  }`}>{metrics.textComplexity}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Sentiment & Tone Optimizer */}
              {activeTab === 'tone' && (
                <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm space-y-6">
                  <div>
                    <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Sentiment & Tone Optimization
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Assess the distribution of tone attributes and get AI recommendations to align with your objectives.
                    </p>
                  </div>

                  <button
                    onClick={handleOptimize}
                    disabled={optimizing}
                    className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {optimizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing Sentiment...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Analyze Tone & Suggest Improvements
                      </>
                    )}
                  </button>

                  {optimizedData && (
                    <div className="space-y-6 border-t border-gray-100 dark:border-[#334155] pt-6">
                      {/* Sentiment Bar Graph */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tone distribution</h4>
                        <div className="space-y-2">
                          {Object.keys(optimizedData.originalSentiment).map((sentiment) => {
                            const score = optimizedData.originalSentiment[sentiment];
                            const percent = Math.round(score * 100);
                            return (
                              <div key={sentiment} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="capitalize text-gray-600 dark:text-gray-400">{sentiment}</span>
                                  <span className="text-gray-900 dark:text-white">{percent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      sentiment === 'professional' ? 'bg-blue-500' :
                                      sentiment === 'friendly' ? 'bg-green-500' :
                                      sentiment === 'urgent' ? 'bg-amber-500' : 'bg-red-400'
                                    }`}
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Suggestions list */}
                      <div className="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          Suggested Adjustments (for {tone} tone)
                        </h4>
                        <ul className="list-disc list-inside text-xs text-amber-800 dark:text-amber-300 space-y-1.5 leading-relaxed">
                          {optimizedData.suggestions.map((sug, idx) => (
                            <li key={idx}>{sug}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply Optimized Copy Box */}
                      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/60 dark:border-[#334155] space-y-3">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Suggested Optimized Version</span>
                        <p className="text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{optimizedData.optimizedText}</p>
                        <button
                          onClick={() => handleApplyOptimization(optimizedData.optimizedText)}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition"
                        >
                          <Check className="h-3 w-3" />
                          Apply Optimized Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Compliance & Quality Review */}
              {activeTab === 'compliance' && (
                <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm space-y-6">
                  <div>
                    <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Campaign Quality & Compliance Review
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Check for required template fills, policy guidelines compliance, and reading density scores prior to launching.
                    </p>
                  </div>

                  {reviewing && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-center p-4">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                      Scanning copy for compliance triggers...
                    </div>
                  )}

                  {!reviewing && reviewData && (
                    <div className="space-y-6">
                      {/* Status Summary Banner */}
                      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                        reviewData.status === 'PASSED' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/20 text-green-800 dark:text-green-300' :
                        reviewData.status === 'WARNING' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/20 text-amber-800 dark:text-amber-300' :
                        'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/20 text-red-800 dark:text-red-300'
                      }`}>
                        {reviewData.status === 'PASSED' ? (
                          <ShieldCheck className="h-8 w-8 text-green-500 shrink-0" />
                        ) : reviewData.status === 'WARNING' ? (
                          <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
                        ) : (
                          <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
                        )}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider">
                            Compliance Check: {reviewData.status}
                          </h4>
                          <p className="text-xs mt-0.5 opacity-90">
                            {reviewData.status === 'PASSED' && "This content complies with communication policy rules. Safe to deploy."}
                            {reviewData.status === 'WARNING' && "Potential quality issue flagged. Please review warnings before deploy."}
                            {reviewData.status === 'FAILED' && "Critical non-compliance issues found. Launch blocked."}
                          </p>
                        </div>
                      </div>

                      {/* Readability & Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-[#334155]">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Readability Level</span>
                          <span className="text-md font-bold text-gray-700 dark:text-gray-200 mt-1 block">{reviewData.readability}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-[#334155]">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Spam & Policy Risk</span>
                          <span className="text-md font-bold text-gray-700 dark:text-gray-200 mt-1 block">
                            {reviewData.static_checks?.spam_detected ? 'High Risk' : 'None / Clean'}
                          </span>
                        </div>
                      </div>

                      {/* Warnings list */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Detailed Warnings / Checks</h4>
                        {reviewData.warnings && reviewData.warnings.length > 0 ? (
                          <div className="space-y-2">
                            {reviewData.warnings.map((w, idx) => (
                              <div key={idx} className="flex gap-2 p-3 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-lg text-xs text-gray-700 dark:text-gray-300 items-start">
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <span>{w}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20 flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            No structural warnings, profanity, or unresolved placeholders found!
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContent;
