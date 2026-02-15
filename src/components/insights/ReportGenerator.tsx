import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FileDown, Calendar, Settings } from 'lucide-react';

export function ReportGenerator() {
  const { t } = useLanguage();
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [format, setFormat] = useState('pdf');

  const indicators = [
    { id: 'gdp', label: t('gdp') },
    { id: 'inflation', label: t('inflation') },
    { id: 'population', label: t('population') },
    { id: 'trade', label: t('dashboard_trade') },
    { id: 'employment', label: t('dashboard_population') },
  ];

  const toggleIndicator = (id: string) => {
    if (selectedIndicators.includes(id)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== id));
    } else {
      setSelectedIndicators([...selectedIndicators, id]);
    }
  };

  const handleGenerate = async () => {
    const reportData = {
      report_name: `Custom Report ${new Date().toISOString()}`,
      selected_indicators: { indicators: selectedIndicators },
      time_range_start: startDate,
      time_range_end: endDate,
      filters: {},
      chart_types: ['line', 'bar'],
      format: format,
    };

    alert(t('reportGenerating'));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">
          {t('customReportGenerator')}
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('selectIndicators')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {indicators.map((indicator) => (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedIndicators.includes(indicator.id)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {indicator.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {t('startDate')}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {t('endDate')}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('outputFormat')}
          </label>
          <div className="flex space-x-3">
            {['pdf', 'excel', 'csv'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  format === fmt
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={selectedIndicators.length === 0}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            selectedIndicators.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FileDown className="w-5 h-5" />
          <span>{t('generateReport')}</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          {t('reportGeneratorNote')}
        </p>
      </div>
    </div>
  );
}
