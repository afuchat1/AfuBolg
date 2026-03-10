import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "AfuBlog";
const DEFAULT_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/961f3453-ccf5-4e4c-98a8-1c8eb976238e/id-preview-c786fee2--4df49c7b-8881-4dc8-9a18-a4368c36a6c7.lovable.app-1771966350733.png";
const BASE_KEYWORDS = "AfuChat, AfuBlog, AI chatbot, artificial intelligence, tech news, AI updates, machine learning, natural language processing, chatbot platform, AI blog, tech insights";

const SEOHead = ({ title, description, url, image, type = "website", author, publishedTime, modifiedTime, keywords, jsonLd }: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const fullKeywords = keywords ? `${keywords}, ${BASE_KEYWORDS}` : BASE_KEYWORDS;

    // Basic meta
    setMeta("description", description);
    setMeta("keywords", fullKeywords);
    setMeta("author", author || "AfuChat");
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Open Graph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:image", image || DEFAULT_IMAGE, "property");
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:image:alt", title, "property");
    setMeta("og:locale", "en_US", "property");

    // Twitter Card
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", "@AfuChat");
    setMeta("twitter:image", image || DEFAULT_IMAGE);
    setMeta("twitter:image:alt", title);

    if (url) {
      setMeta("og:url", url, "property");
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    }

    if (author) setMeta("article:author", author, "property");
    if (publishedTime) setMeta("article:published_time", publishedTime, "property");
    if (modifiedTime) setMeta("article:modified_time", modifiedTime, "property");

    // JSON-LD structured data
    const existingScript = document.querySelector('script[data-seo="jsonld"]');
    if (existingScript) existingScript.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "jsonld");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = "AfuBlog — Powered by AfuChat.com";
      const ldScript = document.querySelector('script[data-seo="jsonld"]');
      if (ldScript) ldScript.remove();
    };
  }, [title, description, url, image, type, author, publishedTime, modifiedTime, keywords, jsonLd]);

  return null;
};

export default SEOHead;
