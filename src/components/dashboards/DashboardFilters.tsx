import { useLanguage } from '../../contexts/LanguageContext';
import { Download } from 'lucide-react';

interface DashboardFiltersProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  provinces?: { id: string; name_km: string; name_en: string }[];
  selectedProvince?: string;
  onProvinceChange?: (provinceId: string) => void;
  onExport?: () => void;
}

export function DashboardFilters({
  years,
  selectedYear,
  onYearChange,
  provinces,
  selectedProvince,
  onProvinceChange,
  onExport,
}: DashboardFiltersProps) {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-semibold text-gray-700">
            {t('year')}:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {provinces && onProvinceChange && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('province')}:
            </label>
            <select
              value={selectedProvince || 'all'}
              onChange={(e) => onProvinceChange(e.target.value === 'all' ? '' : e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('allProvinces')}</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {language === 'km' ? province.name_km : province.name_en}
                </option>
              ))}
            </select>
          </div>
        )}

        {onExport && (
          <button
            onClick={onExport}
            className="ml-auto flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('exportData')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
