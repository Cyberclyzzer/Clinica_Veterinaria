"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Calendar, Clock, PawPrint, Stethoscope, FileText, X } from "lucide-react"

interface Appointment {
  id: number
  nombre_mascota: string
  veterinario_nombre: string
  fecha_hora: string
  motivo: string
  estado?: string
}

interface Pet {
  id: number
  nombre: string
}

interface Vet {
  id: number
  nombre: string
  especialidad: string
}

function OwnerAppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [vets, setVets] = useState<Vet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [appointment, setAppointment] = useState({
    mascota_id: "",
    veterinario_id: "",
    date: "",
    time: "",
    motivo: "",
  })
  const userId = sessionStorage.getItem("userId")

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/propietario/${userId}`)
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [userId])

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/propietario/${userId}`)
        const data = await response.json()
        setPets(data)
      } catch (error) {
        console.error("Error fetching pets:", error)
      }
    }

    fetchPets()
  }, [userId])

  // Fetch vets
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios`)
        const data = await response.json()
        setVets(data)
      } catch (error) {
        console.error("Error fetching vets:", error)
      }
    }

    fetchVets()
  }, [])

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAppointment((prev) => ({ ...prev, [name]: value }))
  }

  // Schedule appointment
  const scheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (appointment.mascota_id && appointment.veterinario_id && appointment.date && appointment.time) {
      try {
        const fechaHora = `${appointment.date}T${appointment.time}`
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mascota_id: appointment.mascota_id,
            veterinario_id: appointment.veterinario_id,
            fecha_hora: fechaHora,
            motivo: appointment.motivo || "Consulta general",
          }),
        })

        if (response.ok) {
          const newAppointment = await response.json()
          setAppointments([...appointments, newAppointment])
          setAppointment({ mascota_id: "", veterinario_id: "", date: "", time: "", motivo: "" })
          setShowForm(false)
          alert("¡Cita agendada exitosamente!")
        } else {
          alert("Error al agendar la cita: " + response.statusText)
        }
      } catch (error) {
        console.error("Error al agendar la cita:", error)
        alert("Error al agendar la cita. Por favor intente nuevamente.")
      }
    } else {
      alert("Por favor, completa todos los campos requeridos.")
    }
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

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date()
  }

  const upcomingAppointments = appointments.filter((app) => isUpcoming(app.fecha_hora))
  const pastAppointments = appointments.filter((app) => !isUpcoming(app.fecha_hora))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-blue-600">Cargando citas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 md:mb-0">Citas</h1>
      </div>

      {/* Appointment Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Agendar Nueva Cita
          </h2>
          <form onSubmit={scheduleAppointment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mascota_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Mascota <span className="text-red-500">*</span>
                </label>
                <select
                  id="mascota_id"
                  name="mascota_id"
                  value={appointment.mascota_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar mascota</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="veterinario_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinario <span className="text-red-500">*</span>
                </label>
                <select
                  id="veterinario_id"
                  name="veterinario_id"
                  value={appointment.veterinario_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar veterinario</option>
                  {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.nombre} - {vet.especialidad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={appointment.time}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de la cita
                </label>
                <textarea
                  id="motivo"
                  name="motivo"
                  placeholder="Describa el motivo de la cita"
                  value={appointment.motivo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agendar Cita
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === "upcoming" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Próximas Citas ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === "past" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Citas Pasadas ({pastAppointments.length})
        </button>
      </div>

      {/* Appointments List */}
      {activeTab === "upcoming" && (
        <>
          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No hay citas próximas</h3>
              <p className="text-gray-500 mb-4">No tienes citas programadas para los próximos días.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agendar Cita
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-lg font-semibold text-blue-700">{formatDate(appt.fecha_hora)}</span>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center">
                            <PawPrint className="h-4 w-4 text-green-600 mr-2" />
                            <span className="font-medium">{appt.nombre_mascota}</span>
                          </p>
                          <p className="flex items-center">
                            <Stethoscope className="h-4 w-4 text-blue-600 mr-2" />
                            <span>Dr. {appt.veterinario_nombre}</span>
                          </p>
                          <p className="flex items-start">
                            <FileText className="h-4 w-4 text-green-600 mr-2 mt-1" />
                            <span>{appt.motivo || "Consulta general"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center">
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </button>
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reprogramar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "past" && (
        <>
          {pastAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No hay citas pasadas</h3>
              <p className="text-gray-500">No tienes historial de citas anteriores.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-2"></div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-lg font-semibold text-gray-700">{formatDate(appt.fecha_hora)}</span>
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            Completada
                          </span>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center">
                            <PawPrint className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="font-medium">{appt.nombre_mascota}</span>
                          </p>
                          <p className="flex items-center">
                            <Stethoscope className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Dr. {appt.veterinario_nombre}</span>
                          </p>
                          <p className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                            <span>{appt.motivo || "Consulta general"}</span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OwnerAppointmentsView
