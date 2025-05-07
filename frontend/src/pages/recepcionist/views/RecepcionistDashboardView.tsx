"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Users, PawPrint, Clock, ClipboardList, Activity, AlertCircle, User, Plus } from "lucide-react"

interface RecepcionistDashboardViewProps {
  setActiveView: (view: "dashboard" | "owners" | "appointments" | "schedule" | "add-pet") => void
}

interface StatCard {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
  onClick: () => void
}

const RecepcionistDashboardView: React.FC<RecepcionistDashboardViewProps> = ({ setActiveView }) => {
  const [ownerCount, setOwnerCount] = useState<number>(0)
  const [petCount, setPetCount] = useState<number>(0)
  const [appointmentCount, setAppointmentCount] = useState<number>(0)
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [recentOwners, setRecentOwners] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch owners
        const ownersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`)
        const ownersData = await ownersResponse.json()
        if (Array.isArray(ownersData)) {
          setOwnerCount(ownersData.length)
          setRecentOwners(ownersData.slice(0, 3))
        }

        // Fetch pets
        const petsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-crud`)
        const petsData = await petsResponse.json()
        if (Array.isArray(petsData)) {
          setPetCount(petsData.length)
        }

        // Fetch appointments
        const appointmentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/citas`)
        const appointmentsData = await appointmentsResponse.json()
        if (Array.isArray(appointmentsData)) {
          setAppointmentCount(appointmentsData.length)

          // Filter today's appointments
          const today = new Date().toISOString().split("T")[0]
          const todayAppts = appointmentsData.filter((appt) => appt.fecha_hora.includes(today))
          setTodayAppointments(todayAppts)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats: StatCard[] = [
    {
      title: "Propietarios",
      value: ownerCount,
      icon: <Users className="h-6 w-6" />,
      color: "text-pink-600",
      bgColor: "bg-pink-600",
      onClick: () => setActiveView("owners"),
    },
    {
      title: "Mascotas",
      value: petCount,
      icon: <PawPrint className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-600",
      onClick: () => setActiveView("owners"),
    },
    {
      title: "Citas Totales",
      value: appointmentCount,
      icon: <Calendar className="h-6 w-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-600",
      onClick: () => setActiveView("appointments"),
    },
    {
      title: "Citas Hoy",
      value: todayAppointments.length,
      icon: <Clock className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      onClick: () => setActiveView("appointments"),
    },
  ]

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-pink-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-pink-700">Dashboard de Recepción</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`bg-gradient-to-br from-${stat.color.split("-")[1]}-50 to-${
              stat.color.split("-")[1]
            }-100 rounded-xl shadow-md p-6 flex items-center cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <div className={`${stat.bgColor} text-white p-3 rounded-lg mr-4`}>{stat.icon}</div>
            <div>
              <p className={`text-sm ${stat.color} font-medium`}>{stat.title}</p>
              <p className={`text-2xl font-bold text-${stat.color.split("-")[1]}-900`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Citas de Hoy</h2>
            </div>
            <button
              onClick={() => setActiveView("appointments")}
              className="text-xs bg-white text-pink-700 px-2 py-1 rounded-full hover:bg-pink-50 transition-colors"
            >
              Ver todas
            </button>
          </div>

          <div className="p-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg font-medium text-gray-600 mb-1">No hay citas programadas para hoy</p>
                <p className="text-sm text-gray-500">¡Disfruta tu día!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {todayAppointments.map((appt) => (
                  <div key={appt.id} className="py-4 flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="bg-pink-100 text-pink-600 p-2 rounded-lg mr-3">
                        <PawPrint className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{appt.mascota_nombre}</p>
                        <p className="text-sm text-gray-500">{appt.propietario_nombre}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(appt.fecha_hora).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <span className="mx-1">•</span>
                          <span>{appt.motivo || "Consulta general"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Dr. {appt.veterinario_nombre}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Owners */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Propietarios Recientes</h2>
            </div>
            <button
              onClick={() => setActiveView("owners")}
              className="text-xs bg-white text-pink-700 px-2 py-1 rounded-full hover:bg-pink-50 transition-colors"
            >
              Ver todos
            </button>
          </div>

          <div className="p-4">
            {recentOwners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg font-medium text-gray-600 mb-1">No hay propietarios registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOwners.map((owner) => (
                  <div key={owner.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <User className="h-5 w-5 text-pink-600 mr-2" />
                      <p className="font-medium">{owner.nombre}</p>
                    </div>
                    <div className="pl-7 text-sm text-gray-500">
                      <p>{owner.email}</p>
                      <p>{owner.telefono}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-pink-700 mb-4">Acciones Rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveView("schedule")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <ClipboardList className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Agendar Cita</h3>
            <p className="text-sm text-pink-100">Programa una nueva cita</p>
          </div>

          <div
            onClick={() => setActiveView("add-pet")}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-center mb-3">
              <PawPrint className="h-8 w-8" />
              <Plus className="h-5 w-5 -ml-2 bg-white text-indigo-500 rounded-full" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Agregar Mascota</h3>
            <p className="text-sm text-indigo-100">Registra una nueva mascota</p>
          </div>

          <div
            onClick={() => setActiveView("owners")}
            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Ver Propietarios</h3>
            <p className="text-sm text-purple-100">Gestiona los propietarios</p>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Resumen de Actividad</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-2 w-2 rounded-full bg-pink-500 mr-2"></div>
                Propietarios Registrados
              </div>
              <span className="text-sm font-medium text-pink-600">{ownerCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                Mascotas Registradas
              </div>
              <span className="text-sm font-medium text-purple-600">{petCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                Citas Programadas
              </div>
              <span className="text-sm font-medium text-blue-600">{appointmentCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                Citas de Hoy
              </div>
              <span className="text-sm font-medium text-green-600">{todayAppointments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder */}
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-start">
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

export default RecepcionistDashboardView
