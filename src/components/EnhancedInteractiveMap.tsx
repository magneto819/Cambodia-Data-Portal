import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngBounds, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProvinceData, MapLayer, MapVisualization } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Info, Maximize2, Minimize2, X } from 'lucide-react';
import { cambodiaGeoJSON } from '../data/cambodiaGeoJSON';

interface EnhancedInteractiveMapProps {
  provinces: ProvinceData[];
  selectedProvince: ProvinceData | null;
  onProvinceSelect: (province: ProvinceData | null) => void;
  activeLayer: MapLayer;
  visualization: MapVisualization;
  showLabels: boolean;
  yearFilter: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

interface MapControllerProps {
  selectedProvince: ProvinceData | null;
  isFullscreen: boolean;
}

function MapController({ selectedProvince, isFullscreen }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedProvince?.coordinates) {
      map.flyTo(selectedProvince.coordinates, 9, {
        duration: 1.5,
        easeLinearity: 0.5
      });
    } else {
      const bounds = new LatLngBounds(
        [9.5, 102.3],
        [14.7, 107.7]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedProvince, map]);

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [isFullscreen, map]);

  return null;
}

function getColorByValue(value: number, layer: MapLayer): string {
  const colors = {
    gdp: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
    population: ['#edf8fb', '#ccecf3', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'],
    education: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5'],
    healthcare: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45'],
    investment: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801'],
    infrastructure: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45']
  };

  const colorScale = colors[layer];
  const index = Math.min(Math.floor((value / 100) * colorScale.length), colorScale.length - 1);
  return colorScale[index];
}

function getLayerValue(province: ProvinceData, layer: MapLayer): number {
  switch (layer) {
    case 'gdp':
      return province.gdp || province.population * 2000;
    case 'population':
      return province.population;
    case 'education':
      return province.educationIndex || 60 + Math.random() * 30;
    case 'healthcare':
      return province.healthcareIndex || 50 + Math.random() * 40;
    case 'investment':
      return province.investmentAmount || province.population * 100;
    case 'infrastructure':
      return province.infrastructureScore || 55 + Math.random() * 35;
    default:
      return province.population;
  }
}

export function EnhancedInteractiveMap({
  provinces,
  selectedProvince,
  onProvinceSelect,
  activeLayer,
  visualization,
  showLabels,
  yearFilter,
  isFullscreen = false,
  onToggleFullscreen
}: EnhancedInteractiveMapProps) {
  const { language, t } = useLanguage();
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const provinceMap = useMemo(() => {
    const map = new Map<string, ProvinceData>();
    provinces.forEach(p => {
      map.set(p.name_en.toUpperCase(), p);
      map.set(p.name_km, p);
    });
    return map;
  }, [provinces]);

  const getProvinceStyle = (feature: any) => {
    const provinceName = feature.properties.name || feature.properties.NAME_1;
    const province = provinceMap.get(provinceName?.toUpperCase());

    if (!province) {
      return {
        fillColor: '#e5e7eb',
        weight: 1,
        opacity: 1,
        color: '#9ca3af',
        fillOpacity: 0.5
      };
    }

    const value = getLayerValue(province, activeLayer);
    const normalizedValue = Math.min((value / Math.max(...provinces.map(p => getLayerValue(p, activeLayer)))) * 100, 100);

    const isSelected = selectedProvince?.id === province.id;
    const isHovered = hoveredProvince === province.id;

    return {
      fillColor: getColorByValue(normalizedValue, activeLayer),
      weight: isSelected || isHovered ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#2563eb' : isHovered ? '#3b82f6' : '#ffffff',
      fillOpacity: isSelected || isHovered ? 0.9 : 0.7
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const provinceName = feature.properties.name || feature.properties.NAME_1;
    const province = provinceMap.get(provinceName?.toUpperCase());

    if (province) {
      layer.on({
        mouseover: (e: any) => {
          setHoveredProvince(province.id);
          e.target.setStyle({
            weight: 3,
            color: '#3b82f6',
            fillOpacity: 0.9
          });
        },
        mouseout: (e: any) => {
          setHoveredProvince(null);
          if (selectedProvince?.id !== province.id) {
            e.target.setStyle(getProvinceStyle(feature));
          }
        },
        click: () => {
          onProvinceSelect(province);
        }
      });

      const layerValue = getLayerValue(province, activeLayer);
      const displayName = language === 'km' ? province.name_km : province.name_en;

      layer.bindTooltip(
        `<div class="font-semibold">${displayName}</div>
         <div class="text-sm">${formatLayerValue(layerValue, activeLayer)}</div>`,
        {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip'
        }
      );
    }
  };

  const formatLayerValue = (value: number, layer: MapLayer): string => {
    switch (layer) {
      case 'gdp':
        return `GDP: $${(value / 1000000).toFixed(1)}M`;
      case 'population':
        return `${t('population')}: ${value.toLocaleString()}`;
      case 'education':
        return `${t('educationIndex')}: ${value.toFixed(1)}%`;
      case 'healthcare':
        return `${t('healthcareIndex')}: ${value.toFixed(1)}%`;
      case 'investment':
        return `${t('investment')}: $${(value / 1000000).toFixed(1)}M`;
      case 'infrastructure':
        return `${t('infrastructure')}: ${value.toFixed(1)}`;
      default:
        return value.toLocaleString();
    }
  };

  const markerPositions = useMemo(() => {
    if (visualization !== 'cluster' || !showLabels) return [];

    return provinces
      .filter(p => p.coordinates)
      .map(p => ({
        province: p,
        position: p.coordinates!,
        value: getLayerValue(p, activeLayer)
      }));
  }, [provinces, visualization, showLabels, activeLayer]);

  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden shadow-lg bg-gray-100 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[600px]'
      }`}
      style={isFullscreen ? { height: '100vh', width: '100vw' } : undefined}
    >
      <MapContainer
        center={[12.5, 105]}
        zoom={7}
        className="w-full h-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          data={cambodiaGeoJSON as any}
          style={getProvinceStyle}
          onEachFeature={onEachFeature}
        />

        {visualization === 'cluster' && markerPositions.map(({ province, position, value }) => {
          const displayName = language === 'km' ? province.name_km : province.name_en;

          return (
            <Marker
              key={province.id}
              position={position}
              icon={new Icon({
                iconUrl: `data:image/svg+xml;base64,${btoa(`
                  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="${getColorByValue((value / Math.max(...provinces.map(p => getLayerValue(p, activeLayer)))) * 100, activeLayer)}" stroke="white" stroke-width="2"/>
                    <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${Math.round(value / 1000)}K</text>
                  </svg>
                `)}`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{displayName}</h3>
                  <p className="text-sm">{formatLayerValue(value, activeLayer)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController selectedProvince={selectedProvince} isFullscreen={isFullscreen} />
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none z-[1001]">
        {onToggleFullscreen && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Fullscreen button clicked');
              onToggleFullscreen();
            }}
            className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xl p-3 transition-all pointer-events-auto cursor-pointer transform hover:scale-105"
            title={isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        )}

        <div className={`absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 transition-all pointer-events-auto ${
          isFullscreen ? 'max-w-sm' : 'max-w-xs'
        }`}>
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            <p className="font-semibold mb-1">{t('mapInstructions')}</p>
            <ul className="space-y-1">
              <li>• {t('clickToSelect')}</li>
              <li>• {t('hoverForDetails')}</li>
              <li>• {t('scrollToZoom')}</li>
              {isFullscreen && <li>• {t('pressEscToExit')}</li>}
            </ul>
          </div>
        </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 pointer-events-auto">
          <div className="flex items-center space-x-2 text-xs">
            <Maximize2 className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">{t('dataYear')}: {yearFilter}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
