export interface GymWaiver {
  guest_name: string
  room_number: string
  date_of_birth: string
  arrival_date: string
  departure_date: string
  signature_data: string
  language: string
}

export interface GymWaiverRow extends GymWaiver {
  id: string
  created_at: string
}

// Satisfaction survey types (from guest-sati-app, same Supabase)
export interface FeedbackStats {
  total_responses: number
  avg_apartamento: number
  avg_restaurantes: number
  avg_animacion: number
  avg_recepcion: number
  avg_instalaciones: number
  avg_housekeeping: number
  avg_overall: number
}

export interface DailySummary {
  day: string
  total_responses: number
  avg_apartamento: number
  avg_restaurantes: number
  avg_animacion: number
  avg_recepcion: number
  avg_instalaciones: number
  avg_housekeeping: number
  avg_overall: number
}
