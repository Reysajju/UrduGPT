import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useEffect } from "react";
import Logo from '@/components/Logo';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-urdu-light to-urdu-secondary/90 dark:from-urdu-dark dark:to-urdu-dark/90 p-4">
      <Helmet>
        <title>Page Not Found - UrduGPT</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="text-center bg-background/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-urdu-accent/20 max-w-md w-full">
        <Logo className="mx-auto mb-6" variant="dark" />
        
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-foreground/80 mb-6">Oops! Page not found</p>
        
        <p className="mb-8 text-foreground/70">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center justify-center"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;