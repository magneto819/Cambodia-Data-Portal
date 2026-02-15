import { useState, useEffect } from 'react';
import { ProvinceData, MapLayer, MapVisualization } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { EnhancedInteractiveMap } from './EnhancedInteractiveMap';
import { MapFilterPanel } from './MapFilterPanel';
import { MapDataSummary } from './MapDataSummary';
import { Search, X, MapPin, TrendingUp, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedMapViewProps {
  provinces: ProvinceData[];
}

export function EnhancedMapView({ provinces }: EnhancedMapViewProps) {
  const { language, t } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('population');
  const [visualization, setVisualization] = useState<MapVisualization>('standard');
  const [showLabels, setShowLabels] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const yearRange: [number, number] = [2020, 2025];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMapFullscreen) {
        setIsMapFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMapFullscreen]);

  useEffect(() => {
    if (isMapFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMapFullscreen]);

  const filteredProvinces = provinces.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name_en.toLowerCase().includes(query) ||
      p.name_km.includes(query) ||
      p.capital.toLowerCase().includes(query)
    );
  });

  const handleExport = () => {
    const layerData = filteredProvinces.map(p => {
      const name = language === 'km' ? p.name_km : p.name_en;
      let value = 0;
      let label = '';

      switch (activeLayer) {
        case 'gdp':
          value = p.gdp || p.population * 2000;
          label = 'GDP';
          break;
        case 'population':
          value = p.population;
          label = 'Population';
          break;
        case 'education':
          value = p.educationIndex || 60 + Math.random() * 30;
          label = 'Education Index';
          break;
        case 'healthcare':
          value = p.healthcareIndex || 50 + Math.random() * 40;
          label = 'Healthcare Index';
          break;
        case 'investment':
          value = p.investmentAmount || p.population * 100;
          label = 'Investment';
          break;
        case 'infrastructure':
          value = p.infrastructureScore || 55 + Math.random() * 35;
          label = 'Infrastructure Score';
          break;
      }

      return {
        Province: name,
        Capital: p.capital,
        [label]: value,
        Year: selectedYear
      };
    });

    const csv = [
      Object.keys(layerData[0]).join(','),
      ...layerData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cambodia_${activeLayer}_${selectedYear}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{t('interactiveMapTitle')}</h1>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showFilterPanel ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            <span>{showFilterPanel ? t('hideFilters') : t('showFilters')}</span>
          </button>
        </div>
        <p className="text-gray-600">{t('interactiveMapDescription')}</p>
      </div>

      <MapDataSummary
        provinces={filteredProvinces}
        activeLayer={activeLayer}
        selectedYear={selectedYear}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-1 ${showFilterPanel ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchProvinces')}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <MapFilterPanel
              activeLayer={activeLayer}
              onLayerChange={setActiveLayer}
              visualization={visualization}
              onVisualizationChange={setVisualization}
              yearRange={yearRange}
              onYearRangeChange={() => {}}
              showLabels={showLabels}
              onShowLabelsChange={setShowLabels}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <EnhancedInteractiveMap
            provinces={filteredProvinces}
            selectedProvince={selectedProvince}
            onProvinceSelect={setSelectedProvince}
            activeLayer={activeLayer}
            visualization={visualization}
            showLabels={showLabels}
            yearFilter={selectedYear}
            isFullscreen={isMapFullscreen}
            onToggleFullscreen={() => {
              console.log('Toggling fullscreen:', !isMapFullscreen);
              setIsMapFullscreen(!isMapFullscreen);
            }}
          />

          {selectedProvince && !isMapFullscreen && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'km' ? selectedProvince.name_km : selectedProvince.name_en}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {t('capital')}: {selectedProvince.capital}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">{t('population')}</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {selectedProvince.population.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700 mb-1">{t('area')}</div>
                  <div className="text-2xl font-bold text-green-900">
                    {selectedProvince.area_km2.toLocaleString()} km²
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">{t('density')}</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {selectedProvince.density.toFixed(1)}/km²
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm text-orange-700 mb-1">GDP</div>
                  <div className="text-2xl font-bold text-orange-900">
                    ${((selectedProvince.gdp || selectedProvince.population * 2000) / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>{t('viewDetailedStatistics')}</span>
                </button>
                <button
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>{t('downloadReport')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
