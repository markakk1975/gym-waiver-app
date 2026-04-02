import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { FeedbackStats } from '../../lib/types'

interface Props {
  stats: FeedbackStats | null
}

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#06b6d4', '#ec4899']

export default function CategoryChart({ stats }: Props) {
  const { t } = useTranslation()

  if (!stats) return null

  const data = [
    { name: t('feedback.rating_apartamento'), value: stats.avg_apartamento ?? 0 },
    { name: t('feedback.rating_restaurantes'), value: stats.avg_restaurantes ?? 0 },
    { name: t('feedback.rating_animacion'), value: stats.avg_animacion ?? 0 },
    { name: t('feedback.rating_recepcion'), value: stats.avg_recepcion ?? 0 },
    { name: t('feedback.rating_instalaciones'), value: stats.avg_instalaciones ?? 0 },
    { name: t('feedback.rating_housekeeping'), value: stats.avg_housekeeping ?? 0 },
  ]

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">{t('admin.by_category')}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 4]} ticks={[1, 2, 3, 4]} />
          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => Number(value).toFixed(2)} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
