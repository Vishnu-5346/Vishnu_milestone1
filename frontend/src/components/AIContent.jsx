import React, { useState } from 'react';
import { Sparkles, Globe, Copy, CheckCircle } from 'lucide-react';

const AIContent = () => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [drafts, setDrafts] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt) return;

    setGenerating(true);
    setDrafts(null);

    // Simulate AI generation after 2 seconds
    setTimeout(() => {
      setDrafts({
        English: {
          title: 'Office Relocation & Hybrid Work Guidelines',
          body: `Please note that starting next month, our corporate headquarters will relocate to the new metropolitan complex. We will be transitioning to a structured 3-day hybrid schedule. Detailed logistics, parking passes, and seat assignments will follow next week.`
        },
        Spanish: {
          title: 'Directrices de Reubicación de Oficinas y Trabajo Híbrido',
          body: `Tenga en cuenta que a partir del próximo mes, nuestra sede corporativa se trasladará al nuevo complejo metropolitano. Estaremos en transición a un horario híbrido estructurado de 3 días. Los detalles logísticos, pases de estacionamiento y asignaciones de asientos seguirán la próxima semana.`
        },
        French: {
          title: 'Directives de Relocalisation des Bureaux et Travail Hybride',
          body: `Veuillez noter qu'à partir du mois prochain, notre siège social déménagera dans le nouveau complexe métropolitain. Nous passerons à un horaire hybride structuré de 3 jours. Les détails logistiques, les laissez-passer de stationnement et les attributions de sièges suivront la semaine prochaine.`
        }
      });
      setGenerating(false);
    }, 1800);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Content Generator</h1>
        <p className="text-sm text-gray-500">Draft context-aware announcements in multiple languages instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Controls */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Prompt Engine</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">What are you announcing?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Announcement about headquarters moving to Tokyo with a hybrid 3-day office model starting next month."
                rows={5}
                required
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tone of Voice</label>
              <select className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                <option>Professional / Official</option>
                <option>Friendly / Internal</option>
                <option>Urgent Announcement</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? 'AI Generating Drafts...' : 'Generate Translations'}
            </button>
          </form>
        </div>

        {/* Draft outputs */}
        <div className="lg:col-span-2 space-y-6">
          {generating && (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
              <p className="text-sm font-semibold text-gray-600">Translating, formatting, and refining templates...</p>
            </div>
          )}

          {!generating && !drafts && (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-blue-50 text-primary rounded-full mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Drafts Generated</h3>
              <p className="text-sm text-gray-500 max-w-sm">Provide a prompt on the left sidebar to generate optimized multilingual copy drafts.</p>
            </div>
          )}

          {!generating && drafts && (
            <div className="space-y-6">
              {Object.keys(drafts).map((lang) => {
                const draft = drafts[lang];
                const comboText = `${draft.title}\n\n${draft.body}`;
                return (
                  <div key={lang} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">{lang} Output</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(comboText, lang)}
                        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-primary transition"
                      >
                        {copiedId === lang ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Draft
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-800 text-md">{draft.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{draft.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContent;
