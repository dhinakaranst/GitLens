import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeWebsite } from './analyzer.js';
import { checkMeta } from './routes/meta-check.js';
import { analyzeHeadings } from './routes/headings.js';
import { checkSocialTags } from './routes/social-tags.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Existing full audit endpoint
app.post('/api/audit', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    const report = await analyzeWebsite(url);
    res.json(report);
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze website',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// New meta check endpoint
app.post('/api/meta-check', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    const result = await checkMeta(url);
    res.json(result);
  } catch (error) {
    console.error('Meta check error:', error);
    res.status(500).json({ 
      error: 'Failed to check meta tags',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// New headings analyzer endpoint
app.post('/api/headings', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    const result = await analyzeHeadings(url);
    res.json(result);
  } catch (error) {
    console.error('Headings analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze headings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// New social tags checker endpoint
app.post('/api/social-tags', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    const result = await checkSocialTags(url);
    res.json(result);
  } catch (error) {
    console.error('Social tags check error:', error);
    res.status(500).json({ 
      error: 'Failed to check social tags',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 SEO Audit API running on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST /api/audit - Full SEO audit`);
  console.log(`   POST /api/meta-check - Meta title & description checker`);
  console.log(`   POST /api/headings - Headings analyzer`);
  console.log(`   POST /api/social-tags - Social media tags checker`);
});