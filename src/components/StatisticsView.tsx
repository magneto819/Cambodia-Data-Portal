import { Province } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';

interface StatisticsViewProps {
  provinces: Province[];
}

export function StatisticsView({ provinces }: StatisticsViewProps) {
  const { language, t } = useLanguage();

  const totalPopulation = provinces.reduce((sum, p) => sum + p.population, 0);
  const totalArea = provinces.reduce((sum, p) => sum + p.area_km2, 0);
  const avgDensity = totalPopulation / totalArea;

  const sortedByPopulation = [...provinces].sort((a, b) => b.population - a.population);
  const sortedByArea = [...provinces].sort((a, b) => b.area_km2 - a.area_km2);
  const sortedByDensity = [...provinces].sort((a, b) => b.density - a.density);

  const getName = (province: Province) => {
    return language === 'km' ? province.name_km : province.name_en;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {t('statisticsOverview')}
          </h2>
        </div>
        <p className="text-gray-600">
          {t('statisticsDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{provinces.length}</div>
              <div className="text-blue-100 text-sm">{t('totalProvinces')}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{(totalPopulation / 1000000).toFixed(2)}M</div>
              <div className="text-green-100 text-sm">{t('totalPopulation')}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{avgDensity.toFixed(1)}</div>
              <div className="text-orange-100 text-sm">{t('avgDensity')} /km²</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            {t('topByPopulation')}
          </h3>
          <div className="space-y-3">
            {sortedByPopulation.slice(0, 5).map((province, index) => (
              <div key={province.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getName(province)}</div>
                    <div className="text-sm text-gray-500">{province.population.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            {t('topByArea')}
          </h3>
          <div className="space-y-3">
            {sortedByArea.slice(0, 5).map((province, index) => (
              <div key={province.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getName(province)}</div>
                    <div className="text-sm text-gray-500">{province.area_km2.toLocaleString()} km²</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
            {t('topByDensity')}
          </h3>
          <div className="space-y-3">
            {sortedByDensity.slice(0, 5).map((province, index) => (
              <div key={province.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getName(province)}</div>
                    <div className="text-sm text-gray-500">{province.density.toFixed(1)} /km²</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
