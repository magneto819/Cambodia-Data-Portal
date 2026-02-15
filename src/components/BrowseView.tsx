import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Province } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BrowseViewProps {
  provinces: Province[];
}

export function BrowseView({ provinces }: BrowseViewProps) {
  const { language, t } = useLanguage();
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);

  const getName = (province: Province) => {
    return language === 'km' ? province.name_km : province.name_en;
  };

  const toggleProvince = (provinceId: string) => {
    setExpandedProvince(expandedProvince === provinceId ? null : provinceId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('browseData')}
        </h2>
        <p className="text-gray-600">
          {t('browseDescription')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {provinces.map((province) => (
            <div key={province.id}>
              <button
                onClick={() => toggleProvince(province.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {expandedProvince === province.id ? (
                    <ChevronDown className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-lg">
                      {getName(province)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t('capital')}: {province.capital}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{t('population')}</div>
                  <div className="font-semibold text-gray-900">
                    {province.population.toLocaleString()}
                  </div>
                </div>
              </button>

              {expandedProvince === province.id && (
                <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t('capital')}</div>
                      <div className="font-semibold text-gray-900">{province.capital}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t('population')}</div>
                      <div className="font-semibold text-gray-900">
                        {province.population.toLocaleString()} {t('people')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t('area')}</div>
                      <div className="font-semibold text-gray-900">
                        {province.area_km2.toLocaleString()} km²
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t('density')}</div>
                      <div className="font-semibold text-gray-900">
                        {province.density ? `${province.density.toFixed(1)} ${t('perKm2')}` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{t('provinceCode')}</div>
                      <div className="font-semibold text-gray-900">{province.code}</div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-700">
                      {t('additionalDataComingSoon')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
