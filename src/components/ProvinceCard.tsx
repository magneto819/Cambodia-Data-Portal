import { MapPin, Users, Maximize } from 'lucide-react';
import { Province } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProvinceCardProps {
  province: Province;
  onClick: () => void;
}

export function ProvinceCard({ province, onClick }: ProvinceCardProps) {
  const { language, t } = useLanguage();

  const name = language === 'km' ? province.name_km : province.name_en;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 hover:border-blue-400 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">
            {t('capital')}: {province.capital}
          </p>
        </div>
        <div className="bg-blue-100 p-2 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {t('population')}
          </span>
          <span className="font-semibold text-gray-900">
            {province.population.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <Maximize className="w-4 h-4 mr-1" />
            {t('area')}
          </span>
          <span className="font-semibold text-gray-900">
            {province.area_km2.toLocaleString()} km²
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="text-sm">
            <span className="text-gray-600">{t('density')}: </span>
            <span className="font-semibold text-gray-900">
              {province.density ? `${province.density.toFixed(1)} ${t('perKm2')}` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
