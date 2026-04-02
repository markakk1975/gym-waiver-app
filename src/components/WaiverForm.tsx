import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import SignatureCanvas from 'react-signature-canvas'
import LanguageSelector from './LanguageSelector'
import { supabase } from '../lib/supabase'
import type { GymWaiver } from '../lib/types'

interface Props {
  onSuccess: () => void
  onBack: () => void
}

export default function WaiverForm({ onSuccess, onBack }: Props) {
  const { t, i18n } = useTranslation()
  const sigRef = useRef<SignatureCanvas>(null)
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState({
    guest_name: '',
    room_number: '',
    date_of_birth: '',
    arrival_date: '',
    departure_date: '',
  })

  const rules = Array.from({ length: 12 }, (_, i) => t(`waiver.rule_${i + 1}`))

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const allFilled =
    form.guest_name.trim() !== '' &&
    form.room_number.trim() !== '' &&
    form.date_of_birth !== '' &&
    form.arrival_date !== '' &&
    form.departure_date !== '' &&
    accepted &&
    sigRef.current &&
    !sigRef.current.isEmpty()

  async function handleSubmit() {
    if (!allFilled || !sigRef.current) return
    setLoading(true)

    const data: GymWaiver = {
      ...form,
      signature_data: sigRef.current.toDataURL('image/png'),
      language: i18n.language,
    }

    const { error } = await supabase.from('gym_waivers').insert(data)
    setLoading(false)
    if (!error) onSuccess()
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-hotel-bg to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-gray-500 text-lg px-3 py-1 rounded-lg hover:bg-gray-100"
          >
            ← {t('waiver.back')}
          </button>
          <LanguageSelector />
        </div>

        <h1 className="text-2xl font-bold text-hotel-primary mb-6 text-center">
          🏋️ {t('waiver.title')}
        </h1>

        {/* Guest info fields */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder={t('waiver.guest_name')}
            value={form.guest_name}
            onChange={(e) => updateField('guest_name', e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
          />
          <input
            type="text"
            placeholder={t('waiver.room_number')}
            value={form.room_number}
            onChange={(e) => updateField('room_number', e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t('waiver.date_of_birth')}</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) => updateField('date_of_birth', e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t('waiver.arrival_date')}</label>
              <input
                type="date"
                value={form.arrival_date}
                onChange={(e) => updateField('arrival_date', e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t('waiver.departure_date')}</label>
              <input
                type="date"
                value={form.departure_date}
                onChange={(e) => updateField('departure_date', e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
              />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold text-hotel-primary mb-3">
            📋 {t('waiver.rules_title')}
          </h2>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            {rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ol>
        </div>

        {/* Accept checkbox */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 accent-hotel-primary"
          />
          <span className="text-base text-gray-700 font-medium">
            {t('waiver.accept_rules')}
          </span>
        </label>

        {/* Signature */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-hotel-primary">
              ✍️ {t('waiver.signature')}
            </h2>
            <button
              onClick={() => sigRef.current?.clear()}
              className="text-sm text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-100"
            >
              {t('waiver.clear')}
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-2">{t('waiver.sign_here')}</p>
          <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigRef}
              penColor="black"
              canvasProps={{
                className: 'w-full',
                style: { width: '100%', height: '150px' },
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!allFilled || loading}
          className={`w-full text-xl font-semibold py-4 rounded-2xl shadow-lg transition-all duration-200 mb-8 ${
            allFilled && !loading
              ? 'bg-hotel-primary text-white hover:bg-hotel-primary-light active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? '...' : t('waiver.submit')} ✅
        </button>
      </div>
    </div>
  )
}
