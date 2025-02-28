import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileDropZoneProps {
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileDrop, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Maximum file size is 5MB.",
            variant: "destructive",
          });
          return;
        }
        
        onFileDrop(file);
        
        toast({
          title: "File received",
          description: `${file.name} is ready to be added to your message.`,
        });
      }
    };

    // Add event listeners to the entire document
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      // Clean up
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [onFileDrop]);

  return (
    <>
      {/* Overlay that appears when dragging */}
      {isDragging && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 p-8 rounded-xl border-2 border-dashed border-urdu-accent/50 flex flex-col items-center">
            <Upload size={48} className="text-urdu-accent mb-4 animate-bounce" />
            <h3 className="text-xl font-medium mb-2">Drop your file here</h3>
            <p className="text-muted-foreground">Release to upload</p>
          </div>
        </div>
      )}
      
      {/* Render children normally */}
      {children}
    </>
  );
};

export default FileDropZone;