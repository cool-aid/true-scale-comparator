import React from 'react';
import { GenerationResult } from '../types';

interface ResultDisplayProps {
  loading: boolean;
  statusMessage: string;
  result: GenerationResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ loading, statusMessage, result }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Comparison Result
      </h2>

      <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center p-8 text-center animate-pulse">
             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-600 font-medium text-lg">{statusMessage}</p>
             <p className="text-slate-400 text-sm mt-2">This may take a moment...</p>
          </div>
        ) : result?.imageUrl ? (
          <div className="w-full h-full relative group">
             <img 
               src={result.imageUrl} 
               alt="Size comparison" 
               className="w-full h-full object-contain"
             />
             <a 
               href={result.imageUrl} 
               download="scale-comparison.png"
               className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
               Download
             </a>
          </div>
        ) : (
          <div className="text-center p-8 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Add items and click "Generate" to see the comparison.</p>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">Research Data</h3>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
            {result.researchSummary}
          </div>
          
          {result.groundingLinks.length > 0 && (
            <div className="mt-4">
               <h4 className="text-xs font-semibold text-slate-500 mb-2">Sources</h4>
               <ul className="flex flex-wrap gap-2">
                 {result.groundingLinks.map((link, idx) => (
                   <li key={idx}>
                     <a 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {link.title || 'Source'}
                     </a>
                   </li>
                 ))}
               </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;