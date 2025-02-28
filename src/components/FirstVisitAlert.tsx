
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info } from 'lucide-react';

const FirstVisitAlert = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('urduGptFirstVisit');
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem('urduGptFirstVisit', 'true');
    }
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="glass-effect border-urdu-accent/20 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-urdu-accent flex items-center gap-2">
            <Info size={20} />
            Welcome to UrduGPT
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/80">
            This application stores your chat history in your browser's local storage.
            No data is sent to external servers except for your conversations with the AI.
            Your chats are private and will persist between sessions on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="btn-primary">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FirstVisitAlert;
