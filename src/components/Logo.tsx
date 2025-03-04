import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo = ({ className = "", variant = 'light' }: LogoProps) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-urdu-dark';
  const bgColor = variant === 'light' ? 'bg-urdu-accent' : 'bg-urdu-accent';
  const accentColor = variant === 'light' ? 'text-urdu-accent' : 'text-white';
  const accentBg = variant === 'light' ? 'bg-white' : 'bg-urdu-dark';
  
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="UrduGPT Logo">
      <img 
        src="/urdu-logo.png" 
        alt="UrduGPT Logo" 
        className="w-10 h-10 rounded-xl transition-transform hover:scale-105 duration-300"
      />
      <div className="flex flex-col">
        <span className={`font-bold ${variant === 'light' ? 'text-white' : 'text-urdu-dark'} text-xl leading-none`}>UrduGPT</span>
        <span className={`text-xs ${variant === 'light' ? 'text-white/70' : 'text-urdu-dark/70'}`}>by Sajjad Rasool</span>
      </div>
    </div>
  );
};

export default Logo;