import { jsPDF } from 'jspdf'
import type { GymWaiverRow } from './types'

const RULES_ES = [
  'El uso de estas instalaciones sólo está permitido para MAYORES de 16 años.',
  'Todas las personas que utilicen los equipos lo hacen bajo su responsabilidad.',
  'No está permitida la reserva previa de esta instalación.',
  'Por su propia SEGURIDAD, contamos con videovigilancia las 24 horas del día. Las grabaciones se eliminarán después de 24 horas.',
  'Se ruega poner «EN SILENCIO» los dispositivos móviles a la entrada.',
  'IMPRESCINDIBLE llevar calzado y ropa adecuada en todo momento.',
  'Como NORMA fundamental de HIGIENE será de obligado cumplimiento la utilización de una toalla para sentarse y/o tumbarse cuando se utiliza el equipo.',
  'Toallas disponibles para comprar en recepción.',
  'Respete las restricciones de tiempo en máquinas de ejercicio cardiovascular.',
  'Por favor, COLOCAR las pesas en sus compartimentos, no tirar ni golpear.',
  'Está PROHIBIDO comer en esta zona. Las bebidas que se consuman durante el entrenamiento deberán estar debidamente cerradas.',
  'Informe de averías o problemas de inmediato a la recepción.',
]

const RULES_EN = [
  'Use of these facilities is only permitted for persons over the age of 16.',
  'All persons using the equipment do so at their own risk.',
  'Advance booking of these facilities is not permitted.',
  'For your own SAFETY, we have 24-hour video surveillance. Recordings will be deleted after 24 hours.',
  'Please set your mobile devices to \'SILENT\' mode at the entrance.',
  'It is ESSENTIAL to wear appropriate footwear and clothing at all times.',
  'As a fundamental HYGIENE RULE, it is mandatory to use a towel to sit and/or lie down on when using the equipment.',
  'Towels are available for purchase at reception.',
  'Please respect the time restrictions on cardiovascular exercise machines.',
  'Please PLACE weights in their compartments; do not throw or hit them.',
  'Eating is PROHIBITED in this area. Drinks consumed during training must be properly sealed.',
  'Report any faults or problems immediately to reception.',
]

function formatDate(d: string): string {
  if (!d) return ''
  if (d.includes('/')) return d
  const parts = d.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return d
}

export function generateWaiverPdf(waiver: GymWaiverRow) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('ROYAL SUN RESORT', pageWidth / 2, 20, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Calle Geranios, 16, 38683, Los Gigantes, Tenerife, España', pageWidth / 2, 27, { align: 'center' })
  doc.text('www.royalsunresort.com | tel.: +34 922 862 802', pageWidth / 2, 32, { align: 'center' })

  // Line separator
  doc.setDrawColor(178, 34, 52)
  doc.setLineWidth(0.8)
  doc.line(20, 36, pageWidth - 20, 36)

  // Title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Autorización de uso del gimnasio / Gym Usage Authorization', pageWidth / 2, 44, { align: 'center' })

  // Guest info
  let y = 55
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Nombre / Name:', 20, y)
  doc.setFont('helvetica', 'normal')
  doc.text(waiver.guest_name, 75, y)

  doc.setFont('helvetica', 'bold')
  doc.text('Habitación / Room:', 120, y)
  doc.setFont('helvetica', 'normal')
  doc.text(waiver.room_number, 170, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha nacimiento / Date of birth:', 20, y)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(waiver.date_of_birth), 95, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('Llegada / Arrival:', 20, y)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(waiver.arrival_date), 65, y)

  doc.setFont('helvetica', 'bold')
  doc.text('Salida / Departure:', 110, y)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(waiver.departure_date), 155, y)

  // Line separator
  y += 6
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(20, y, pageWidth - 20, y)

  // Rules - Spanish
  y += 8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Normas de uso del gimnasio:', 20, y)
  y += 6

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  RULES_ES.forEach((rule, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${rule}`, pageWidth - 45)
    doc.text(lines, 22, y)
    y += lines.length * 4
  })

  // Rules - English
  y += 4
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Gym Rules:', 20, y)
  y += 6

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  RULES_EN.forEach((rule, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${rule}`, pageWidth - 45)
    doc.text(lines, 22, y)
    y += lines.length * 4
  })

  // Acceptance text
  y += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text('He leído y acepto las normas / I have read and accept the rules', pageWidth / 2, y, { align: 'center' })

  // Signature
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Firma / Signature:', 20, y)

  if (waiver.signature_data) {
    try {
      doc.addImage(waiver.signature_data, 'PNG', 20, y + 3, 80, 30)
    } catch {
      // signature image failed, skip
    }
  }

  // Date signed
  const signedDate = new Date(waiver.created_at)
  const signedStr = signedDate.toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Fecha de firma / Date signed: ${signedStr}`, 120, y + 20)

  // Footer
  doc.setDrawColor(178, 34, 52)
  doc.setLineWidth(0.5)
  doc.line(20, 280, pageWidth - 20, 280)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Royal Sun Resort - Documento generado digitalmente', pageWidth / 2, 285, { align: 'center' })

  // Save
  doc.save(`gym-waiver-${waiver.guest_name.replace(/\s+/g, '-')}-${waiver.room_number}.pdf`)
}
