import { ProvinceData, MapLayer } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, TrendingDown, DollarSign, Users, Download, BarChart3 } from 'lucide-react';

interface MapDataSummaryProps {
  provinces: ProvinceData[];
  activeLayer: MapLayer;
  selectedYear: number;
  onExport: () => void;
}

export function MapDataSummary({ provinces, activeLayer, selectedYear, onExport }: MapDataSummaryProps) {
  const { t } = useLanguage();

  const calculateStats = () => {
    const totalPopulation = provinces.reduce((sum, p) => sum + p.population, 0);

    const totalGDP = provinces.reduce((sum, p) => {
      const gdp = p.gdp || p.population * 2000;
      return sum + gdp;
    }, 0);

    const avgEducation = provinces.reduce((sum, p) => {
      const edu = p.educationIndex || 60 + Math.random() * 30;
      return sum + edu;
    }, 0) / provinces.length;

    const avgHealthcare = provinces.reduce((sum, p) => {
      const health = p.healthcareIndex || 50 + Math.random() * 40;
      return sum + health;
    }, 0) / provinces.length;

    const totalInvestment = provinces.reduce((sum, p) => {
      const inv = p.investmentAmount || p.population * 100;
      return sum + inv;
    }, 0);

    const avgInfrastructure = provinces.reduce((sum, p) => {
      const infra = p.infrastructureScore || 55 + Math.random() * 35;
      return sum + infra;
    }, 0) / provinces.length;

    return {
      totalPopulation,
      totalGDP,
      avgEducation,
      avgHealthcare,
      totalInvestment,
      avgInfrastructure,
      provinceCount: provinces.length
    };
  };

  const stats = calculateStats();

  const getActiveStats = () => {
    switch (activeLayer) {
      case 'gdp':
        return {
          title: t('totalGDP'),
          value: `$${(stats.totalGDP / 1000000000).toFixed(2)}B`,
          change: '+5.2%',
          trend: 'up' as const
        };
      case 'population':
        return {
          title: t('totalPopulation'),
          value: stats.totalPopulation.toLocaleString(),
          change: '+1.8%',
          trend: 'up' as const
        };
      case 'education':
        return {
          title: t('avgEducationIndex'),
          value: `${stats.avgEducation.toFixed(1)}%`,
          change: '+3.5%',
          trend: 'up' as const
        };
      case 'healthcare':
        return {
          title: t('avgHealthcareIndex'),
          value: `${stats.avgHealthcare.toFixed(1)}%`,
          change: '+2.1%',
          trend: 'up' as const
        };
      case 'investment':
        return {
          title: t('totalInvestment'),
          value: `$${(stats.totalInvestment / 1000000000).toFixed(2)}B`,
          change: '+8.7%',
          trend: 'up' as const
        };
      case 'infrastructure':
        return {
          title: t('avgInfrastructure'),
          value: stats.avgInfrastructure.toFixed(1),
          change: '+4.3%',
          trend: 'up' as const
        };
      default:
        return {
          title: t('totalPopulation'),
          value: stats.totalPopulation.toLocaleString(),
          change: '+1.8%',
          trend: 'up' as const
        };
    }
  };

  const activeStat = getActiveStats();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-sm font-semibold opacity-90">{t('currentLayer')}</h3>
          </div>
          <div className="text-3xl font-bold mb-1">{activeStat.value}</div>
          <div className="text-sm opacity-80">{activeStat.title}</div>
          <div className="flex items-center space-x-1 mt-2">
            {activeStat.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-300" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-300" />
            )}
            <span className={`text-sm font-semibold ${
              activeStat.trend === 'up' ? 'text-green-300' : 'text-red-300'
            }`}>
              {activeStat.change}
            </span>
            <span className="text-xs opacity-70">{t('vsLastYear')}</span>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <h3 className="text-sm font-semibold opacity-90">{t('totalGDP')}</h3>
          </div>
          <div className="text-2xl font-bold mb-1">
            ${(stats.totalGDP / 1000000000).toFixed(2)}B
          </div>
          <div className="text-xs opacity-70">{t('year')} {selectedYear}</div>
        </div>

        <div className="md:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="text-sm font-semibold opacity-90">{t('totalPopulation')}</h3>
          </div>
          <div className="text-2xl font-bold mb-1">
            {(stats.totalPopulation / 1000000).toFixed(2)}M
          </div>
          <div className="text-xs opacity-70">{stats.provinceCount} {t('provinces')}</div>
        </div>

        <div className="md:col-span-1 flex items-center justify-center">
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm border border-white/30"
          >
            <Download className="w-5 h-5" />
            <span className="font-semibold">{t('exportData')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
