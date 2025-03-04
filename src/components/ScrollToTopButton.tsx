import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrollToTopButtonProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Show button when scrolled down 300px
      setIsVisible(container.scrollTop > 300);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed bottom-20 right-4 z-10 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp size={18} />
    </Button>
  );
};

export default ScrollToTopButton;