import { DashboardType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp, Users, Factory, Globe2, DollarSign, Heart } from 'lucide-react';

interface DashboardNavProps {
  currentDashboard: DashboardType;
  onDashboardChange: (dashboard: DashboardType) => void;
}

export function DashboardNav({ currentDashboard, onDashboardChange }: DashboardNavProps) {
  const { t } = useLanguage();

  const dashboards: { type: DashboardType; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'macro', icon: TrendingUp },
    { type: 'population', icon: Users },
    { type: 'industry', icon: Factory },
    { type: 'trade', icon: Globe2 },
    { type: 'finance', icon: DollarSign },
    { type: 'social', icon: Heart },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {dashboards.map(({ type, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onDashboardChange(type)}
            className={`flex flex-col items-center justify-center p-6 transition-all ${
              currentDashboard === type
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm font-semibold text-center">
              {t(`dashboard_${type}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
