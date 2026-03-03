import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
}

const SEOHead = ({ title, description, url, image, type = "website", author, publishedTime }: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = `${title} — AfuBlog`;
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

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:card", "summary_large_image");

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

    if (image) {
      setMeta("og:image", image, "property");
      setMeta("twitter:image", image);
    }

    if (author) setMeta("article:author", author, "property");
    if (publishedTime) setMeta("article:published_time", publishedTime, "property");

    return () => {
      document.title = "AfuBlog — Powered by AfuChat.com";
    };
  }, [title, description, url, image, type, author, publishedTime]);

  return null;
};

export default SEOHead;
