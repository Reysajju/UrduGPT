import React, { useRef, useState, useEffect } from 'react';
import { X, Upload, FileText, Image as ImageIcon, FileAudio2, FileVideo, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileCache } from '@/hooks/use-file-cache';

interface FileUploaderProps {
  onFileContent: (content: string) => void;
  onClose: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileContent, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cachedFiles, cacheFile } = useFileCache();
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={16} className="text-blue-500" />;
    if (type.startsWith('audio/')) return <FileAudio2 size={16} className="text-green-500" />;
    if (type.startsWith('video/')) return <FileVideo size={16} className="text-purple-500" />;
    if (type === 'application/pdf') return <FileText size={16} className="text-red-500" />;
    if (type === 'text/csv' || type === 'application/vnd.ms-excel') return <FileSpreadsheet size={16} className="text-green-500" />;
    return <FileText size={16} className="text-urdu-accent" />;
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setFileType(file.type);
    setError(null);
    setIsLoading(true);
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      setIsLoading(false);
      return;
    }
    
    // Handle different file types
    if (file.type.startsWith('text/') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv')) {
      // Text files - read as text
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          // Truncate if too long (limit to ~2000 chars)
          const truncated = content.length > 2000 
            ? content.substring(0, 2000) + "... (content truncated due to length)"
            : content;
          
          // Cache the file
          cacheFile({
            name: file.name,
            type: file.type,
            size: file.size,
            content: truncated
          });
          
          onFileContent(truncated);
        }
        setIsLoading(false);
      };
      
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setIsLoading(false);
      };
      
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
      // Image files - create a description
      const imageDescription = `[Image: ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type})]`;
      
      // Cache the file
      cacheFile({
        name: file.name,
        type: file.type,
        size: file.size,
        content: imageDescription
      });
      
      onFileContent(imageDescription);
      setIsLoading(false);
    } else if (file.type.startsWith('audio/')) {
      // Audio files - create a description
      const audioDescription = `[Audio: ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type})]`;
      
      // Cache the file
      cacheFile({
        name: file.name,
        type: file.type,
        size: file.size,
        content: audioDescription
      });
      
      onFileContent(audioDescription);
      setIsLoading(false);
    } else if (file.type.startsWith('video/')) {
      // Video files - create a description
      const videoDescription = `[Video: ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type})]`;
      
      // Cache the file
      cacheFile({
        name: file.name,
        type: file.type,
        size: file.size,
        content: videoDescription
      });
      
      onFileContent(videoDescription);
      setIsLoading(false);
    } else if (file.type === 'application/pdf') {
      // PDF files - create a description
      const pdfDescription = `[PDF Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`;
      
      // Cache the file
      cacheFile({
        name: file.name,
        type: file.type,
        size: file.size,
        content: pdfDescription
      });
      
      onFileContent(pdfDescription);
      setIsLoading(false);
    } else {
      // Other file types - create a generic description
      const fileDescription = `[File: ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type || 'unknown type'})]`;
      
      // Cache the file
      cacheFile({
        name: file.name,
        type: file.type,
        size: file.size,
        content: fileDescription
      });
      
      onFileContent(fileDescription);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-16 left-0 w-full max-w-xs mx-3 p-3 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-urdu-accent/20 z-10"
      aria-label="File uploader"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Upload a file</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary"
          aria-label="Close file uploader"
        >
          <X size={16} />
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*,video/*,application/pdf,text/plain,text/markdown,text/csv,application/json,application/vnd.ms-excel"
      />
      
      {fileName && fileType && (
        <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md mb-2">
          {getFileIcon(fileType)}
          <span className="text-sm truncate">{fileName}</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}
      
      <Button
        type="button"
        onClick={triggerFileInput}
        className="w-full flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        <Upload size={16} />
        {isLoading ? "Processing..." : "Select File"}
      </Button>
      
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Supports images, audio, video, PDF, CSV, and text files up to 5MB.</p>
        <p className="mt-1">You can also drag & drop files anywhere on the page.</p>
      </div>
      
      {cachedFiles.length > 0 && (
        <div className="mt-3 border-t border-border pt-2">
          <h4 className="text-xs font-medium mb-1">Recent files:</h4>
          <div className="max-h-24 overflow-y-auto">
            {cachedFiles.slice(-3).reverse().map(file => (
              <div 
                key={file.id}
                className="flex items-center gap-2 p-1.5 text-xs hover:bg-secondary/50 rounded cursor-pointer"
                onClick={() => {
                  onFileContent(file.content);
                  onClose();
                }}
              >
                {getFileIcon(file.type)}
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;