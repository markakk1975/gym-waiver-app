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

function getAge(dateStr: string): number {
  const birth = new Date(dateStr)
  if (isNaN(birth.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export default function WaiverForm({ onSuccess, onBack }: Props) {
  const { t, i18n } = useTranslation()
  const sigRef = useRef<SignatureCanvas>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSigned, setHasSigned] = useState(false)

  async function handleSubmit() {
    setError('')

    if (!formRef.current) return

    // Read ALL values directly from the DOM form elements
    const fd = new FormData(formRef.current)
    const guestName = (fd.get('guest_name') as string || '').trim()
    const roomNumber = (fd.get('room_number') as string || '').trim()
    const dateOfBirth = fd.get('date_of_birth') as string || ''
    const arrivalDate = fd.get('arrival_date') as string || ''
    const departureDate = fd.get('departure_date') as string || ''
    const accepted = formRef.current.querySelector<HTMLInputElement>('[name="accepted"]')?.checked ?? false

    if (!guestName || !roomNumber || !dateOfBirth || !arrivalDate || !departureDate) {
      setError(t('waiver.required_fields'))
      return
    }

    // Silent age check (18+)
    if (getAge(dateOfBirth) < 18) {
      setError(t('waiver.age_error'))
      return
    }

    if (!accepted) {
      setError(t('waiver.must_accept'))
      return
    }

    if (!hasSigned || !sigRef.current || sigRef.current.isEmpty()) {
      setError(t('waiver.must_sign'))
      return
    }

    setLoading(true)

    const data: GymWaiver = {
      guest_name: guestName,
      room_number: roomNumber,
      date_of_birth: dateOfBirth,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      signature_data: sigRef.current.toDataURL('image/png'),
      language: i18n.language,
    }

    const { error: dbError } = await supabase.from('gym_waivers').insert(data)
    setLoading(false)
    if (dbError) {
      setError(dbError.message)
    } else {
      onSuccess()
    }
  }

  const rules = Array.from({ length: 12 }, (_, i) => t(`waiver.rule_${i + 1}`))

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

        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          {/* Guest info fields */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              name="guest_name"
              placeholder={t('waiver.guest_name')}
              onChange={() => setError('')}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
            />
            <input
              type="text"
              name="room_number"
              inputMode="numeric"
              placeholder={t('waiver.room_number')}
              onChange={() => setError('')}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('waiver.date_of_birth')}</label>
                <input
                  type="date"
                  name="date_of_birth"
                  onChange={() => setError('')}
                  className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('waiver.arrival_date')}</label>
                <input
                  type="date"
                  name="arrival_date"
                  onChange={() => setError('')}
                  className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('waiver.departure_date')}</label>
                <input
                  type="date"
                  name="departure_date"
                  onChange={() => setError('')}
                  className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
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
              name="accepted"
              onChange={() => setError('')}
              className="mt-1 w-5 h-5 accent-hotel-primary"
            />
            <span className="text-base text-gray-700 font-medium">
              {t('waiver.accept_rules')}
            </span>
          </label>
        </form>

        {/* Signature (outside form to avoid canvas issues) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-hotel-primary">
              ✍️ {t('waiver.signature')}
            </h2>
            <button
              onClick={() => { sigRef.current?.clear(); setHasSigned(false) }}
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
              onEnd={() => { setHasSigned(true); setError('') }}
              canvasProps={{
                className: 'w-full',
                style: { width: '100%', height: '150px' },
              }}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-center font-medium mb-4">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full text-xl font-semibold py-4 rounded-2xl shadow-lg transition-all duration-200 mb-8 ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-hotel-primary text-white hover:bg-hotel-primary-light active:scale-95'
          }`}
        >
          {loading ? '...' : t('waiver.submit')} ✅
        </button>
      </div>
    </div>
  )
}
