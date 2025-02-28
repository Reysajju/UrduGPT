import React from 'react';
import { useFileCache } from '@/hooks/use-file-cache';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Image as ImageIcon, FileAudio2, FileVideo, FileSpreadsheet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface CachedFileManagerProps {
  onSelectFile?: (content: string) => void;
}

const CachedFileManager: React.FC<CachedFileManagerProps> = ({ onSelectFile }) => {
  const { cachedFiles, removeFile, clearCache } = useFileCache();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={16} className="text-blue-500" />;
    if (type.startsWith('audio/')) return <FileAudio2 size={16} className="text-green-500" />;
    if (type.startsWith('video/')) return <FileVideo size={16} className="text-purple-500" />;
    if (type === 'application/pdf') return <FileText size={16} className="text-red-500" />;
    if (type === 'text/csv' || type === 'application/vnd.ms-excel') return <FileSpreadsheet size={16} className="text-green-500" />;
    return <FileText size={16} className="text-urdu-accent" />;
  };

  const handleClearCache = () => {
    clearCache();
    toast({
      title: "Cache cleared",
      description: "All cached files have been removed.",
    });
  };

  const handleRemoveFile = (id: string, name: string) => {
    removeFile(id);
    toast({
      title: "File removed",
      description: `${name} has been removed from cache.`,
    });
  };

  if (cachedFiles.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No cached files found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Cached Files ({cachedFiles.length})</h3>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearCache}
          className="flex items-center gap-1"
        >
          <Trash2 size={14} />
          Clear All
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {cachedFiles.map(file => (
          <div 
            key={file.id} 
            className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-background rounded-md">
                {getFileIcon(file.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {formatDistanceToNow(file.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              {onSelectFile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onSelectFile(file.content)}
                  className="text-xs"
                >
                  Use
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveFile(file.id, file.name)}
                className="text-destructive text-xs"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CachedFileManager;