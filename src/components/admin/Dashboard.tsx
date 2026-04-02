import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { generateWaiverPdf } from '../../lib/generatePdf'
import type { GymWaiverRow } from '../../lib/types'

interface Props {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: Props) {
  const { t } = useTranslation()
  const [waivers, setWaivers] = useState<GymWaiverRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewSig, setViewSig] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gym_waivers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    if (data) setWaivers(data as GymWaiverRow[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = waivers.filter((w) =>
    w.guest_name.toLowerCase().includes(search.toLowerCase()) ||
    w.room_number.includes(search)
  )

  const today = new Date().toISOString().split('T')[0]
  const todayCount = waivers.filter((w) => w.created_at.startsWith(today)).length

  function exportCSV() {
    if (filtered.length === 0) return
    const headers = ['Nombre', 'Habitacion', 'Nacimiento', 'Llegada', 'Salida', 'Idioma', 'Fecha firma']
    const rows = filtered.map((w) =>
      [w.guest_name, w.room_number, w.date_of_birth, w.arrival_date, w.departure_date, w.language, w.created_at].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gym-waivers-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-hotel-primary">
            🏋️ {t('admin.dashboard')}
          </h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            {t('admin.logout')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-3xl font-bold text-hotel-primary">{waivers.length}</div>
            <div className="text-sm text-gray-500">{t('admin.total_waivers')}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-3xl font-bold text-hotel-primary">{todayCount}</div>
            <div className="text-sm text-gray-500">{t('admin.today')}</div>
          </div>
        </div>

        {/* Search + Export */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder={t('admin.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
          />
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            📥 {t('admin.export_csv')}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('admin.no_data')}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">{t('admin.name')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">{t('admin.room')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">{t('admin.birth')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">{t('admin.arrival')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">{t('admin.departure')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">{t('admin.signed_at')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">{t('admin.signature')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">PDF</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{w.guest_name}</td>
                    <td className="px-4 py-3">{w.room_number}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{w.date_of_birth}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{w.arrival_date}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{w.departure_date}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(w.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewSig(w.signature_data)}
                        className="text-hotel-primary hover:underline text-sm font-medium"
                      >
                        {t('admin.view')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => generateWaiverPdf(w)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Signature modal */}
      {viewSig && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setViewSig(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-hotel-primary mb-4">{t('admin.signature')}</h3>
            <img src={viewSig} alt="Signature" className="w-full border rounded-xl" />
            <button
              onClick={() => setViewSig(null)}
              className="mt-4 w-full py-2 bg-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
