import { useState } from 'react';
import axios from 'axios';
import { SEOReport } from '../types/seo';

export const useSEOAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SEOReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeWebsite = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await axios.post('http://localhost:3001/api/audit', {
        url,
      }, {
        timeout: 30000, // 30 second timeout
      });

      setReport(response.data);
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

  return {
    isLoading,
    report,
    error,
    analyzeWebsite,
    resetReport: () => {
      setReport(null);
      setError(null);
    },
  };
};