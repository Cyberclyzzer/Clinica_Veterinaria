"use client"

import type React from "react"
import { Clock, PawPrint, Stethoscope, FileText } from "lucide-react"

interface Appointment {
  id: number
  mascota_id: number
  veterinario_id: number
  fecha_hora: string
  duracion_estimada: number
  motivo: string
  mascota?: {
    id: number
    nombre: string
    especie: string
  } | null
  veterinario?: {
    id: number
    nombre: string
    especialidad: string
  } | null
}

interface TimeSlotGridProps {
  selectedDate: Date
  appointments: Appointment[]
  selectedDuration: number
  selectedTimeSlot: string | null
  onTimeSlotSelect: (hour: number, minute: number) => void
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  appointments,
  selectedDuration,
  selectedTimeSlot,
  onTimeSlotSelect,
}) => {
  // Función para verificar si un bloque de tiempo está ocupado
  const isTimeSlotOccupied = (hour: number, minute: number) => {
    const slotTime = new Date(selectedDate)
    slotTime.setHours(hour, minute, 0, 0)

    return appointments.some((app) => {
      const appTime = new Date(app.fecha_hora)
      const appEndTime = new Date(app.fecha_hora)
      appEndTime.setMinutes(appEndTime.getMinutes() + (app.duracion_estimada || 1) * 30)

      return slotTime >= appTime && slotTime < appEndTime
    })
  }

  // Función para verificar si un bloque de tiempo es pasado (anterior a la hora actual)
  const isTimeSlotPast = (hour: number, minute: number) => {
    const now = new Date()
    const slotTime = new Date(selectedDate)
    slotTime.setHours(hour, minute, 0, 0)

    // Si la fecha seleccionada es hoy, verificar si la hora es pasada
    if (
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear()
    ) {
      return slotTime < now
    }

    // Si la fecha seleccionada es anterior a hoy
    return selectedDate < now
  }

  // Función para verificar si se pueden reservar bloques consecutivos según la duración
  const canBookConsecutiveSlots = (hour: number, minute: number, duration: number) => {
    for (let i = 0; i < duration; i++) {
      const totalMinutes = minute + i * 30
      const currentHour = hour + Math.floor(totalMinutes / 60)
      const currentMinute = totalMinutes % 60

      // Check if currentHour exceeds the last hour of the day
      if (currentHour >= 24) return false

      // Verificar si alguno de los bloques está ocupado
      if (isTimeSlotOccupied(currentHour, currentMinute)) return false

      // Verificar si alguno de los bloques es pasado
      if (isTimeSlotPast(currentHour, currentMinute)) return false
    }
    return true
  }

  // Función para obtener la cita en un bloque de tiempo específico
  const getAppointmentAtTimeSlot = (hour: number, minute: number) => {
    const slotTime = new Date(selectedDate)
    slotTime.setHours(hour, minute, 0, 0)

    return appointments.find((app) => {
      const appTime = new Date(app.fecha_hora)
      const appEndTime = new Date(app.fecha_hora)
      appEndTime.setMinutes(appEndTime.getMinutes() + (app.duracion_estimada || 1) * 30)

      return slotTime >= appTime && slotTime < appEndTime
    })
  }

  // Función para generar los bloques de tiempo para el calendario (24 horas)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({ hour, minute })
      }
    }
    return slots
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Encabezado de horas */}
      <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
        <div className="py-2 px-4 font-medium text-gray-700 text-center">Hora</div>
        <div className="py-2 px-4 font-medium text-gray-700 text-center">Disponibilidad</div>
      </div>

      {/* Bloques de tiempo */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {generateTimeSlots().map(({ hour, minute }) => {
          const formattedHour = hour.toString().padStart(2, "0")
          const formattedMinute = minute.toString().padStart(2, "0")
          const timeString = `${formattedHour}:${formattedMinute}`

          const appointmentAtSlot = getAppointmentAtTimeSlot(hour, minute)
          const isOccupied = !!appointmentAtSlot
          const isPast = isTimeSlotPast(hour, minute)
          const isAvailable = canBookConsecutiveSlots(hour, minute, selectedDuration)
          const isSelected = timeString === selectedTimeSlot

          return (
            <div key={timeString} className="grid grid-cols-2 hover:bg-gray-50">
              <div className="py-3 px-4 text-gray-700 border-r border-gray-200">{timeString}</div>
              <div className="py-3 px-4">
                {isOccupied ? (
                  <div className="bg-pink-100 text-pink-800 rounded-lg p-3 text-sm">
                    <div className="font-medium text-pink-800">Ocupado</div>
                    <div className="mt-1 space-y-1">
                      {appointmentAtSlot?.mascota && (
                        <div className="flex items-start">
                          <PawPrint className="h-4 w-4 mr-1 mt-0.5 text-pink-700" />
                          <span>
                            <strong>Mascota:</strong> {appointmentAtSlot.mascota.nombre}
                          </span>
                        </div>
                      )}
                      {appointmentAtSlot?.veterinario && (
                        <div className="flex items-start">
                          <Stethoscope className="h-4 w-4 mr-1 mt-0.5 text-pink-700" />
                          <span>
                            <strong>Veterinario:</strong> {appointmentAtSlot.veterinario.nombre}
                          </span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-1 mt-0.5 text-pink-700" />
                        <span>
                          <strong>Duración:</strong> {appointmentAtSlot?.duracion_estimada * 30} min
                        </span>
                      </div>
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 mr-1 mt-0.5 text-pink-700" />
                        <span>
                          <strong>Motivo:</strong> {appointmentAtSlot?.motivo?.substring(0, 20)}
                          {appointmentAtSlot?.motivo?.length > 20 ? "..." : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : isPast ? (
                  <div className="bg-gray-100 text-gray-500 rounded-lg p-2 text-sm">
                    <div className="font-medium">Hora pasada</div>
                    <div>No disponible</div>
                  </div>
                ) : isAvailable ? (
                  <button
                    type="button"
                    onClick={() => onTimeSlotSelect(hour, minute)}
                    className={`w-full py-2 px-3 rounded-lg text-sm transition-colors ${
                      isSelected ? "bg-pink-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {isSelected ? "Seleccionado" : "Disponible"}
                  </button>
                ) : (
                  <div className="bg-yellow-50 text-yellow-800 rounded-lg p-2 text-sm">
                    No disponible para la duración seleccionada
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TimeSlotGrid
