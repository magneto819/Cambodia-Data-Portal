import { MapLayer, MapVisualization } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DollarSign, Users, GraduationCap, Heart, TrendingUp, Building2,
  Map as MapIcon, Grid, Layers as LayersIcon, Tag, Calendar
} from 'lucide-react';

interface MapFilterPanelProps {
  activeLayer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
  visualization: MapVisualization;
  onVisualizationChange: (viz: MapVisualization) => void;
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const layers: Array<{ id: MapLayer; icon: any; labelKey: string }> = [
  { id: 'gdp', icon: DollarSign, labelKey: 'gdpLayer' },
  { id: 'population', icon: Users, labelKey: 'populationLayer' },
  { id: 'education', icon: GraduationCap, labelKey: 'educationLayer' },
  { id: 'healthcare', icon: Heart, labelKey: 'healthcareLayer' },
  { id: 'investment', icon: TrendingUp, labelKey: 'investmentLayer' },
  { id: 'infrastructure', icon: Building2, labelKey: 'infrastructureLayer' }
];

const visualizations: Array<{ id: MapVisualization; icon: any; labelKey: string }> = [
  { id: 'standard', icon: MapIcon, labelKey: 'standardView' },
  { id: 'heatmap', icon: Grid, labelKey: 'heatmapView' },
  { id: 'cluster', icon: LayersIcon, labelKey: 'clusterView' }
];

export function MapFilterPanel({
  activeLayer,
  onLayerChange,
  visualization,
  onVisualizationChange,
  yearRange,
  selectedYear,
  onYearChange,
  showLabels,
  onShowLabelsChange
}: MapFilterPanelProps) {
  const { t } = useLanguage();

  const years = [];
  for (let year = yearRange[0]; year <= yearRange[1]; year++) {
    years.push(year);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <LayersIcon className="w-5 h-5 mr-2 text-blue-600" />
          {t('dataLayers')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {layers.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              onClick={() => onLayerChange(id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                activeLayer === id
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <MapIcon className="w-5 h-5 mr-2 text-blue-600" />
          {t('visualization')}
        </h3>
        <div className="space-y-2">
          {visualizations.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              onClick={() => onVisualizationChange(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all ${
                visualization === id
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          {t('timeRange')}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('selectedYear')}: <span className="text-blue-600 font-bold">{selectedYear}</span>
            </label>
            <input
              type="range"
              min={yearRange[0]}
              max={yearRange[1]}
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-blue-600" />
          {t('displayOptions')}
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => onShowLabelsChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{t('showLabels')}</span>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">{t('legend')}</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-800">{t('low')}</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-4 rounded"
                    style={{
                      backgroundColor: getColorByIndex(i, activeLayer)
                    }}
                  />
                ))}
              </div>
              <span className="text-blue-800">{t('high')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorByIndex(index: number, layer: MapLayer): string {
  const colors: Record<MapLayer, string[]> = {
    gdp: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
    population: ['#edf8fb', '#ccecf3', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'],
    education: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5'],
    healthcare: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45'],
    investment: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801'],
    infrastructure: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45']
  };

  return colors[layer][index];
}
