import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import AuthPage from "./pages/AuthPage";
import WritePage from "./pages/WritePage";
import EditArticlePage from "./pages/EditArticlePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageAdmins from "./pages/AdminManageAdmins";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SearchPage from "./pages/SearchPage";
import ArchivePage from "./pages/ArchivePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class" enableSystem>
      <TooltipProvider>
        <Toaster />
        <ToasterSonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/edit/:id" element={<EditArticlePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/admins" element={<AdminManageAdmins />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
