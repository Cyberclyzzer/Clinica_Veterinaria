"use client"

import { PawPrint, Calendar, Clock, Stethoscope } from "lucide-react"
import { useEffect, useState } from "react"

interface OwnerDashboardViewProps {
  setActiveView: (view: "dashboard" | "pets" | "appointments") => void
}

interface Pet {
  id: number
  nombre: string
  especie: string
}

interface Appointment {
  id: number
  nombre_mascota: string
  veterinario_nombre: string
  fecha_hora: string
}

function OwnerDashboardView({ setActiveView }: OwnerDashboardViewProps) {
  const [petCount, setPetCount] = useState<number>(0)
  const [appointmentCount, setAppointmentCount] = useState<number>(0)
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null)
  const [recentPets, setRecentPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [ownerName, setOwnerName] = useState<string>("Propietario")
  const userId = sessionStorage.getItem("userId")

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return

      try {
        // Fetch pets
        const petsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/propietario/${userId}`)
        const petsData = await petsResponse.json()

        if (Array.isArray(petsData)) {
          setPetCount(petsData.length)
          setRecentPets(petsData.slice(0, 3))
        }

        // Fetch appointments
        const appointmentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/propietario/${userId}`)
        const appointmentsData = await appointmentsResponse.json()

        if (Array.isArray(appointmentsData)) {
          setAppointmentCount(appointmentsData.length)

          // Find next appointment (closest to current date)
          if (appointmentsData.length > 0) {
            const sortedAppointments = [...appointmentsData].sort(
              (a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime(),
            )

            const upcomingAppointments = sortedAppointments.filter((app) => new Date(app.fecha_hora) >= new Date())

            if (upcomingAppointments.length > 0) {
              setNextAppointment(upcomingAppointments[0])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userId])

  useEffect(() => {
    // Fetch owner data
    const fetchOwnerData = async () => {
      const userId = sessionStorage.getItem("userId")
      if (!userId) return

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios/${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.nombre) {
            setOwnerName(data.nombre)
          }
        }
      } catch (error) {
        console.error("Error fetching owner data:", error)
      }
    }

    fetchOwnerData()
  }, [])

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
        <div className="animate-pulse text-blue-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">
          Bienvenido, {ownerName || "Propietario"}
        </h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
            <PawPrint className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Mis Mascotas</p>
            <p className="text-2xl font-bold text-blue-900">{petCount}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-600 text-white p-3 rounded-lg mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">Citas Pendientes</p>
            <p className="text-2xl font-bold text-green-900">{appointmentCount}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 flex items-center md:col-span-2 lg:col-span-1">
          <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Próxima Cita</p>
            <p className="text-lg font-bold text-blue-900">
              {nextAppointment ? formatDate(nextAppointment.fecha_hora) : "No hay citas programadas"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Pets */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center">
              <PawPrint className="h-5 w-5 mr-2" />
              Mis Mascotas
            </h2>
            <button
              onClick={() => setActiveView("pets")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todas
            </button>
          </div>

          {recentPets.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>No tienes mascotas registradas</p>
              <button
                onClick={() => setActiveView("pets")}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Registrar mascota
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentPets.map((pet) => (
                <li key={pet.id} className="bg-gray-50 rounded-lg p-3 flex items-center">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-full mr-3">
                    <PawPrint className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{pet.nombre}</p>
                    <p className="text-sm text-gray-500">{pet.especie}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Acciones Rápidas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveView("appointments")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
            >
              <Calendar className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Agendar Cita</h3>
              <p className="text-sm text-blue-100">Programa una nueva cita para tus mascotas</p>
            </div>

            <div
              onClick={() => setActiveView("pets")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
            >
              <PawPrint className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Mis Mascotas</h3>
              <p className="text-sm text-green-100">Gestiona la información de tus mascotas</p>
            </div>
          </div>

          {nextAppointment && (
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Próxima Cita
              </h3>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-1">
                  <p className="flex items-center text-gray-700">
                    <PawPrint className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">{nextAppointment.nombre_mascota}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Stethoscope className="h-4 w-4 mr-2 text-green-600" />
                    <span>Dr. {nextAppointment.veterinario_nombre}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{formatDate(nextAppointment.fecha_hora)}</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("appointments")}
                  className="mt-3 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboardView
