import { useEffect, useState } from 'react';

interface CachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  timestamp: number;
}

// Cache expiration time (7 days in milliseconds)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

export function useFileCache() {
  const [cachedFiles, setCachedFiles] = useState<CachedFile[]>([]);

  // Load cached files from localStorage on mount
  useEffect(() => {
    try {
      const storedFiles = localStorage.getItem('urduGptCachedFiles');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles) as CachedFile[];
        
        // Filter out expired files
        const now = Date.now();
        const validFiles = parsedFiles.filter(
          file => now - file.timestamp < CACHE_EXPIRATION
        );
        
        setCachedFiles(validFiles);
        
        // If we filtered out some expired files, update localStorage
        if (validFiles.length !== parsedFiles.length) {
          localStorage.setItem('urduGptCachedFiles', JSON.stringify(validFiles));
        }
      }
    } catch (error) {
      console.error('Failed to load cached files:', error);
      // Clear corrupted cache
      localStorage.removeItem('urduGptCachedFiles');
    }
  }, []);

  // Save file to cache
  const cacheFile = (file: {
    name: string;
    type: string;
    size: number;
    content: string;
  }) => {
    const newCachedFile: CachedFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...file,
      timestamp: Date.now(),
    };

    const updatedFiles = [...cachedFiles, newCachedFile];
    setCachedFiles(updatedFiles);
    
    // Save to localStorage
    try {
      localStorage.setItem('urduGptCachedFiles', JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Failed to cache file:', error);
    }
    
    return newCachedFile.id;
  };

  // Get file from cache by ID
  const getFileById = (id: string) => {
    return cachedFiles.find(file => file.id === id);
  };

  // Remove file from cache
  const removeFile = (id: string) => {
    const updatedFiles = cachedFiles.filter(file => file.id !== id);
    setCachedFiles(updatedFiles);
    
    // Update localStorage
    try {
      localStorage.setItem('urduGptCachedFiles', JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Failed to update cache after removal:', error);
    }
  };

  // Clear all cached files
  const clearCache = () => {
    setCachedFiles([]);
    localStorage.removeItem('urduGptCachedFiles');
  };

  return {
    cachedFiles,
    cacheFile,
    getFileById,
    removeFile,
    clearCache
  };
}