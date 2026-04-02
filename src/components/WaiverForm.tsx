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

// Parse DD/MM/YYYY to Date
function parseDate(input: string): Date | null {
  const m = input.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (!m) return null
  const d = new Date(+m[3], +m[2] - 1, +m[1])
  return isNaN(d.getTime()) ? null : d
}

function toISO(input: string): string {
  const d = parseDate(input)
  if (!d) return input
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getAge(input: string): number {
  const birth = parseDate(input)
  if (!birth) return 0
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Auto-format: insert "/" after DD and MM
function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4)
}

export default function WaiverForm({ onSuccess, onBack }: Props) {
  const { t, i18n } = useTranslation()
  const sigRef = useRef<SignatureCanvas>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSigned, setHasSigned] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [accepted, setAccepted] = useState(false)

  const rules = Array.from({ length: 12 }, (_, i) => t(`waiver.rule_${i + 1}`))

  async function handleSubmit() {
    setError('')

    if (!guestName.trim() || !roomNumber.trim() || !dateOfBirth || !arrivalDate || !departureDate) {
      setError(t('waiver.required_fields'))
      return
    }

    if (!parseDate(dateOfBirth) || !parseDate(arrivalDate) || !parseDate(departureDate)) {
      setError(t('waiver.invalid_date'))
      return
    }

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
      guest_name: guestName.trim(),
      room_number: roomNumber.trim(),
      date_of_birth: toISO(dateOfBirth),
      arrival_date: toISO(arrivalDate),
      departure_date: toISO(departureDate),
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

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-hotel-bg to-white">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-4 sm:py-6">
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

        <h1 className="text-xl sm:text-2xl font-bold text-hotel-primary mb-4 sm:mb-6 text-center">
          🏋️ {t('waiver.title')}
        </h1>

        {/* Guest info fields */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          <input
            type="text"
            placeholder={t('waiver.guest_name')}
            value={guestName}
            onChange={(e) => { setGuestName(e.target.value); setError('') }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={t('waiver.room_number')}
            value={roomNumber}
            onChange={(e) => { setRoomNumber(e.target.value); setError('') }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t('waiver.date_of_birth')}</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="DD/MM/YYYY"
                value={dateOfBirth}
                onChange={(e) => { setDateOfBirth(formatDateInput(e.target.value)); setError('') }}
                className="w-full px-3 py-2.5 sm:py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t('waiver.arrival_date')}</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="DD/MM/YYYY"
                value={arrivalDate}
                onChange={(e) => { setArrivalDate(formatDateInput(e.target.value)); setError('') }}
                className="w-full px-3 py-2.5 sm:py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t('waiver.departure_date')}</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="DD/MM/YYYY"
                value={departureDate}
                onChange={(e) => { setDepartureDate(formatDateInput(e.target.value)); setError('') }}
                className="w-full px-3 py-2.5 sm:py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotel-primary-light"
              />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-hotel-primary mb-3">
            📋 {t('waiver.rules_title')}
          </h2>
          <ol className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 list-decimal list-inside">
            {rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ol>
        </div>

        {/* Accept checkbox */}
        <label className="flex items-start gap-3 mb-4 sm:mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => { setAccepted(e.target.checked); setError('') }}
            className="mt-1 w-5 h-5 accent-hotel-primary"
          />
          <span className="text-base text-gray-700 font-medium">
            {t('waiver.accept_rules')}
          </span>
        </label>

        {/* Signature */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-semibold text-hotel-primary">
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
          className={`w-full text-lg sm:text-xl font-semibold py-3 sm:py-4 rounded-2xl shadow-lg transition-all duration-200 mb-6 sm:mb-8 ${
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
