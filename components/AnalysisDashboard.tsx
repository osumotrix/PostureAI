import React from 'react';
import { AnalysisState } from '../types';
import ScoreGauge from './ScoreGauge';
import { AlertTriangle, CheckCircle2, HelpCircle, XCircle, TrendingUp } from 'lucide-react';

interface AnalysisDashboardProps {
  state: AnalysisState;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ state }) => {
  const { data, isAnalyzing, error, lastRun } = state;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Analysis Failed</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data && !isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col justify-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="h-10 w-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Analyze</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Sit comfortably in front of your camera. Ensure your head and shoulders are visible. Click "Check Now" to get AI-powered ergonomic feedback.
        </p>
      </div>
    );
  }

  // Skeleton Loading State
  if (!data && isAnalyzing) {
     return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full animate-pulse">
           <div className="h-64 w-full bg-gray-200 rounded-full mb-8 mx-auto max-w-[250px]"></div>
           <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
           <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
           </div>
        </div>
     )
  }

  if (!data) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Excellent': return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'Good': return <CheckCircle2 className="h-6 w-6 text-teal-500" />;
      case 'Fair': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'Poor': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return <HelpCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 text-lg">Analysis Results</h2>
        {lastRun && (
          <span className="text-xs text-gray-400 font-mono">
            {lastRun.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        {/* Score Section */}
        <div className="mb-8">
           <ScoreGauge score={data.score} />
           <div className="text-center mt-[-20px]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                {getStatusIcon(data.status)}
                <span className="font-semibold text-gray-700">{data.status} Posture</span>
              </div>
           </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <p className="text-gray-600 italic text-center border-l-4 border-teal-500 pl-4 py-2 bg-teal-50/50 rounded-r-lg">
            "{data.summary}"
          </p>
        </div>

        {/* Issues & Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" /> Detected Issues
             </h3>
             {data.issues.length > 0 ? (
               <ul className="space-y-3">
                 {data.issues.map((issue, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100">
                     <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                     {issue}
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-sm text-gray-400 italic">No specific issues detected.</p>
             )}
          </div>

          <div>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" /> Recommendations
             </h3>
             {data.recommendations.length > 0 ? (
               <ul className="space-y-3">
                 {data.recommendations.map((rec, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 bg-teal-50 p-3 rounded-lg border border-teal-100">
                     <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                     {rec}
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-sm text-gray-400 italic">Keep up the great work!</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;