"use client"

import type React from "react"

interface CalendarPickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onDateSelect }) => {
  // Asegurarnos de que today sea la fecha actual correcta
  const today = new Date()

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  // Obtener el primer día del mes
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Domingo, 1 = Lunes, etc.

  // Obtener el último día del mes
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const totalDaysInMonth = lastDayOfMonth.getDate()

  // Crear un array con los días del mes
  const daysArray = []

  // Agregar días vacíos para alinear el primer día del mes
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysArray.push(null)
  }

  // Agregar los días del mes
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    daysArray.push(date)
  }

  // Dividir el array en semanas (filas de 7 días)
  const weeksArray = []
  for (let i = 0; i < daysArray.length; i += 7) {
    weeksArray.push(daysArray.slice(i, i + 7))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            const newDate = new Date(selectedDate)
            newDate.setMonth(newDate.getMonth() - 1)
            onDateSelect(newDate)
          }}
          className="p-2 rounded-full hover:bg-pink-100 text-pink-700"
        >
          &lt;
        </button>
        <h3 className="text-lg font-medium">
          {selectedDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={() => {
            const newDate = new Date(selectedDate)
            newDate.setMonth(newDate.getMonth() + 1)
            onDateSelect(newDate)
          }}
          className="p-2 rounded-full hover:bg-pink-100 text-pink-700"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {weeksArray.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, dayIndex) => {
            if (!day) {
              return <div key={`empty-${dayIndex}`} className="h-10"></div>
            }

            const isToday =
              day.getDate() === today.getDate() &&
              day.getMonth() === today.getMonth() &&
              day.getFullYear() === today.getFullYear()

            const isSelected =
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth() &&
              day.getFullYear() === selectedDate.getFullYear()

            const isPast = day < new Date(today.setHours(0, 0, 0, 0))

            return (
              <button
                key={day.getTime()}
                onClick={() => onDateSelect(day)}
                disabled={isPast}
                className={`h-10 rounded-lg flex items-center justify-center text-sm transition-colors ${
                  isSelected
                    ? "bg-pink-600 text-white"
                    : isToday
                      ? "bg-pink-100 text-pink-800"
                      : isPast
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-pink-50"
                }`}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default CalendarPicker
