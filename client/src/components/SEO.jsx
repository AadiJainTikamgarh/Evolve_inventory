import { useEffect } from "react";

/**
 * A lightweight, high-performance SEO component for React SPAs.
 * Dynamically updates document title, description, keywords, OpenGraph,
 * and Twitter Card metadata tags when components mount.
 * Automatically cleans up and restores previous values on unmount.
 *
 * @param {Object} props
 * @param {string} props.title - Dynamic title for the current view
 * @param {string} props.description - Compelling meta description for search results
 * @param {string} [props.keywords] - Comma-separated list of keywords specific to the view
 */
export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    // Cache original metadata to restore upon page component unmount
    const originalTitle = document.title;
    
    // 1. Update Document Title
    if (title) {
      document.title = `${title} | EVOLVE NITB`;
    }

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    let originalDescription = "";
    if (metaDescription) {
      originalDescription = metaDescription.getAttribute("content") || "";
      if (description) {
        metaDescription.setAttribute("content", description);
      }
    } else if (description) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
    }

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    let originalKeywords = "";
    if (metaKeywords) {
      originalKeywords = metaKeywords.getAttribute("content") || "";
      if (keywords) {
        metaKeywords.setAttribute("content", keywords);
      }
    } else if (keywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      metaKeywords.content = keywords;
      document.head.appendChild(metaKeywords);
    }

    // 4. Update OpenGraph Properties for Dynamic Social Sharing Previews
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute("content", `${title} | EVOLVE NITB`);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) {
      ogDescription.setAttribute("content", description);
    }

    // 5. Update Twitter Cards Properties
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && title) {
      twitterTitle.setAttribute("content", `${title} | EVOLVE NITB`);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && description) {
      twitterDescription.setAttribute("content", description);
    }

    return () => {
      // Cleanup: revert document title and meta to original defaults on component unmount
      document.title = originalTitle;
      
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute("content", originalDescription);
      }
      
      if (metaKeywords && originalKeywords) {
        metaKeywords.setAttribute("content", originalKeywords);
      }
      
      if (ogTitle) {
        ogTitle.setAttribute("content", originalTitle);
      }
      
      if (ogDescription && originalDescription) {
        ogDescription.setAttribute("content", originalDescription);
      }
      
      if (twitterTitle) {
        twitterTitle.setAttribute("content", originalTitle);
      }
      
      if (twitterDescription && originalDescription) {
        twitterDescription.setAttribute("content", originalDescription);
      }
    };
  }, [title, description, keywords]);

  return null;
}
