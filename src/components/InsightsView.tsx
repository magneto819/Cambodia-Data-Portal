import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { DataInsight, OfficialReport } from '../types';
import { InsightCard } from './insights/InsightCard';
import { ReportCard } from './insights/ReportCard';
import { ReportGenerator } from './insights/ReportGenerator';
import { Lightbulb, FileText, Sparkles } from 'lucide-react';

export function InsightsView() {
  const { t } = useLanguage();
  const [insights, setInsights] = useState<DataInsight[]>([]);
  const [reports, setReports] = useState<OfficialReport[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'reports' | 'generator'>('insights');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [insightsResult, reportsResult] = await Promise.all([
        supabase.from('data_insights').select('*').order('created_at', { ascending: false }),
        supabase.from('official_reports').select('*').order('publication_date', { ascending: false })
      ]);

      if (insightsResult.error) throw insightsResult.error;
      if (reportsResult.error) throw reportsResult.error;

      setInsights(insightsResult.data || []);
      setReports(reportsResult.data || []);
    } catch (error) {
      console.error('Error loading insights and reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {t('dataInsights')}
          </h2>
        </div>
        <p className="text-gray-600">
          {t('insightsDescription')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'insights'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            <span>{t('aiInsights')}</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>{t('officialReports')}</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('reportGenerator')}</span>
          </button>
        </div>
      </div>

      {activeTab === 'insights' && (
        <div className="space-y-6">
          {insights.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('noInsightsYet')}</p>
            </div>
          ) : (
            insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {reports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('noReportsYet')}</p>
            </div>
          ) : (
            reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
        </div>
      )}

      {activeTab === 'generator' && (
        <ReportGenerator />
      )}
    </div>
  );
}
