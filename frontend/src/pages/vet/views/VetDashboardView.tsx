"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, PawPrint, FileText, ClipboardList, Activity, CheckCircle, AlertCircle } from "lucide-react"

interface VetDashboardViewProps {
  appointments: any[]
  consultations: any[]
  setActiveView: (view: "dashboard" | "citas" | "consultas" | "mis-consultas") => void
}

interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
}

const VetDashboardView: React.FC<VetDashboardViewProps> = ({ appointments, consultations, setActiveView }) => {
  const userId = sessionStorage.getItem("userId")
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [recentConsultations, setRecentConsultations] = useState<any[]>([])
  const [vetName, setVetName] = useState<string>("Dr. Veterinario")
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Filter today's appointments
    const today = new Date().toISOString().split("T")[0]
    const todayAppts = appointments.filter((appt) => appt.fecha_hora.includes(today))
    setTodayAppointments(todayAppts)

    // Get recent consultations
    const sortedConsultations = [...consultations].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    )
    setRecentConsultations(sortedConsultations.slice(0, 3))

    // Calculate stats
    const uniquePatients = new Set(appointments.map((appt) => appt.mascota_nombre))
    const uniqueOwners = new Set(appointments.map((appt) => appt.propietario_nombre))

    const fetchName = async () => {
        try {
            const vetResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios/${userId}`)
            if (vetResponse.ok) {
              const vetData = await vetResponse.json()
              console.log("Vet Data:", vetData)
              if (vetData && vetData.nombre) {
                setVetName(vetData.nombre)
              }
            }
          } catch (error) {
            console.error("Error fetching vet data:", error)
          }
    }

    const statsData: StatCard[] = [
      {
        title: "Citas Pendientes",
        value: appointments.length,
        icon: <Calendar className="h-6 w-6" />,
        color: "text-blue-600",
        bgColor: "bg-blue-600",
      },
      {
        title: "Citas Hoy",
        value: todayAppts.length,
        icon: <Clock className="h-6 w-6" />,
        color: "text-green-600",
        bgColor: "bg-green-600",
      },
      {
        title: "Pacientes",
        value: uniquePatients.size,
        icon: <PawPrint className="h-6 w-6" />,
        color: "text-indigo-600",
        bgColor: "bg-indigo-600",
      },
      {
        title: "Consultas",
        value: consultations.length,
        icon: <FileText className="h-6 w-6" />,
        color: "text-amber-600",
        bgColor: "bg-amber-600",
      },
    ]

    setStats(statsData)
    setLoading(false)
    fetchName()
  }, [appointments, consultations])

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
        <div className="animate-pulse text-green-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-700">Bienvenido, Dr. {vetName || 'Dr. Veterinario'}</h1>
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
            className={`bg-gradient-to-br from-${stat.color.split("-")[1]}-50 to-${
              stat.color.split("-")[1]
            }-100 rounded-xl shadow-md p-6 flex items-center`}
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
          <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Citas de Hoy</h2>
            </div>
            <button
              onClick={() => setActiveView("citas")}
              className="text-xs bg-white text-green-700 px-2 py-1 rounded-full hover:bg-green-50 transition-colors"
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
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
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
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Atender
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  Consultas
                </div>
                <span className="text-sm font-medium text-green-600">{consultations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                  Citas Pendientes
                </div>
                <span className="text-sm font-medium text-blue-600">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                  Citas de Hoy
                </div>
                <span className="text-sm font-medium text-amber-600">{todayAppointments.length}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Últimas Consultas</h3>
              {recentConsultations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">No hay consultas registradas</p>
              ) : (
                <div className="space-y-3">
                  {recentConsultations.map((consult) => (
                    <div key={consult.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{consult.mascota_nombre}</p>
                        <span className="text-xs text-gray-500">{formatDate(consult.fecha)}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">{consult.descripcion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Acciones Rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveView("consultas")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <ClipboardList className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Registrar Consulta</h3>
            <p className="text-sm text-green-100">Registra una nueva consulta médica</p>
          </div>

          <div
            onClick={() => setActiveView("citas")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <Calendar className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Ver Citas</h3>
            <p className="text-sm text-blue-100">Revisa tus citas pendientes</p>
          </div>

          <div
            onClick={() => setActiveView("mis-consultas")}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <FileText className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Historial</h3>
            <p className="text-sm text-indigo-100">Consulta el historial de pacientes</p>
          </div>
        </div>
      </div>

      {/* Alerts and Reminders */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
        <div className="bg-amber-100 text-amber-600 p-2 rounded-full mr-3 mt-1">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-amber-800 mb-1">Recordatorios</h3>
          <p className="text-sm text-amber-700">
            No olvides actualizar el historial médico después de cada consulta. Esto ayuda a mantener un seguimiento
            adecuado de los pacientes y facilita futuras consultas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VetDashboardView
