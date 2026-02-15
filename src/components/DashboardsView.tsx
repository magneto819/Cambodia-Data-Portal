import { useState } from 'react';
import { DashboardType } from '../types';
import { DashboardNav } from './dashboards/DashboardNav';
import { MacroEconomyDashboard } from './dashboards/MacroEconomyDashboard';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';

export function DashboardsView() {
  const { t } = useLanguage();
  const [currentDashboard, setCurrentDashboard] = useState<DashboardType>('macro');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {t('interactiveDashboards')}
          </h2>
        </div>
        <p className="text-gray-600">
          {t('dashboardsDescription')}
        </p>
      </div>

      <DashboardNav
        currentDashboard={currentDashboard}
        onDashboardChange={setCurrentDashboard}
      />

      {currentDashboard === 'macro' && <MacroEconomyDashboard />}

      {currentDashboard === 'population' && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('dashboard_population')}
          </h3>
          <p className="text-gray-600">
            {t('comingSoon')}
          </p>
        </div>
      )}

      {currentDashboard === 'industry' && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('dashboard_industry')}
          </h3>
          <p className="text-gray-600">
            {t('comingSoon')}
          </p>
        </div>
      )}

      {currentDashboard === 'trade' && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('dashboard_trade')}
          </h3>
          <p className="text-gray-600">
            {t('comingSoon')}
          </p>
        </div>
      )}

      {currentDashboard === 'finance' && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('dashboard_finance')}
          </h3>
          <p className="text-gray-600">
            {t('comingSoon')}
          </p>
        </div>
      )}

      {currentDashboard === 'social' && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('dashboard_social')}
          </h3>
          <p className="text-gray-600">
            {t('comingSoon')}
          </p>
        </div>
      )}
    </div>
  );
}
