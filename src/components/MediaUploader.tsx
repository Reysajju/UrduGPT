import React, { useRef, useState, useEffect } from 'react';
import { X, Image as ImageIcon, FileAudio2, Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface MediaUploaderProps {
  onMediaSelect: (mediaData: { type: string; data: string }) => void;
  onClose: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaSelect, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'audio'>('image');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { toast } = useToast();
  
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

  // Handle recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setMediaPreview(result);
      onMediaSelect({ type: mediaType, data: result });
    };
    reader.readAsDataURL(file);
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks([...chunks]);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMediaPreview(audioUrl);
        
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onMediaSelect({ type: 'audio', data: base64data });
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Recording started",
        description: "Recording audio... Speak clearly.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording complete",
        description: "Audio recording saved.",
      });
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Take a photo using the device camera
  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create video element to display the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      
      // Create a modal to show the camera feed
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      modal.style.zIndex = '9999';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      
      // Add video to modal
      video.style.maxWidth = '100%';
      video.style.maxHeight = '80%';
      modal.appendChild(video);
      
      // Add capture button
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Capture Photo';
      captureBtn.style.marginTop = '20px';
      captureBtn.style.padding = '10px 20px';
      captureBtn.style.backgroundColor = '#4A90E2';
      captureBtn.style.color = 'white';
      captureBtn.style.border = 'none';
      captureBtn.style.borderRadius = '20px';
      captureBtn.style.cursor = 'pointer';
      modal.appendChild(captureBtn);
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Cancel';
      closeBtn.style.marginTop = '10px';
      closeBtn.style.padding = '10px 20px';
      closeBtn.style.backgroundColor = 'transparent';
      closeBtn.style.color = 'white';
      closeBtn.style.border = '1px solid white';
      closeBtn.style.borderRadius = '20px';
      closeBtn.style.cursor = 'pointer';
      modal.appendChild(closeBtn);
      
      document.body.appendChild(modal);
      
      // Handle capture button click
      captureBtn.onclick = () => {
        // Create canvas to capture the image
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setMediaPreview(dataUrl);
        onMediaSelect({ type: 'image', data: dataUrl });
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
        
        toast({
          title: "Photo captured",
          description: "Photo has been added to your message.",
        });
      };
      
      // Handle close button click
      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access failed",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-16 left-0 w-full max-w-xs mx-3 p-3 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-urdu-accent/20 z-10"
      aria-label="Media uploader"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Add Media</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary"
          aria-label="Close media uploader"
        >
          <X size={16} />
        </button>
      </div>
      
      <Tabs defaultValue="image" onValueChange={(value) => setMediaType(value as 'image' | 'audio')}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="image" className="flex items-center gap-1">
            <ImageIcon size={14} />
            <span>Image</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <FileAudio2 size={14} />
            <span>Audio</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="space-y-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={16} />
              <span>Upload Image</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1"
              onClick={takePhoto}
            >
              <Camera size={16} />
              <span>Take Photo</span>
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          
          {mediaPreview && mediaType === 'image' && (
            <div className="mt-3 relative">
              <img 
                src={mediaPreview} 
                alt="Preview" 
                className="w-full h-auto max-h-40 object-contain rounded-md border border-border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => {
                  setMediaPreview(null);
                  onMediaSelect({ type: 'image', data: '' });
                }}
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-3">
          <div className="flex flex-col gap-3">
            {!isRecording && !mediaPreview && (
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-1"
                onClick={startRecording}
              >
                <Mic size={16} />
                <span>Record Audio</span>
              </Button>
            )}
            
            {isRecording && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/20 animate-pulse">
                  <Mic size={24} className="text-destructive" />
                </div>
                <p className="text-sm font-medium">{formatTime(recordingTime)}</p>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={stopRecording}
                >
                  Stop Recording
                </Button>
              </div>
            )}
            
            {mediaPreview && mediaType === 'audio' && !isRecording && (
              <div className="mt-3 relative">
                <audio 
                  src={mediaPreview} 
                  controls 
                  className="w-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => {
                    setMediaPreview(null);
                    onMediaSelect({ type: 'audio', data: '' });
                  }}
                >
                  <X size={12} />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-3 text-xs text-muted-foreground">
        <p>Supported formats: JPEG, PNG, MP3, WAV</p>
        <p className="mt-1">Maximum file size: 5MB</p>
      </div>
    </div>
  );
};

export default MediaUploader;