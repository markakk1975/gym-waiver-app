import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export type DatePreset = 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom'

interface Props {
  onRangeChange: (start: string, end: string) => void
}

function toLocalDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getPresetDates(preset: DatePreset): { start: string; end: string } {
  const now = new Date()
  const today = toLocalDate(now)

  switch (preset) {
    case 'today':
      return { start: today, end: today }
    case 'this_week': {
      const dayOfWeek = now.getDay() || 7
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1)
      return { start: toLocalDate(monday), end: today }
    }
    case 'this_month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: toLocalDate(firstDay), end: today }
    }
    case 'last_month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start: toLocalDate(firstDay), end: toLocalDate(lastDay) }
    }
    default:
      return { start: today, end: today }
  }
}

export default function DateRangeFilter({ onRangeChange }: Props) {
  const { t } = useTranslation()
  const [preset, setPreset] = useState<DatePreset>('this_month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  function handlePreset(p: DatePreset) {
    setPreset(p)
    if (p !== 'custom') {
      const { start, end } = getPresetDates(p)
      onRangeChange(start, end)
    }
  }

  const presets: { key: DatePreset; label: string }[] = [
    { key: 'today', label: t('admin.today') },
    { key: 'this_week', label: t('admin.this_week') },
    { key: 'this_month', label: t('admin.this_month') },
    { key: 'last_month', label: t('admin.last_month') },
    { key: 'custom', label: t('admin.custom') },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => handlePreset(p.key)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            preset === p.key
              ? 'bg-hotel-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {p.label}
        </button>
      ))}
      {preset === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg text-xs sm:text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg text-xs sm:text-sm"
          />
          <button
            onClick={() => {
              if (customStart && customEnd) onRangeChange(customStart, customEnd)
            }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-hotel-primary text-white rounded-lg text-xs sm:text-sm font-medium"
          >
            {t('admin.apply')}
          </button>
        </div>
      )}
    </div>
  )
}
