import type React from "react"
import { Calendar, Clock, PawPrint, User, FileText, CheckCircle } from "lucide-react"

interface Appointment {
  id: number
  mascota_nombre: string
  propietario_nombre: string
  fecha_hora: string
  motivo: string
}

interface VetAppointmentsViewProps {
  appointments: Appointment[]
}

const VetAppointmentsView: React.FC<VetAppointmentsViewProps> = ({ appointments }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const appointmentDate = new Date(dateString)
    return (
      today.getDate() === appointmentDate.getDate() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getFullYear() === appointmentDate.getFullYear()
    )
  }

  // Group appointments by date
  const groupedAppointments: { [key: string]: Appointment[] } = {}

  appointments.forEach((appointment) => {
    const date = new Date(appointment.fecha_hora).toLocaleDateString("es-ES")
    if (!groupedAppointments[date]) {
      groupedAppointments[date] = []
    }
    groupedAppointments[date].push(appointment)
  })

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-700">Citas Pendientes</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-600 text-white p-3 rounded-lg mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">Total Citas</p>
            <p className="text-2xl font-bold text-green-900">{appointments.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Citas Hoy</p>
            <p className="text-2xl font-bold text-blue-900">
              {appointments.filter((app) => isToday(app.fecha_hora)).length}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-600 text-white p-3 rounded-lg mr-4">
            <PawPrint className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">Pacientes</p>
            <p className="text-2xl font-bold text-green-900">
              {new Set(appointments.map((app) => app.mascota_nombre)).size}
            </p>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No hay citas pendientes</h3>
          <p className="text-gray-500">No tienes citas programadas en este momento.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-600 text-white px-6 py-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-semibold">
                  {isToday(date) ? "Hoy" : date}
                  <span className="ml-2 text-sm bg-white text-green-700 rounded-full px-2 py-0.5">
                    {groupedAppointments[date].length} citas
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {groupedAppointments[date].map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-lg font-semibold text-green-700">
                            {new Date(appointment.fecha_hora).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center">
                            <PawPrint className="h-4 w-4 text-green-600 mr-2" />
                            <span className="font-medium">{appointment.mascota_nombre}</span>
                          </p>
                          <p className="flex items-center">
                            <User className="h-4 w-4 text-blue-600 mr-2" />
                            <span>Propietario: {appointment.propietario_nombre}</span>
                          </p>
                          <p className="flex items-start">
                            <FileText className="h-4 w-4 text-green-600 mr-2 mt-1" />
                            <span>{appointment.motivo || "Consulta general"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Atender
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VetAppointmentsView
