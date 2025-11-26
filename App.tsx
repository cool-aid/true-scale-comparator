import React, { useState, useEffect } from 'react';
import ItemInput from './components/ItemInput';
import ResultDisplay from './components/ResultDisplay';
import { ComparisonItem, ImageResolution, GenerationResult } from './types';
import { processComparison } from './services/geminiService';

const App: React.FC = () => {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  // Check for API key on mount and when interactions occur
  const checkApiKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
      return hasKey;
    }
    return false;
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const handleSelectApiKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success after closing dialog as per prompt instructions
      setApiKeySelected(true);
    }
  };

  const handleGenerate = async () => {
    if (items.length === 0) return;
    
    // Double check API key before generating
    const hasKey = await checkApiKey();
    if (!hasKey) {
        await handleSelectApiKey();
    }

    setLoading(true);
    setResult(null);
    setStatusMessage('Researching object dimensions...');

    try {
      // 1. Research
      const research = await processComparison(items, resolution);
      setStatusMessage('Generating scale-accurate image...');
      
      setResult(research);
    } catch (error: any) {
      console.error("Generation Error:", error);
      let msg = "An error occurred during generation.";
      if (error.message.includes("API key")) {
        msg = "API Key error. Please re-select your key.";
        setApiKeySelected(false);
      }
      setStatusMessage(msg);
      // Wait a bit then clear error message to not leave it stuck in loading state forever visually
      setTimeout(() => setLoading(false), 3000); 
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              <span className="text-indigo-600">TrueScale</span> Comparator
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Visualize real-world items side-by-side with correct relative scaling.
              Powered by Nano Banana Pro.
            </p>
          </div>
          
          {!apiKeySelected ? (
            <button
              onClick={handleSelectApiKey}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-slate-800 transition-all font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 010-2z" clipRule="evenodd" />
              </svg>
              Select API Key
            </button>
          ) : (
             <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                API Key Active
             </div>
          )}
        </header>

        {!apiKeySelected && (
           <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You must select a paid API key to use the Nano Banana Pro model for high-fidelity image generation. 
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="font-medium underline hover:text-yellow-600 ml-1">
                    Learn about billing
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <ItemInput items={items} setItems={setItems} disabled={loading} />
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Generation Settings</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Image Resolution</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(ImageResolution).map((res) => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      disabled={loading}
                      className={`
                        py-2 px-4 rounded-lg text-sm font-medium border transition-all
                        ${resolution === res 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                      `}
                    >
                      {res}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                   Higher resolutions like 4K use Nano Banana Pro (gemini-3-pro-image-preview).
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || items.length === 0}
                className={`
                  w-full py-3.5 px-6 rounded-lg text-white font-semibold shadow-md transition-all
                  flex items-center justify-center gap-2
                  ${loading || items.length === 0 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg transform hover:-translate-y-0.5'}
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Generate Comparison
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <ResultDisplay loading={loading} statusMessage={statusMessage} result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;