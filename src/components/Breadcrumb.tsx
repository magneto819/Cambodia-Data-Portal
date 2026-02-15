import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 overflow-x-auto">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors flex-shrink-0"
      >
        <Home className="w-4 h-4" />
        <span>{t('home')}</span>
      </button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-semibold whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
