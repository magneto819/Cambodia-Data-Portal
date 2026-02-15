import { useState, useEffect } from 'react';
import { ImprovedHeader as Header, ViewType } from './components/ImprovedHeader';
import { EnhancedMapView } from './components/EnhancedMapView';
import { BrowseView } from './components/BrowseView';
import { StatisticsView } from './components/StatisticsView';
import { DashboardsView } from './components/DashboardsView';
import { InsightsView } from './components/InsightsView';
import { DataCatalogView } from './components/DataCatalogView';
import { ThematicDatasetsView } from './components/ThematicDatasetsView';
import { DataSourcesView } from './components/DataSourcesView';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';
import { Province, ProvinceData } from './types';

function getProvinceCoordinates(provinceName: string): [number, number] | undefined {
  const coordinates: Record<string, [number, number]> = {
    'Phnom Penh': [11.5564, 104.9282],
    'Kandal': [11.2333, 105.1167],
    'Takeo': [10.9908, 104.7989],
    'Kampot': [10.6104, 104.1819],
    'Kep': [10.4833, 104.3167],
    'Preah Sihanouk': [10.6095, 103.5228],
    'Koh Kong': [11.6153, 102.9836],
    'Kampong Speu': [11.4533, 104.5206],
    'Kampong Chhnang': [12.2503, 104.6667],
    'Pursat': [12.5388, 103.9192],
    'Battambang': [13.0957, 103.2022],
    'Pailin': [12.8489, 102.6092],
    'Banteay Meanchey': [13.7532, 102.9897],
    'Oddar Meanchey': [14.1688, 103.8197],
    'Siem Reap': [13.3632, 103.8564],
    'Preah Vihear': [13.8077, 104.9810],
    'Kampong Thom': [12.7110, 104.8889],
    'Kratie': [12.4880, 106.0186],
    'Stung Treng': [13.5259, 105.9683],
    'Ratanakiri': [13.7289, 107.0009],
    'Mondulkiri': [12.4545, 107.2010],
    'Prey Veng': [11.4867, 105.3256],
    'Svay Rieng': [11.0877, 105.7993],
    'Tbong Khmum': [11.9972, 105.6878]
  };

  return coordinates[provinceName];
}

function AppContent() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name_en');

      if (error) throw error;

      const provincesWithDensity = (data || []).map((p, index) => ({
        ...p,
        density: p.area_km2 > 0 ? p.population / p.area_km2 : 0,
        coordinates: getProvinceCoordinates(p.name_en) as [number, number]
      }));

      setProvinces(provincesWithDensity);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="container mx-auto px-4 py-8">
        {currentView === 'map' && (
          <EnhancedMapView provinces={provinces as ProvinceData[]} />
        )}

        {currentView === 'browse' && (
          <BrowseView provinces={provinces} />
        )}

        {currentView === 'statistics' && (
          <StatisticsView provinces={provinces} />
        )}

        {currentView === 'dashboards' && (
          <DashboardsView />
        )}

        {currentView === 'insights' && (
          <InsightsView />
        )}

        {currentView === 'catalog' && (
          <DataCatalogView />
        )}

        {currentView === 'thematic' && (
          <ThematicDatasetsView />
        )}

        {currentView === 'sources' && (
          <DataSourcesView />
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            {t('copyright')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('dataSource')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
