"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Search, Filter, Clock, PawPrint, User, Stethoscope, CheckCircle, X, AlertCircle } from "lucide-react"

interface Appointment {
  id: number
  id_cita?: number // Para compatibilidad con diferentes formatos de respuesta
  mascota_nombre?: string
  mascota?: string
  propietario_nombre?: string
  propietario?: string
  veterinario_nombre?: string
  veterinario?: string
  fecha_hora: string
  motivo: string
  estado?: string
  duracion_estimada?: number
}

const RecepcionistAppointmentsView: React.FC = () => {
  // Obtener la fecha actual en formato YYYY-MM-DD para el filtro por defecto
  const today = new Date().toISOString().split("T")[0]

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>(today) // Inicializar con la fecha actual
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetails, setShowDetails] = useState<boolean>(false)

  useEffect(() => {
    fetchAppointmentsByDate(dateFilter)
  }, [dateFilter]) // Cargar citas cuando cambie la fecha

  const fetchAppointmentsByDate = async (date: string) => {
    setLoading(true)
    try {
      // Usar el endpoint específico para obtener citas por fecha
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/fecha/${date}`)
      const data = await response.json()

      // Normalizar los datos para manejar diferentes formatos de respuesta
      const normalizedAppointments = data.map((appt: any) => {
        const appointmentDate = new Date(appt.fecha_hora)
        const now = new Date()

        let status = "pendiente"
        if (appointmentDate < now) {
          status = "completada"
        }

        // Normalizar los nombres de las propiedades
        return {
          id: appt.id || appt.id_cita,
          id_cita: appt.id_cita || appt.id,
          mascota_nombre: appt.mascota_nombre || appt.mascota,
          propietario_nombre: appt.propietario_nombre || appt.propietario,
          veterinario_nombre: appt.veterinario_nombre || appt.veterinario,
          fecha_hora: appt.fecha_hora,
          motivo: appt.motivo,
          estado: status,
          duracion_estimada: appt.duracion_estimada || 1,
        }
      })

      setAppointments(normalizedAppointments)
      applyFilters(normalizedAppointments)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching appointments by date:", error)
      setAppointments([])
      setFilteredAppointments([])
      setLoading(false)
    }
  }

  useEffect(() => {
    applyFilters(appointments)
  }, [searchTerm, statusFilter])

  const applyFilters = (appts: Appointment[]) => {
    let filtered = [...appts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (appt) =>
          (appt.mascota_nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (appt.propietario_nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (appt.veterinario_nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (appt.motivo?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((appt) => appt.estado === statusFilter)
    }

    setFilteredAppointments(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const openAppointmentDetails = (appointment: Appointment) => {
    // Asegurarse de que todos los campos necesarios estén presentes
    const completeAppointment = {
      ...appointment,
      id: appointment.id || appointment.id_cita || 0,
      mascota_nombre: appointment.mascota_nombre || appointment.mascota || "No disponible",
      propietario_nombre: appointment.propietario_nombre || appointment.propietario || "No disponible",
      veterinario_nombre: appointment.veterinario_nombre || appointment.veterinario || "No disponible",
    }

    setSelectedAppointment(completeAppointment)
    setShowDetails(true)
  }

  const closeAppointmentDetails = () => {
    setShowDetails(false)
    setSelectedAppointment(null)
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Pendiente
          </span>
        )
      case "completada":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completada
          </span>
        )
      case "cancelada":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelada
          </span>
        )
      default:
        return null
    }
  }

  // Formatear la fecha para mostrarla en el título
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  // Verificar si la fecha seleccionada es hoy
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateString === today
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-pink-600">Cargando citas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-pink-700">
          Citas {isToday(dateFilter) ? "de Hoy" : `del ${formatDisplayDate(dateFilter)}`}
        </h1>
        <div className="text-sm text-gray-500">Total: {filteredAppointments.length} citas</div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por paciente, propietario o veterinario..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron citas</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No hay citas que coincidan con los criterios de búsqueda."
              : `No hay citas programadas para el ${formatDisplayDate(dateFilter)}.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Hora
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Mascota
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Propietario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Veterinario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-pink-600 mr-2" />
                        <span>
                          {new Date(appointment.fecha_hora).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <PawPrint className="h-5 w-5 text-pink-600 mr-2" />
                        <span>{appointment.mascota_nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{appointment.propietario_nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Stethoscope className="h-5 w-5 text-gray-400 mr-2" />
                        <span>Dr. {appointment.veterinario_nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(appointment.estado || "pendiente")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openAppointmentDetails(appointment)}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalles de la Cita</h3>
              <button onClick={closeAppointmentDetails} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</h4>
                  <p className="text-lg font-medium flex items-center">
                    <Calendar className="h-5 w-5 text-pink-600 mr-2" />
                    {formatDate(selectedAppointment.fecha_hora)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Mascota</h4>
                    <p className="text-lg font-medium flex items-center">
                      <PawPrint className="h-5 w-5 text-pink-600 mr-2" />
                      {selectedAppointment.mascota_nombre}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Propietario</h4>
                    <p className="text-lg font-medium flex items-center">
                      <User className="h-5 w-5 text-pink-600 mr-2" />
                      {selectedAppointment.propietario_nombre}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Veterinario</h4>
                  <p className="text-lg font-medium flex items-center">
                    <Stethoscope className="h-5 w-5 text-pink-600 mr-2" />
                    Dr. {selectedAppointment.veterinario_nombre}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Motivo de la Cita</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.motivo || "No se especificó motivo"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Estado</h4>
                  <div className="mt-1">{getStatusBadge(selectedAppointment.estado || "pendiente")}</div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  {selectedAppointment.estado !== "completada" && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Marcar como Completada
                    </button>
                  )}
                  {selectedAppointment.estado !== "cancelada" && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                      <X className="h-5 w-5 mr-2" />
                      Cancelar Cita
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder */}
      <div className="mt-8 bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-start">
        <div className="bg-pink-100 text-pink-600 p-2 rounded-full mr-3 mt-1">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-pink-800 mb-1">Recordatorio</h3>
          <p className="text-sm text-pink-700">
            Recuerda confirmar las citas del día siguiente y notificar a los propietarios. Esto ayuda a reducir las
            ausencias y mejora la experiencia del cliente.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RecepcionistAppointmentsView
