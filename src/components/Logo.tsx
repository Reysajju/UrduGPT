
import React from 'react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 bg-urdu-accent rounded-xl flex items-center justify-center overflow-hidden">
        <span className="text-white font-bold text-xl">U</span>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-md flex items-center justify-center">
          <span className="text-urdu-accent font-bold text-xs">G</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-white text-xl leading-none">UrduGPT</span>
        <span className="text-xs text-white/70">by Sajjad Rasool</span>
      </div>
    </div>
  );
};

export default Logo;
