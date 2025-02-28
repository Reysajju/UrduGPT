import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load the ChatPage component
const ChatPage = lazy(() => import("./pages/ChatPage"));

// Create a loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-urdu-dark">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-16 h-16 bg-urdu-accent/30 rounded-xl mb-4"></div>
      <div className="h-4 w-24 bg-white/20 rounded"></div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#4A90E2" />
        <meta name="color-scheme" content="light dark" />
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={
              <Suspense fallback={<PageLoading />}>
                <ChatPage />
              </Suspense>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;