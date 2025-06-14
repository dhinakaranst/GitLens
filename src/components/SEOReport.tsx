import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Image, 
  Link, 
  Smartphone, 
  Monitor,
  FileText,
  Share,
  Target,
  ArrowLeft,
  Download,
  Copy
} from 'lucide-react';
import { SEOReport as SEOReportType } from '../types/seo';

interface SEOReportProps {
  report: SEOReportType;
  onBack: () => void;
}

const ScoreCircle: React.FC<{ score: number; size?: 'sm' | 'lg' }> = ({ score, size = 'lg' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const sizeClasses = size === 'lg' ? 'w-28 h-28 text-3xl' : 'w-20 h-20 text-xl';
  const circumference = size === 'lg' ? 2 * Math.PI * 45 : 2 * Math.PI * 35;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const radius = size === 'lg' ? 45 : 35;

  return (
    <div className={`${sizeClasses} relative flex items-center justify-center`}>
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={`stop-color-${getScoreColor(score).split('-')[1]}-500`} />
            <stop offset="100%" className={`stop-color-${getScoreColor(score).split('-')[1]}-600`} />
          </linearGradient>
        </defs>
      </svg>
      <div className={`relative z-10 font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
    </div>
  );
};

const StatusIcon: React.FC<{ status: boolean }> = ({ status }) => {
  return status ? (
    <CheckCircle className="w-5 h-5 text-green-600" />
  ) : (
    <XCircle className="w-5 h-5 text-red-600" />
  );
};

export const SEOReport: React.FC<SEOReportProps> = ({ report, onBack }) => {
  const { headings } = report;
  const totalHeadings = Object.values(headings).reduce((sum, count) => sum + count, 0);

  const handleCopyReport = () => {
    const reportText = `SEO Report for ${report.url}
    
SEO Score: ${report.seoScore}/100
Title: ${report.title}
Description: ${report.description}

Performance:
- Mobile: ${report.performance.mobile}/100
- Desktop: ${report.performance.desktop}/100

Content Structure:
- H1 Tags: ${headings.h1}
- H2 Tags: ${headings.h2}
- H3 Tags: ${headings.h3}

Images:
- Total: ${report.images.total}
- With Alt Text: ${report.images.withAlt}
- Missing Alt Text: ${report.images.withoutAlt}

Links:
- Internal: ${report.links.internal}
- External: ${report.links.external}
- Broken: ${report.links.broken.length}

Recommendations:
${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}`;

    navigator.clipboard.writeText(reportText);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">New Analysis</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm font-medium">Copy Report</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-500">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {new URL(report.url).hostname}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {report.title || 'Untitled Page'}
            </h1>
            <p className="text-gray-600 max-w-4xl leading-relaxed">
              {report.description || 'No meta description found'}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <ScoreCircle score={report.seoScore} />
              <p className="text-sm text-gray-600 mt-3 font-semibold">SEO Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Smartphone className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Mobile Performance</h3>
          </div>
          <div className="flex items-center space-x-6">
            <ScoreCircle score={report.performance.mobile || 0} size="sm" />
            <div>
              <p className="text-gray-600 mb-1">PageSpeed Score</p>
              <p className="text-sm text-gray-500">Mobile optimization rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Monitor className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Desktop Performance</h3>
          </div>
          <div className="flex items-center space-x-6">
            <ScoreCircle score={report.performance.desktop || 0} size="sm" />
            <div>
              <p className="text-gray-600 mb-1">PageSpeed Score</p>
              <p className="text-sm text-gray-500">Desktop optimization rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Structure */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Content Structure</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="font-medium text-gray-700">H1 Tags</span>
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${headings.h1 === 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {headings.h1}
                </span>
                <StatusIcon status={headings.h1 === 1} />
              </div>
            </div>
            
            {totalHeadings > 1 && (
              <div className="grid grid-cols-5 gap-3 text-center text-sm">
                {Object.entries(headings).slice(1).map(([tag, count]) => (
                  <div key={tag} className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="font-bold text-blue-900">{tag.toUpperCase()}</div>
                    <div className="text-blue-700 text-lg font-semibold">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Images Analysis */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Image className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Images</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Images</span>
              <span className="font-bold text-gray-900 text-lg">{report.images.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">With Alt Text</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-600 text-lg">{report.images.withAlt}</span>
                <StatusIcon status={report.images.withoutAlt === 0} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Missing Alt Text</span>
              <span className={`font-bold text-lg ${report.images.withoutAlt === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {report.images.withoutAlt}
              </span>
            </div>
          </div>
        </div>

        {/* Links Analysis */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Link className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Links</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Internal Links</span>
              <span className="font-bold text-blue-600 text-lg">{report.links.internal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">External Links</span>
              <span className="font-bold text-purple-600 text-lg">{report.links.external}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Broken Links</span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-lg ${report.links.broken.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {report.links.broken.length}
                </span>
                <StatusIcon status={report.links.broken.length === 0} />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-pink-100 rounded-xl">
              <Share className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Social Media</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">OpenGraph</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {Object.values(report.openGraph).filter(Boolean).length}/4
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.openGraph.hasOgTitle} />
                  <span>Title</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.openGraph.hasOgDescription} />
                  <span>Description</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.openGraph.hasOgImage} />
                  <span>Image</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.openGraph.hasOgUrl} />
                  <span>URL</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Twitter Card</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {Object.values(report.twitterCard).filter(Boolean).length}/4
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.twitterCard.hasCardType} />
                  <span>Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.twitterCard.hasTitle} />
                  <span>Title</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.twitterCard.hasDescription} />
                  <span>Description</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={report.twitterCard.hasImage} />
                  <span>Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical SEO */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Target className="w-7 h-7 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Technical SEO</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <StatusIcon status={report.technical.viewport} />
            <span className="text-gray-700 font-medium">Viewport Meta</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <StatusIcon status={report.technical.charset} />
            <span className="text-gray-700 font-medium">Charset</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <StatusIcon status={report.technical.hasRobotsTxt} />
            <span className="text-gray-700 font-medium">Robots.txt</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <StatusIcon status={report.technical.hasSitemap} />
            <span className="text-gray-700 font-medium">XML Sitemap</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <AlertTriangle className="w-7 h-7 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {report.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors">
              <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-yellow-800">{index + 1}</span>
              </div>
              <p className="text-yellow-800 leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};