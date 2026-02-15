import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardFilters } from './DashboardFilters';
import { TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';

export function MacroEconomyDashboard() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(2023);

  const years = [2018, 2019, 2020, 2021, 2022, 2023];

  const gdpData = [
    { year: 2018, gdp: 24.5, growth: 7.5 },
    { year: 2019, gdp: 27.1, growth: 7.1 },
    { year: 2020, gdp: 26.8, growth: -3.1 },
    { year: 2021, gdp: 27.5, growth: 3.0 },
    { year: 2022, gdp: 29.2, growth: 5.2 },
    { year: 2023, gdp: 31.0, growth: 5.5 },
  ];

  const inflationData = [
    { year: 2018, rate: 2.4 },
    { year: 2019, rate: 1.9 },
    { year: 2020, rate: 2.9 },
    { year: 2021, rate: 2.9 },
    { year: 2022, rate: 5.3 },
    { year: 2023, rate: 2.1 },
  ];

  const exchangeRateData = [
    { year: 2018, rate: 4037 },
    { year: 2019, rate: 4061 },
    { year: 2020, rate: 4093 },
    { year: 2021, rate: 4099 },
    { year: 2022, rate: 4102 },
    { year: 2023, rate: 4100 },
  ];

  const handleExport = () => {
    const csvContent = 'Year,GDP (Billion USD),Growth Rate (%)\n' +
      gdpData.map(d => `${d.year},${d.gdp},${d.growth}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'macro-economy-data.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <DashboardFilters
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                ${gdpData[gdpData.length - 1].gdp}B
              </div>
              <div className="text-blue-100 text-sm">{t('gdp')} (2023)</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {gdpData[gdpData.length - 1].growth}%
              </div>
              <div className="text-green-100 text-sm">{t('gdpGrowth')}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {inflationData[inflationData.length - 1].rate}%
              </div>
              <div className="text-orange-100 text-sm">{t('inflation')}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {exchangeRateData[exchangeRateData.length - 1].rate}
              </div>
              <div className="text-purple-100 text-sm">{t('exchangeRate')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('gdpTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gdpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gdp" stroke="#3b82f6" name={t('gdp') + ' (B USD)'} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('gdpGrowthTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gdpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="growth" fill="#10b981" name={t('growth') + ' (%)'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('inflationTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inflationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#f97316" name={t('inflation') + ' (%)'} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('exchangeRateTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={exchangeRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#8b5cf6" name={t('khrUsd')} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-2">{t('dataNote')}</h4>
        <p className="text-sm text-gray-700">
          {t('macroEconomyNote')}
        </p>
      </div>
    </div>
  );
}
