import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DailySummary } from '../../lib/types'

interface Props {
  data: DailySummary[]
}

export default function TrendChart({ data }: Props) {
  const { t } = useTranslation()

  const chartData = [...data].reverse().map((d) => ({
    ...d,
    day: new Date(d.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }))

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">{t('admin.trend')}</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-12">{t('admin.no_data')}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avg_apartamento" name={t('feedback.rating_apartamento')} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avg_restaurantes" name={t('feedback.rating_restaurantes')} stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avg_animacion" name={t('feedback.rating_animacion')} stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avg_recepcion" name={t('feedback.rating_recepcion')} stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avg_instalaciones" name={t('feedback.rating_instalaciones')} stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avg_housekeeping" name={t('feedback.rating_housekeeping')} stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avg_overall" name={t('admin.avg_overall')} stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
