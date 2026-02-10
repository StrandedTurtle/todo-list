import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx';
import { AppSidebar } from './components/app-sidebar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <App />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  </StrictMode>
);
