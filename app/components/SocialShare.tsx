'use client';

import React from 'react';

type Props = {
  url?: string;
  title?: string;
  text?: string;
};

export default function SocialShare({ url, title, text }: Props) {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const shareText = text || title || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      // lightweight feedback - small, non-blocking
      const el = document.createElement('div');
      el.textContent = 'Link copied to clipboard';
      el.setAttribute('role', 'status');
      el.className = 'sr-only';
      document.body.appendChild(el);
      setTimeout(() => document.body.removeChild(el), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: currentUrl });
      } catch (e) {
        // user probably cancelled
        console.error('Web share failed', e);
      }
    } else {
      handleCopy();
    }
  };

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4" role="group" aria-label="Share this page">
      <button
        onClick={handleWebShare}
        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        aria-label="Share"
        type="button"
      >
        🔗 Share
      </button>

      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 bg-sky-500 text-white rounded-md text-sm hover:opacity-90 transition"
        aria-label="Share on Twitter"
      >
        🐦 Tweet
      </a>

      <a
        href={fbHref}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 bg-blue-800 text-white rounded-md text-sm hover:opacity-90 transition"
        aria-label="Share on Facebook"
      >
        📘 Share
      </a>

      <a
        href={linkedInHref}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 bg-blue-700 text-white rounded-md text-sm hover:opacity-90 transition"
        aria-label="Share on LinkedIn"
      >
        🔗 LinkedIn
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:opacity-90 transition"
        aria-label="Share on WhatsApp"
      >
        💬 WhatsApp
      </a>

      <button
        onClick={handleCopy}
        className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm border hover:bg-gray-200 transition"
        aria-label="Copy link"
        type="button"
      >
        📋 Copy
      </button>
    </div>
  );
}
