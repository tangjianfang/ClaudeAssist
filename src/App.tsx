import { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TopBar } from './components/Layout/TopBar';
import { Sidebar } from './components/Layout/Sidebar';
import { HomePage } from './pages/Home';
import { SectionPage } from './pages/Section';
import { CheatsheetPage } from './pages/Cheatsheet';
import { SearchResults } from './pages/SearchResults';
import { ScenariosPage } from './pages/Scenarios';
import { FavoritesPage } from './pages/Favorites';
import { FeaturesPage } from './pages/Features';
import { PluginsPage } from './pages/Plugins';
import { ClawCodePage } from './pages/ClawCode';
import { LanguageProvider } from './i18n';
import { FavoritesProvider } from './context/FavoritesContext';
import { useSearch } from './hooks/useSearch';
import { useLanguage } from './i18n';

function AppInner() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('ca-dark');
    if (stored !== null) return stored === '1';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const navigate = useNavigate();

  function toggleDark() {
    setDarkMode((d) => {
      const next = !d;
      localStorage.setItem('ca-dark', next ? '1' : '0');
      return next;
    });
  }

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Global Ctrl+K shortcut
  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [handleGlobalKey]);

  // When search starts, navigate to search results
  function handleQueryChange(q: string) {
    setQuery(q);
    if (q.trim()) {
      navigate('/search');
    }
  }

  const searchResults = useSearch(query, lang);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopBar
        query={query}
        onQueryChange={handleQueryChange}
        darkMode={darkMode}
        onToggleDark={toggleDark}
        onMenuOpen={() => setMobileMenuOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden max-w-screen-2xl mx-auto w-full">
        {/* Desktop Sidebar */}
        <div className="shrink-0 w-56 hidden md:flex overflow-y-auto pl-4">
          <Sidebar />
        </div>

        {/* Mobile sidebar drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 overflow-y-auto md:hidden shadow-xl pl-4">
              <Sidebar onClose={() => setMobileMenuOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults results={searchResults} query={query} />} />
            <Route path="/cheatsheet" element={<CheatsheetPage />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/plugins" element={<PluginsPage />} />
            <Route path="/clawcode" element={<ClawCodePage />} />
            <Route path="/:sectionId" element={<SectionPage globalQuery={query} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-slate-100 dark:border-slate-800 px-4 py-2 text-center text-xs text-slate-400">
        {/* lazy-load lang from context */}
        <FooterText />
      </footer>
    </div>
  );
}

function FooterText() {
  const { t } = useLanguage();
  return <span>{t.footer}</span>;
}

export default function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <FavoritesProvider>
          <AppInner />
        </FavoritesProvider>
      </LanguageProvider>
    </HashRouter>
  );
}
