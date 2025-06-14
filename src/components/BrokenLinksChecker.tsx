import React, { useState } from 'react';
import { LinkIcon, CheckCircle, XCircle, AlertTriangle, Loader, ExternalLink, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface BrokenLink {
  url: string;
  status: number;
  text: string;
  isExternal: boolean;
}

interface BrokenLinksResult {
  url: string;
  totalLinks: number;
  workingLinks: number;
  brokenLinks: BrokenLink[];
  warnings: string[];
  summary: {
    internalLinks: number;
    externalLinks: number;
    brokenCount: number;
    successRate: number;
  };
}

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  if (status >= 200 && status < 300) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  } else if (status >= 300 && status < 400) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  }
};

export const BrokenLinksChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrokenLinksResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }

      const response = await axios.post('http://localhost:3001/api/broken-links', {
        url: processedUrl,
      });

      setResult(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setUrl('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-orange-100 rounded-xl">
          <LinkIcon className="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Broken Links Checker</h2>
          <p className="text-gray-600 mt-1">Find and identify broken links that hurt your SEO</p>
        </div>
      </div>

      {!result && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL to check for broken links..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Checking Links...</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5" />
                <span>Check for Broken Links</span>
              </>
            )}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={reset}
            className="text-sm text-red-600 hover:text-red-800 underline font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Link Analysis Results</h3>
            <button
              onClick={reset}
              className="text-orange-600 hover:text-orange-800 underline font-medium"
            >
              Check another URL
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{result.totalLinks}</div>
              <div className="text-sm text-blue-700">Total Links</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-900">{result.workingLinks}</div>
              <div className="text-sm text-green-700">Working Links</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-900">{result.brokenLinks.length}</div>
              <div className="text-sm text-red-700">Broken Links</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{result.summary.successRate}%</div>
              <div className="text-sm text-purple-700">Success Rate</div>
            </div>
          </div>

          {/* Link Type Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Internal Links</h4>
              <div className="text-3xl font-bold text-gray-900">{result.summary.internalLinks}</div>
              <p className="text-sm text-gray-600">Links within your domain</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">External Links</h4>
              <div className="text-3xl font-bold text-gray-900">{result.summary.externalLinks}</div>
              <p className="text-sm text-gray-600">Links to other domains</p>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span>Warnings</span>
              </h4>
              {result.warnings.map((warning, index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-yellow-800">{warning}</p>
                </div>
              ))}
            </div>
          )}

          {/* Broken Links List */}
          {result.brokenLinks.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Broken Links Found</span>
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.brokenLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {link.isExternal ? (
                        <ExternalLink className="w-4 h-4 text-red-600" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <StatusBadge status={link.status} />
                        <span className="text-xs text-gray-500">
                          {link.isExternal ? 'External' : 'Internal'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {link.text || 'No anchor text'}
                      </p>
                      <p className="text-xs text-gray-600 break-all">{link.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Broken Links Found!</h3>
              <p className="text-gray-600">All links on this page are working correctly.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};