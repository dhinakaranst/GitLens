import React, { useState } from 'react';
import { UrlInput } from './components/UrlInput';
import { SEOReport } from './components/SEOReport';
import { MetaChecker } from './components/MetaChecker';
import { HeadingsAnalyzer } from './components/HeadingsAnalyzer';
import { SocialTagsChecker } from './components/SocialTagsChecker';
import { BrokenLinksChecker } from './components/BrokenLinksChecker';
import { useSEOAnalysis } from './hooks/useSEOAnalysis';
import { AlertCircle, Search, Hash, FileText, Share2, LinkIcon } from 'lucide-react';

type ActiveTool = 'full-audit' | 'meta-checker' | 'headings-analyzer' | 'social-tags' | 'broken-links';

function App() {
  const { isLoading, report, error, analyzeWebsite, resetReport } = useSEOAnalysis();
  const [activeTool, setActiveTool] = useState<ActiveTool>('full-audit');

  const tools = [
    {
      id: 'full-audit' as ActiveTool,
      name: 'Full SEO Audit',
      description: 'Complete website analysis',
      icon: Search,
      color: 'blue'
    },
    {
      id: 'meta-checker' as ActiveTool,
      name: 'Meta Tags Checker',
      description: 'Title & description length',
      icon: FileText,
      color: 'green'
    },
    {
      id: 'headings-analyzer' as ActiveTool,
      name: 'Headings Analyzer',
      description: 'H1-H6 structure analysis',
      icon: Hash,
      color: 'purple'
    },
    {
      id: 'social-tags' as ActiveTool,
      name: 'Social Tags Checker',
      description: 'OpenGraph & Twitter cards',
      icon: Share2,
      color: 'pink'
    },
    {
      id: 'broken-links' as ActiveTool,
      name: 'Broken Links Checker',
      description: 'Find and fix broken links',
      icon: LinkIcon,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
      green: isActive ? 'bg-green-600 text-white shadow-green-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
      purple: isActive ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
      pink: isActive ? 'bg-pink-600 text-white shadow-pink-200' : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200',
      orange: isActive ? 'bg-orange-600 text-white shadow-orange-200' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (error && activeTool === 'full-audit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Analysis Failed</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="space-y-3">
            <button
              onClick={resetReport}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Again
            </button>
            <p className="text-xs text-gray-500 text-center">
              Make sure the website is accessible and try again
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (report && activeTool === 'full-audit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 py-8">
        <SEOReport report={report} onBack={resetReport} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            SEO Analysis Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade SEO analysis tools to optimize your website's search engine performance and boost your rankings
          </p>
        </div>

        {/* Tool Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                  isActive 
                    ? 'border-transparent shadow-xl transform scale-105 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg hover:transform hover:scale-102'
                } ${getColorClasses(tool.color, isActive)}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : `text-${tool.color}-600`}`} />
                    </div>
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-white/90' : 'opacity-75'}`}>
                    {tool.description}
                  </p>
                </div>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tool Content */}
        <div className="w-full">
          {activeTool === 'full-audit' && (
            <div className="flex items-center justify-center">
              <UrlInput onAnalyze={analyzeWebsite} isLoading={isLoading} />
            </div>
          )}
          {activeTool === 'meta-checker' && <MetaChecker />}
          {activeTool === 'headings-analyzer' && <HeadingsAnalyzer />}
          {activeTool === 'social-tags' && <SocialTagsChecker />}
          {activeTool === 'broken-links' && <BrokenLinksChecker />}
        </div>
      </div>
    </div>
  );
}

export default App;