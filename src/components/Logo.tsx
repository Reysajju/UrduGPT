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
      <div className={`relative w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300`}>
        <span className={`${textColor} font-bold text-xl`}>U</span>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${accentBg} rounded-md flex items-center justify-center shadow-md`}>
          <span className={`${accentColor} font-bold text-xs`}>G</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${variant === 'light' ? 'text-white' : 'text-urdu-dark'} text-xl leading-none`}>UrduGPT</span>
        <span className={`text-xs ${variant === 'light' ? 'text-white/70' : 'text-urdu-dark/70'}`}>by Sajjad Rasool</span>
      </div>
    </div>
  );
};

export default Logo;