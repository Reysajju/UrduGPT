import React from 'react';
import LandingPage from '@/components/LandingPage';
import { Helmet } from 'react-helmet';

const Index = () => {
  const currentURL = window.location.href;
  
  return (
    <>
      <Helmet>
        <title>UrduGPT - AI-powered Urdu Poetry Conversations</title>
        <meta name="description" content="Experience AI-powered Urdu Poetry Conversations with UrduGPT, a chatbot that communicates exclusively in Urdu verse." />
        
        {/* Primary Meta Tags */}
        <meta name="title" content="UrduGPT - AI-powered Urdu Poetry Conversations" />
        <meta name="keywords" content="urdu poetry, ai poetry, urdu chatbot, artificial intelligence, urdu language, urdu literature" />
        <meta name="author" content="Sajjad Rasool" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentURL} />
        <meta property="og:title" content="UrduGPT - AI-powered Urdu Poetry" />
        <meta property="og:description" content="Chat with an AI that responds only in beautiful Urdu poetry." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:site_name" content="UrduGPT" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentURL} />
        <meta name="twitter:title" content="UrduGPT - AI-powered Urdu Poetry" />
        <meta name="twitter:description" content="Chat with an AI that responds only in beautiful Urdu poetry." />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentURL} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/icons/icon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "UrduGPT",
              "description": "AI-powered Urdu Poetry Conversations",
              "applicationCategory": "ChatBot",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0"
              },
              "author": {
                "@type": "Person",
                "name": "Sajjad Rasool"
              },
              "url": "https://urdu-gpt.com",
              "screenshot": "https://urdu-gpt.com/screenshots/app-screenshot.png",
              "softwareVersion": "2.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "156"
              }
            }
          `}
        </script>
      </Helmet>
      <LandingPage />
    </>
  );
};

export default Index;