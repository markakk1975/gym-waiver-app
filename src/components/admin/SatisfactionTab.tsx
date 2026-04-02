import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DateRangeFilter from './DateRangeFilter'
import ScoreCards from './ScoreCards'
import CategoryChart from './CategoryChart'
import TrendChart from './TrendChart'
import ExportButtons from './ExportButtons'
import type { FeedbackStats, DailySummary } from '../../lib/types'

export default function SatisfactionTab() {
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [dailyData, setDailyData] = useState<DailySummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true)

    const [statsResult, dailyResult] = await Promise.all([
      supabase.rpc('get_feedback_stats', {
        start_date: `${startDate}T00:00:00`,
        end_date: `${endDate}T23:59:59`,
      }),
      supabase
        .from('feedback_daily_summary')
        .select('*')
        .gte('day', startDate)
        .lte('day', endDate)
        .order('day', { ascending: false }),
    ])

    if (statsResult.data) setStats(statsResult.data as FeedbackStats)
    if (dailyResult.data) setDailyData(dailyResult.data as DailySummary[])
    setLoading(false)
  }, [])

  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    fetchData(firstDay.toISOString().split('T')[0], now.toISOString().split('T')[0])
  }, [fetchData])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <DateRangeFilter onRangeChange={fetchData} />
        <ExportButtons data={dailyData} />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-xl">Loading...</div>
      ) : (
        <div className="space-y-6">
          <ScoreCards stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart stats={stats} />
            <TrendChart data={dailyData} />
          </div>
        </div>
      )}
    </div>
  )
}
