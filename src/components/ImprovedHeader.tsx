import { Globe, Map, BarChart3, Search, ChevronDown, LineChart, Lightbulb, Database, Layers, Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { useState, useEffect, useRef } from 'react';

const languageNames: Record<Language, string> = {
  km: 'ខ្មែរ',
  en: 'English',
  zh: '中文'
};

export type ViewType = 'map' | 'browse' | 'statistics' | 'dashboards' | 'insights' | 'catalog' | 'thematic' | 'sources';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  view: ViewType;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ImprovedHeader({ currentView, onViewChange }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
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

  const navCategories: NavCategory[] = [
    {
      title: t('navCategoryExploration'),
      items: [
        { icon: Map, label: t('map'), description: t('navDescMap'), view: 'map' },
        { icon: Search, label: t('browse'), description: t('navDescBrowse'), view: 'browse' },
        { icon: BarChart3, label: t('statistics'), description: t('navDescStatistics'), view: 'statistics' }
      ]
    },
    {
      title: t('navCategoryInsights'),
      items: [
        { icon: LineChart, label: t('dashboards'), description: t('navDescDashboards'), view: 'dashboards' },
        { icon: Lightbulb, label: t('insights'), description: t('navDescInsights'), view: 'insights' }
      ]
    },
    {
      title: t('navCategoryResources'),
      items: [
        { icon: Database, label: t('dataCatalog'), description: t('navDescCatalog'), view: 'catalog' },
        { icon: Layers, label: t('thematicData'), description: t('navDescThematic'), view: 'thematic' },
        { icon: Globe, label: t('dataSources'), description: t('navDescSources'), view: 'sources' }
      ]
    }
  ];

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
    setShowMobileMenu(false);
    setExpandedCategory(null);
  };

  const getCurrentCategory = () => {
    for (let i = 0; i < navCategories.length; i++) {
      if (navCategories[i].items.some(item => item.view === currentView)) {
        return navCategories[i];
      }
    }
    return null;
  };

  const getCurrentItem = () => {
    for (const category of navCategories) {
      const item = category.items.find(item => item.view === currentView);
      if (item) return item;
    }
    return null;
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
              <p className="text-xs sm:text-sm text-blue-100 hidden md:block line-clamp-1">
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

        <nav className="hidden lg:flex mt-4 border-t border-blue-500 pt-3">
          <div className="flex space-x-1 w-full">
            {navCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="relative group">
                <button
                  className="px-3 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  onMouseEnter={() => setExpandedCategory(categoryIndex)}
                >
                  {category.title}
                  <ChevronDown className="inline-block w-3 h-3 ml-1" />
                </button>

                {expandedCategory === categoryIndex && (
                  <div
                    className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                    onMouseLeave={() => setExpandedCategory(null)}
                  >
                    {category.items.map((item) => (
                      <button
                        key={item.view}
                        onClick={() => handleNavClick(item.view)}
                        className={`w-full text-left px-4 py-3 transition-colors border-l-4 ${
                          currentView === item.view
                            ? 'bg-blue-50 text-blue-700 border-blue-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 border-transparent'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <item.icon className={`w-5 h-5 mt-0.5 ${currentView === item.view ? 'text-blue-700' : 'text-gray-400'}`} />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="hidden lg:block mt-2">
          <Breadcrumb
            category={getCurrentCategory()}
            item={getCurrentItem()}
            onHomeClick={() => handleNavClick('map')}
          />
        </div>
      </div>

      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <nav className="fixed top-[72px] sm:top-[80px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto lg:hidden">
            <div className="py-2">
              {navCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-1">
                  <div className="px-4 py-3 bg-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    {category.title}
                  </div>
                  {category.items.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`w-full flex items-start space-x-4 px-6 py-4 transition-colors border-l-4 ${
                        currentView === item.view
                          ? 'bg-blue-50 text-blue-700 border-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${currentView === item.view ? 'text-blue-700' : 'text-gray-500'}`} />
                      <div className="text-left">
                        <div className="text-base font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

interface BreadcrumbProps {
  category: NavCategory | null;
  item: NavItem | null;
  onHomeClick: () => void;
}

function Breadcrumb({ category, item, onHomeClick }: BreadcrumbProps) {
  const { t } = useLanguage();

  if (!category || !item) return null;

  return (
    <div className="flex items-center space-x-2 text-xs text-blue-100">
      <button
        onClick={onHomeClick}
        className="hover:text-white transition-colors"
      >
        {t('home')}
      </button>
      <ChevronRight className="w-3 h-3" />
      <span>{category.title}</span>
      <ChevronRight className="w-3 h-3" />
      <span className="text-white font-semibold">{item.label}</span>
    </div>
  );
}
