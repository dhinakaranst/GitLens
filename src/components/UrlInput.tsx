import React, { useState } from 'react';
import { Search, Globe, Loader, Zap, Shield, Target } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }

    if (!validateUrl(processedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    onAnalyze(processedUrl);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Professional SEO Audit
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Get comprehensive SEO insights for any website. Analyze meta tags, performance metrics, 
          broken links, and discover optimization opportunities in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Globe className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="Enter website URL (e.g., example.com or https://example.com)"
            className={`block w-full pl-16 pr-6 py-5 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-lg ${
              error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
            }`}
            disabled={isLoading}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm px-2">
            <div className="w-1 h-1 bg-red-600 rounded-full" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
        >
          {isLoading ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span className="text-lg">Analyzing Website...</span>
            </>
          ) : (
            <>
              <Search className="w-6 h-6" />
              <span className="text-lg">Start SEO Analysis</span>
            </>
          )}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100 hover:bg-white/80 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="font-semibold text-blue-900 mb-2">Meta Analysis</div>
          <div className="text-sm text-blue-700">Titles, descriptions, headings & keywords</div>
        </div>
        <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100 hover:bg-white/80 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="font-semibold text-green-900 mb-2">Performance</div>
          <div className="text-sm text-green-700">Speed, mobile-friendliness & Core Web Vitals</div>
        </div>
        <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100 hover:bg-white/80 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="font-semibold text-purple-900 mb-2">Technical SEO</div>
          <div className="text-sm text-purple-700">Structure, accessibility & broken links</div>
        </div>
      </div>
    </div>
  );
};