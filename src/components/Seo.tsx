import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

interface SeoProps {
  /** Page title. The site name is appended automatically. */
  title: string;
  description: string;
  /** Canonical path, e.g. "/food-menu". Defaults to the current path. */
  path?: string;
  /** Absolute or root-relative social image. */
  image?: string;
  /** Set false for private pages (login, dashboards, auth flows). */
  indexable?: boolean;
  /** Optional extra JSON-LD object to inject for this page. */
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Lightweight per-page SEO manager for the SPA. Keeps <title>, meta
 * description, canonical URL and social tags in sync with the active route.
 *
 * Note: client-rendered tags help in-app navigation and link unfurlers that
 * execute JS, but crawlers that don't run JS only see index.html — which is
 * why index.html carries the full default tag set and JSON-LD.
 */
export function Seo({ title, description, path, image, indexable = true, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.name}`;
    const canonicalPath = path ?? window.location.pathname;
    const canonical = `${siteConfig.siteUrl}${canonicalPath}`;
    const socialImage = image
      ? image.startsWith("http")
        ? image
        : `${siteConfig.siteUrl}${image}`
      : `${siteConfig.siteUrl}/images/IMG-20250516-WA0003.jpg`;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow");
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", socialImage);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", socialImage);

    let jsonLdEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.dataset.pageJsonLd = "true";
      jsonLdEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdEl);
    }

    return () => {
      document.head.querySelectorAll('script[data-page-json-ld="true"]').forEach((n) => n.remove());
    };
  }, [title, description, path, image, indexable, jsonLd]);

  return null;
}
