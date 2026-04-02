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
