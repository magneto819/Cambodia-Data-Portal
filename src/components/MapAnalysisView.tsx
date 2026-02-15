import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Province } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { ProvinceCard } from './ProvinceCard';
import { SearchBar } from './SearchBar';
import { StatsCard } from './StatsCard';
import {
  Map, Users, Home, Building2, MapPin, TrendingUp, TrendingDown,
  Filter, X, ChevronDown, Info, BarChart3
} from 'lucide-react';

interface MapAnalysisViewProps {
  provinces: Province[];
}

export function MapAnalysisView({ provinces }: MapAnalysisViewProps) {
  const { language, t } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'population' | 'area' | 'density'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [populationRange, setPopulationRange] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!provinces || provinces.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('noData')}</p>
        </div>
      </div>
    );
  }

  const totalPopulation = provinces.reduce((sum, p) => sum + p.population, 0);
  const totalArea = provinces.reduce((sum, p) => sum + p.area_km2, 0);
  const avgDensity = totalPopulation / totalArea;

  const filteredProvinces = provinces
    .filter(province => {
      const query = searchQuery.toLowerCase();
      const nameMatch =
        province.name_en.toLowerCase().includes(query) ||
        province.name_km.includes(query) ||
        province.capital.toLowerCase().includes(query);

      let populationMatch = true;
      if (populationRange === 'high') {
        populationMatch = province.population > 500000;
      } else if (populationRange === 'medium') {
        populationMatch = province.population >= 200000 && province.population <= 500000;
      } else if (populationRange === 'low') {
        populationMatch = province.population < 200000;
      }

      return nameMatch && populationMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'population':
          return b.population - a.population;
        case 'area':
          return b.area_km2 - a.area_km2;
        case 'density':
          return b.density - a.density;
        default:
          return language === 'km'
            ? a.name_km.localeCompare(b.name_km)
            : a.name_en.localeCompare(b.name_en);
      }
    });

  const largestProvince = [...provinces].sort((a, b) => b.population - a.population)[0];
  const smallestProvince = [...provinces].sort((a, b) => a.population - b.population)[0];
  const mostDense = [...provinces].sort((a, b) => b.density - a.density)[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('totalProvinces')}
          value={provinces.length}
          icon={Map}
          color="blue"
        />
        <StatsCard
          title={t('totalPopulation')}
          value={totalPopulation.toLocaleString()}
          icon={Users}
          color="green"
        />
        <StatsCard
          title={t('totalArea')}
          value={`${totalArea.toLocaleString()} km²`}
          icon={Building2}
          color="purple"
        />
        <StatsCard
          title={t('avgDensity')}
          value={`${avgDensity.toFixed(1)}/km²`}
          icon={Home}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t('interactiveMap')}</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>{t('clickProvinceForDetails')}</span>
          </div>
        </div>
        <InteractiveMap
          provinces={provinces}
          selectedProvince={selectedProvince}
          onProvinceSelect={setSelectedProvince}
        />
      </div>

      {selectedProvince && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">
                    {language === 'km' ? selectedProvince.name_km : selectedProvince.name_en}
                  </h3>
                  <p className="text-blue-100">{t('capital')}: {selectedProvince.capital}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sm text-blue-100 mb-1">{t('population')}</div>
                  <div className="text-xl font-bold">{selectedProvince.population.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sm text-blue-100 mb-1">{t('area')}</div>
                  <div className="text-xl font-bold">{selectedProvince.area_km2.toLocaleString()} km²</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sm text-blue-100 mb-1">{t('density')}</div>
                  <div className="text-xl font-bold">{selectedProvince.density.toFixed(1)}/km²</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sm text-blue-100 mb-1">{t('code')}</div>
                  <div className="text-xl font-bold">{selectedProvince.code}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedProvince(null)}
              className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('largestProvince')}</h3>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-gray-900">
              {language === 'km' ? largestProvince.name_km : largestProvince.name_en}
            </div>
            <div className="text-sm text-gray-600">
              {largestProvince.population.toLocaleString()} {t('people')}
            </div>
            <button
              onClick={() => setSelectedProvince(largestProvince)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('viewDetails')} →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('smallestProvince')}</h3>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-gray-900">
              {language === 'km' ? smallestProvince.name_km : smallestProvince.name_en}
            </div>
            <div className="text-sm text-gray-600">
              {smallestProvince.population.toLocaleString()} {t('people')}
            </div>
            <button
              onClick={() => setSelectedProvince(smallestProvince)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('viewDetails')} →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('mostDense')}</h3>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-gray-900">
              {language === 'km' ? mostDense.name_km : mostDense.name_en}
            </div>
            <div className="text-sm text-gray-600">
              {mostDense.density.toFixed(1)} {t('peoplePerKm2')}
            </div>
            <button
              onClick={() => setSelectedProvince(mostDense)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('viewDetails')} →
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('allProvinces')}</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>{t('filters')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('search')}</label>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">{t('name')}</option>
                  <option value="population">{t('population')}</option>
                  <option value="area">{t('area')}</option>
                  <option value="density">{t('density')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('populationRange')}</label>
                <select
                  value={populationRange}
                  onChange={(e) => setPopulationRange(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('all')}</option>
                  <option value="high">{t('highPopulation')} (&gt; 500K)</option>
                  <option value="medium">{t('mediumPopulation')} (200K - 500K)</option>
                  <option value="low">{t('lowPopulation')} (&lt; 200K)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
          {t('showing')} <span className="font-semibold">{filteredProvinces.length}</span> {t('of')} <span className="font-semibold">{provinces.length}</span> {t('provinces')}
        </div>

        {filteredProvinces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProvinces.map(province => (
              <ProvinceCard
                key={province.id}
                province={province}
                onClick={() => setSelectedProvince(province)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('noResults')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPopulationRange('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
