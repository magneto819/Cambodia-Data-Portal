import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Circle, Popup, Tooltip } from 'react-leaflet';
import { useLanguage } from '../contexts/LanguageContext';
import { Province } from '../types';
import L from 'leaflet';
import { Layers, TrendingUp, Info, BarChart3, ZoomIn, ZoomOut, Maximize2, Navigation } from 'lucide-react';
import { cambodiaGeoJSON } from '../data/cambodiaGeoJSON';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  provinces: Province[];
  selectedProvince: Province | null;
  onProvinceSelect: (province: Province) => void;
}

type DataLayer = 'population' | 'gdp' | 'density' | 'none';
type MapStyle = 'street' | 'satellite' | 'terrain';

const provinceCoordinates: Record<string, [number, number]> = {
  'Phnom Penh': [11.5564, 104.9282],
  'Siem Reap': [13.3671, 103.8448],
  'Battambang': [13.0957, 103.2022],
  'Kandal': [11.2333, 105.1167],
  'Kampong Cham': [12.0000, 105.4500],
  'Kampong Chhnang': [12.2500, 104.6667],
  'Kampong Speu': [11.4500, 104.5167],
  'Kampong Thom': [12.7167, 104.8833],
  'Kampot': [10.6167, 104.1833],
  'Banteay Meanchey': [13.7500, 102.9833],
  'Kep': [10.4833, 104.3167],
  'Koh Kong': [11.6167, 103.5333],
  'Kratie': [12.4833, 106.0167],
  'Mondulkiri': [12.4500, 107.2000],
  'Oddar Meanchey': [14.1667, 103.9167],
  'Pailin': [12.8500, 102.6167],
  'Preah Vihear': [13.8000, 104.9833],
  'Prey Veng': [11.4833, 105.3167],
  'Pursat': [12.5333, 103.9167],
  'Ratanakiri': [13.7333, 107.0000],
  'Sihanoukville': [10.6333, 103.5000],
  'Stung Treng': [13.5167, 106.0167],
  'Svay Rieng': [11.0833, 105.8000],
  'Takeo': [10.9833, 104.7833],
  'Preah Sihanouk': [10.6333, 103.5000]
};

function MapController({ selectedProvince, provinces }: { selectedProvince: Province | null, provinces: Province[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProvince) {
      const coords = provinceCoordinates[selectedProvince.name_en];
      if (coords) {
        map.flyTo(coords, 9, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    } else {
      map.flyTo([12.5657, 104.9910], 7, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedProvince, map]);

  return null;
}

export function InteractiveMap({ provinces, selectedProvince, onProvinceSelect }: InteractiveMapProps) {
  const { language, t } = useLanguage();
  const [dataLayer, setDataLayer] = useState<DataLayer>('population');
  const [mapStyle, setMapStyle] = useState<MapStyle>('street');
  const [showMarkers, setShowMarkers] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (geoJsonRef.current && dataLayer !== 'none') {
      geoJsonRef.current.eachLayer((layer: any) => {
        const feature = layer.feature;
        if (feature) {
          const style = geoJSONStyle(feature);
          layer.setStyle(style);
        }
      });
    }
  }, [dataLayer, selectedProvince]);

  const getProvinceColor = (provinceName: string): string => {
    const province = provinces.find(p =>
      p.name_en.toLowerCase() === provinceName.toLowerCase()
    );

    if (!province) return '#3b82f6';

    if (dataLayer === 'population') {
      const intensity = Math.min(province.population / 2000000, 1);
      const r = Math.floor(59 + intensity * (239 - 59));
      const g = Math.floor(130 + intensity * (68 - 130));
      const b = Math.floor(246 + intensity * (68 - 246));
      return `rgb(${r}, ${g}, ${b})`;
    }

    if (dataLayer === 'density') {
      const intensity = Math.min(province.density / 1000, 1);
      const r = Math.floor(16 + intensity * (239 - 16));
      const g = Math.floor(185 + intensity * (68 - 185));
      const b = Math.floor(129 + intensity * (68 - 129));
      return `rgb(${r}, ${g}, ${b})`;
    }

    if (dataLayer === 'gdp') {
      const gdpEstimate = province.population * 1800;
      const intensity = Math.min(gdpEstimate / 5000000000, 1);
      const r = Math.floor(251 + intensity * (239 - 251));
      const g = Math.floor(191 + intensity * (68 - 191));
      const b = Math.floor(36 + intensity * (68 - 36));
      return `rgb(${r}, ${g}, ${b})`;
    }

    return '#3b82f6';
  };

  const onEachFeature = (feature: any, layer: any) => {
    const provinceName = feature.properties.name;
    const province = provinces.find(p =>
      p.name_en.toLowerCase() === provinceName.toLowerCase()
    );

    if (province) {
      layer.on({
        click: () => {
          onProvinceSelect(province);
        },
        mouseover: (e: any) => {
          setHoveredProvince(province);
          const layer = e.target;
          layer.setStyle({
            weight: 4,
            color: '#1e40af',
            fillOpacity: 0.9
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
        },
        mouseout: (e: any) => {
          setHoveredProvince(null);
          const layer = e.target;
          const isSelected = selectedProvince?.id === province.id;
          layer.setStyle({
            weight: isSelected ? 3 : 2,
            color: isSelected ? '#1e40af' : '#ffffff',
            fillOpacity: isSelected ? 0.8 : 0.6
          });
        }
      });

      const name = language === 'km' ? province.name_km : province.name_en;
      const density = province.density ? province.density.toFixed(1) : 'N/A';
      const capital = language === 'km' ? province.capital_km : province.capital;
      const gdpEstimate = province.population ? (province.population * 1800 / 1000000).toFixed(2) : 'N/A';

      layer.bindPopup(`
        <div class="font-sans p-3 min-w-[260px]">
          <h3 class="font-bold text-xl mb-3 text-blue-900 border-b-2 border-blue-200 pb-2">${name}</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between bg-blue-50 p-2 rounded">
              <strong class="text-gray-700 text-sm">${t('capital')}:</strong>
              <span class="text-gray-900 font-semibold">${capital || 'N/A'}</span>
            </div>
            <div class="flex items-center justify-between bg-green-50 p-2 rounded">
              <strong class="text-gray-700 text-sm">${t('population')}:</strong>
              <span class="text-gray-900 font-semibold">${province.population?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="flex items-center justify-between bg-orange-50 p-2 rounded">
              <strong class="text-gray-700 text-sm">${t('area')}:</strong>
              <span class="text-gray-900 font-semibold">${province.area_km2?.toLocaleString() || 'N/A'} km²</span>
            </div>
            <div class="flex items-center justify-between bg-purple-50 p-2 rounded">
              <strong class="text-gray-700 text-sm">${t('density')}:</strong>
              <span class="text-gray-900 font-semibold">${density} ${t('perKm2')}</span>
            </div>
            <div class="flex items-center justify-between bg-yellow-50 p-2 rounded">
              <strong class="text-gray-700 text-sm">${t('gdpEstimate')}:</strong>
              <span class="text-gray-900 font-semibold">$${gdpEstimate}M</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-200 text-center">
            <p class="text-xs text-gray-500">${t('clickProvinceMoreDetails')}</p>
          </div>
        </div>
      `, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      if (showLabels) {
        layer.bindTooltip(name, {
          permanent: false,
          direction: 'center',
          className: 'province-label'
        });
      }
    }
  };

  const geoJSONStyle = (feature: any) => {
    const provinceName = feature.properties.name;
    const isSelected = selectedProvince?.name_en.toLowerCase() === provinceName.toLowerCase();

    return {
      fillColor: getProvinceColor(provinceName),
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#1e40af' : '#ffffff',
      fillOpacity: isSelected ? 0.8 : 0.6
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            {t('geoAnalytics')}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">{t('statistics')}</span>
            </button>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">{t('interactiveMap')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">{t('dataLayer')}:</span>
            <div className="flex space-x-2">
            <button
              onClick={() => setDataLayer('none')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dataLayer === 'none'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('none')}
            </button>
            <button
              onClick={() => setDataLayer('population')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dataLayer === 'population'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('population')}
            </button>
            <button
              onClick={() => setDataLayer('density')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dataLayer === 'density'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('density')}
            </button>
            <button
              onClick={() => setDataLayer('gdp')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dataLayer === 'gdp'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('gdp')}
            </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">{t('mapStyle')}:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setMapStyle('street')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  mapStyle === 'street'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('street')}
              </button>
              <button
                onClick={() => setMapStyle('terrain')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  mapStyle === 'terrain'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('terrain')}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('showMarkers')}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('showLabels')}</span>
            </label>
          </div>
        </div>

        {dataLayer !== 'none' && (
          <div className="mt-3 flex items-center space-x-4">
            <span className="text-xs text-gray-600">{t('heatmapLegend')}:</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-8 h-4 bg-gradient-to-r from-blue-100 to-red-600 rounded"></div>
                <span className="ml-2 text-xs text-gray-600">{t('lowToHigh')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative" style={{ height: '600px' }}>
        {hoveredProvince && (
          <div className="absolute top-4 left-4 z-[1000] bg-white shadow-xl rounded-lg p-4 border-2 border-blue-400 max-w-xs">
            <h4 className="font-bold text-blue-900 text-lg mb-2">
              {language === 'km' ? hoveredProvince.name_km : hoveredProvince.name_en}
            </h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">{t('population')}:</span> <span className="font-semibold text-gray-900">{hoveredProvince.population?.toLocaleString()}</span></p>
              <p><span className="text-gray-600">{t('area')}:</span> <span className="font-semibold text-gray-900">{hoveredProvince.area_km2?.toLocaleString()} km²</span></p>
              <p><span className="text-gray-600">{t('density')}:</span> <span className="font-semibold text-gray-900">{hoveredProvince.density?.toFixed(1)} {t('perKm2')}</span></p>
            </div>
          </div>
        )}
        <MapContainer
          center={[12.5657, 104.9910]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
          ref={(map) => { if (map) mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={mapStyle === 'terrain'
              ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
          />
          <GeoJSON
            ref={geoJsonRef}
            data={cambodiaGeoJSON as any}
            style={geoJSONStyle}
            onEachFeature={onEachFeature}
            key={`geojson-${dataLayer}`}
          />
          {showMarkers && provinces.map(province => {
            const coords = provinceCoordinates[province.name_en];
            if (!coords) return null;

            const [lat, lng] = coords;
            const radius = dataLayer === 'population'
              ? Math.sqrt(province.population) * 0.5
              : dataLayer === 'density' && province.density
              ? province.density * 10
              : 8000;

            return (
              <Circle
                key={province.id}
                center={[lat, lng]}
                radius={radius}
                pathOptions={{
                  fillColor: getProvinceColor(province.name_en),
                  fillOpacity: 0.4,
                  color: '#1e40af',
                  weight: 1
                }}
              >
                <Popup>
                  <div className="text-center">
                    <strong>{language === 'km' ? province.name_km : province.name_en}</strong>
                    <p className="text-sm mt-1">{province.population?.toLocaleString()}</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
          <MapController selectedProvince={selectedProvince} provinces={provinces} />
        </MapContainer>
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => mapRef.current?.flyTo([12.5657, 104.9910], 7, { duration: 1.5 })}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
            title="Reset View"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showStatistics && (
        <div className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-t-2 border-blue-300 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Info className="w-6 h-6 mr-2 text-blue-600" />
              {t('overallStatistics')}
            </h3>
            <button
              onClick={() => setShowStatistics(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full p-1 transition-colors"
              title={t('close')}
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{t('totalProvinces')}</p>
              <p className="text-3xl font-bold text-blue-600">{provinces.length}</p>
              <p className="text-xs text-gray-500 mt-1">{t('provinces')}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-green-100">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{t('totalPopulation')}</p>
              <p className="text-3xl font-bold text-green-600">
                {(provinces.reduce((sum, p) => sum + (p.population || 0), 0) / 1000000).toFixed(2)}M
              </p>
              <p className="text-xs text-gray-500 mt-1">{provinces.reduce((sum, p) => sum + (p.population || 0), 0).toLocaleString()} {t('people')}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{t('totalArea')}</p>
              <p className="text-3xl font-bold text-orange-600">
                {(provinces.reduce((sum, p) => sum + (parseFloat(p.area_km2) || 0), 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">{provinces.reduce((sum, p) => sum + (parseFloat(p.area_km2) || 0), 0).toLocaleString()} km²</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{t('avgDensity')}</p>
              <p className="text-3xl font-bold text-purple-600">
                {(provinces.reduce((sum, p) => sum + (p.density || 0), 0) / provinces.filter(p => p.density).length).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{language === 'zh' ? '人/平方公里' : language === 'km' ? 'នាក់/km²' : 'people/km²'}</p>
            </div>
          </div>
        </div>
      )}

      {selectedProvince && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-blue-900 text-lg">
              {language === 'km' ? selectedProvince.name_km : selectedProvince.name_en}
            </h3>
            <button
              onClick={() => onProvinceSelect(null as any)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('close')}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="text-xs text-gray-600 block mb-1">{t('capital')}</span>
              <p className="font-semibold text-gray-900">{language === 'km' ? selectedProvince.capital_km : selectedProvince.capital}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="text-xs text-gray-600 block mb-1">{t('population')}</span>
              <p className="font-semibold text-gray-900">{selectedProvince.population?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="text-xs text-gray-600 block mb-1">{t('area')}</span>
              <p className="font-semibold text-gray-900">{selectedProvince.area_km2?.toLocaleString() || 'N/A'} km²</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <span className="text-xs text-gray-600 block mb-1">{t('density')}</span>
              <p className="font-semibold text-gray-900">{selectedProvince.density ? selectedProvince.density.toFixed(1) : 'N/A'} {t('perKm2')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
