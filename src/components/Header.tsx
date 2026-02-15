import { Globe, Map, BarChart3, Search, ChevronDown, LineChart, Lightbulb, Database, Layers, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { useState, useEffect, useRef } from 'react';

const languageNames: Record<Language, string> = {
  km: 'ខ្មែរ',
  en: 'English',
  zh: '中文'
};

export type ViewType = 'map' | 'browse' | 'statistics' | 'dashboards' | 'insights' | 'catalog' | 'thematic' | 'sources';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const navItems = [
    { icon: Map, label: t('map'), view: 'map' as ViewType },
    { icon: Search, label: t('browse'), view: 'browse' as ViewType },
    { icon: BarChart3, label: t('statistics'), view: 'statistics' as ViewType },
    { icon: LineChart, label: t('dashboards'), view: 'dashboards' as ViewType },
    { icon: Lightbulb, label: t('insights'), view: 'insights' as ViewType },
    { icon: Database, label: t('dataCatalog'), view: 'catalog' as ViewType },
    { icon: Layers, label: t('thematicData'), view: 'thematic' as ViewType },
    { icon: Globe, label: t('dataSources'), view: 'sources' as ViewType }
  ];

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Map className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                {t('appTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block line-clamp-1">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base hidden sm:inline">{languageNames[language]}</span>
                <span className="font-medium text-sm sm:hidden">{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors ${
                        language === lang
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        <nav className="hidden lg:flex mt-4 space-x-2 xl:space-x-4 border-t border-blue-500 pt-3">
          {navItems.map((item) => (
            <NavLink
              key={item.view}
              icon={<item.icon className="w-4 h-4" />}
              label={item.label}
              active={currentView === item.view}
              onClick={() => handleNavClick(item.view)}
            />
          ))}
        </nav>
      </div>

      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <nav className="fixed top-[72px] sm:top-[80px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto lg:hidden">
            <div className="py-4">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.view}
                  icon={<item.icon className="w-5 h-5" />}
                  label={item.label}
                  active={currentView === item.view}
                  onClick={() => handleNavClick(item.view)}
                />
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavLink({ icon, label, active = false, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all whitespace-nowrap ${
        active
          ? 'bg-white/20 text-white shadow-md'
          : 'text-blue-100 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function MobileNavLink({ icon, label, active = false, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-4 px-6 py-4 transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-semibold'
          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
      }`}
    >
      <span className={active ? 'text-blue-700' : 'text-gray-500'}>{icon}</span>
      <span className="text-base">{label}</span>
    </button>
  );
}
