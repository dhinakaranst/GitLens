import axios from 'axios';
import * as cheerio from 'cheerio';

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

export async function checkBrokenLinks(url: string): Promise<BrokenLinksResult> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'SEO-Broken-Links-Checker/1.0'
      }
    });

    const $ = cheerio.load(response.data);
    const baseUrl = new URL(url);
    
    const links = $('a[href]');
    const linkPromises: Promise<BrokenLink | null>[] = [];
    const warnings: string[] = [];
    
    let internalLinks = 0;
    let externalLinks = 0;

    links.each((_, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (!href) return;

      // Skip certain types of links
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      try {
        const linkUrl = new URL(href, url);
        const isExternal = linkUrl.hostname !== baseUrl.hostname;
        
        if (isExternal) {
          externalLinks++;
        } else {
          internalLinks++;
        }

        // Create promise to check link
        const linkPromise = checkSingleLink(linkUrl.toString(), text, isExternal);
        linkPromises.push(linkPromise);
        
      } catch (error) {
        // Invalid URL
        const brokenLink: BrokenLink = {
          url: href,
          status: 0,
          text,
          isExternal: false
        };
        linkPromises.push(Promise.resolve(brokenLink));
      }
    });

    if (linkPromises.length === 0) {
      warnings.push('No links found on this page to check.');
    }

    // Check all links with a reasonable limit
    const maxLinksToCheck = 50; // Limit to prevent overwhelming the server
    const linksToCheck = linkPromises.slice(0, maxLinksToCheck);
    
    if (linkPromises.length > maxLinksToCheck) {
      warnings.push(`Only checking first ${maxLinksToCheck} links out of ${linkPromises.length} total links found.`);
    }

    const results = await Promise.allSettled(linksToCheck);
    const brokenLinks: BrokenLink[] = [];
    let workingLinks = 0;

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const link = result.value;
        if (link.status >= 400 || link.status === 0) {
          brokenLinks.push(link);
        } else {
          workingLinks++;
        }
      }
    });

    const totalChecked = workingLinks + brokenLinks.length;
    const successRate = totalChecked > 0 ? Math.round((workingLinks / totalChecked) * 100) : 100;

    return {
      url,
      totalLinks: links.length,
      workingLinks,
      brokenLinks: brokenLinks.slice(0, 20), // Limit displayed broken links
      warnings,
      summary: {
        internalLinks,
        externalLinks,
        brokenCount: brokenLinks.length,
        successRate
      }
    };

  } catch (error) {
    throw new Error(`Failed to check broken links: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function checkSingleLink(url: string, text: string, isExternal: boolean): Promise<BrokenLink | null> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: () => true, // Don't throw on any status code
      headers: {
        'User-Agent': 'SEO-Link-Checker/1.0'
      }
    });

    return {
      url,
      status: response.status,
      text,
      isExternal
    };
  } catch (error) {
    // If HEAD fails, try GET with a smaller timeout
    try {
      const response = await axios.get(url, {
        timeout: 3000,
        maxRedirects: 3,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'SEO-Link-Checker/1.0'
        }
      });

      return {
        url,
        status: response.status,
        text,
        isExternal
      };
    } catch (getError) {
      return {
        url,
        status: 0, // Connection failed
        text,
        isExternal
      };
    }
  }
}