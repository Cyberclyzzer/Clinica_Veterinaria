"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  CalendarIcon,
  Clock,
  PawPrint,
  Stethoscope,
  FileText,
  CheckCircle,
  User,
  AlertCircle,
  Search,
  X,
  Info,
} from "lucide-react"
import TimeSlotGrid from "../../../components/TimeSlotGrid"
import CalendarPicker from "../../../components/CalendarPicker"

interface Owner {
  id: number
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
}

interface Pet {
  id: number
  nombre: string
  especie: string
  propietario_id: number
}

interface Vet {
  id: number
  nombre: string
  especialidad: string
}

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

const AgendarCitasView: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [vets, setVets] = useState<Vet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Búsqueda de propietarios
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showOwnerSearch, setShowOwnerSearch] = useState<boolean>(false)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)

  // Estado para el calendario
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  })
  const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false)
  const [dateAppointments, setDateAppointments] = useState<Appointment[]>([])
  const [vetAppointments, setVetAppointments] = useState<Appointment[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false)

  // Estado del formulario
  const [appointment, setAppointment] = useState({
    propietario_id: "",
    mascota_id: "",
    veterinario_id: "",
    motivo: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch owners
        const ownersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`)
        const ownersData = await ownersResponse.json()
        setOwners(ownersData)

        // Fetch all pets
        const petsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-crud`)
        const petsData = await petsResponse.json()
        setPets(petsData)

        // Fetch vets
        const vetsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios`)
        const vetsData = await vetsResponse.json()
        setVets(vetsData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter pets based on selected owner
  useEffect(() => {
    if (appointment.propietario_id) {
      const ownerPets = pets.filter((pet) => pet.propietario_id === Number.parseInt(appointment.propietario_id))
      setFilteredPets(ownerPets)
    } else {
      setFilteredPets([])
    }
  }, [appointment.propietario_id, pets])

  // Filtrar citas por fecha seleccionada
  useEffect(() => {
    const fetchAppointmentsByDate = async () => {
      if (!selectedDate) return

      try {
        setLoadingAppointments(true)
        const dateString = selectedDate.toISOString().split("T")[0]
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/fecha/${dateString}`)

        if (response.ok) {
          const data = await response.json()

          // Obtener detalles completos de cada cita
          const appointmentsWithDetails = await Promise.all(
            data.map(async (app: Appointment) => {
              try {
                let mascotaData = null
                let vetData = null

                // Solo obtener detalles si los IDs son válidos
                if (app.mascota_id) {
                  // Obtener detalles de la mascota
                  const mascotaResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/mascotas-crud/${app.mascota_id}`,
                  )
                  if (mascotaResponse.ok) {
                    mascotaData = await mascotaResponse.json()
                  }
                }

                if (app.veterinario_id) {
                  // Obtener detalles del veterinario
                  const vetResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/veterinarios/${app.veterinario_id}`,
                  )
                  if (vetResponse.ok) {
                    vetData = await vetResponse.json()
                  }
                }

                return {
                  ...app,
                  mascota: mascotaData,
                  veterinario: vetData,
                }
              } catch (error) {
                console.error("Error fetching appointment details:", error)
                return {
                  ...app,
                  mascota: null,
                  veterinario: null,
                }
              }
            }),
          )

          console.log("Appointments with details:", appointmentsWithDetails)
          setDateAppointments(appointmentsWithDetails)
        } else {
          if (response.status !== 404) {
            console.error("Error fetching appointments by date:", response.statusText)
          }
          setDateAppointments([])
        }
        setLoadingAppointments(false)
      } catch (error) {
        console.error("Error fetching appointments by date:", error)
        setDateAppointments([])
        setLoadingAppointments(false)
      }
    }

    fetchAppointmentsByDate()
  }, [selectedDate])

  // Actualizar citas del veterinario cuando cambia el veterinario o la fecha
  useEffect(() => {
    console.log("fetchVetAppointments useEffect triggered with veterinarian_id:", appointment.veterinario_id)
    const fetchVetAppointments = async () => {
      // Validate veterinarian ID before fetching
      if (!appointment.veterinario_id) {
        console.warn("Veterinario ID is empty or undefined, skipping fetchVetAppointments")
        return
      }
      if (!selectedDate) {
        console.warn("Selected date is undefined, skipping fetchVetAppointments")
        return
      }

      const vetIdNum = Number(appointment.veterinario_id)
      if (isNaN(vetIdNum)) {
        console.warn(`Veterinario ID is not a valid number: ${appointment.veterinario_id}`)
        return
      }

      try {
        setLoadingAppointments(true)
        const dateString = selectedDate.toISOString().split("T")[0]
        console.log(`Fetching vet appointments for vet ID: ${vetIdNum} on date: ${dateString}`)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/citas/veterinario/${vetIdNum}/fecha/${dateString}`,
        )

        if (response.ok) {
          const data = await response.json()

          // Obtener detalles completos de cada cita
          const appointmentsWithDetails = await Promise.all(
            data.map(async (app: Appointment) => {
              try {
                let mascotaData = null

                // Solo obtener detalles si el ID de mascota es válido
                if (app.mascota_id) {
                  // Obtener detalles de la mascota
                  const mascotaResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/mascotas-crud/${app.mascota_id}`,
                  )
                  if (mascotaResponse.ok) {
                    mascotaData = await mascotaResponse.json()
                  }
                }

                // El veterinario ya lo conocemos
                const vetData = vets.find((v) => v.id === Number(app.veterinario_id)) || null

                return {
                  ...app,
                  mascota: mascotaData,
                  veterinario: vetData,
                }
              } catch (error) {
                console.error("Error fetching appointment details:", error)
                return {
                  ...app,
                  mascota: null,
                  veterinario: null,
                }
              }
            }),
          )

          console.log("Vet appointments with details:", appointmentsWithDetails)
          setVetAppointments(appointmentsWithDetails)
        } else {
          if (response.status !== 404) {
            console.error("Error fetching vet appointments:", response.statusText)
          }
          setVetAppointments([])
        }
        setLoadingAppointments(false)
      } catch (error) {
        console.error("Error fetching vet appointments:", error)
        setVetAppointments([])
        setLoadingAppointments(false)
      }
    }

    if (appointment.veterinario_id) {
      fetchVetAppointments()
      setShowCalendar(true)
    } else {
      setShowCalendar(false)
      setVetAppointments([])
    }

    // Resetear el time slot seleccionado cuando cambia el veterinario
    setSelectedTimeSlot(null)
  }, [appointment.veterinario_id, selectedDate, vets])

  // Filtrar propietarios basados en la búsqueda
  const filteredOwners = useMemo(() => {
    if (!searchQuery.trim()) return owners

    const query = searchQuery.toLowerCase().trim()
    return owners.filter(
      (owner) =>
        owner.nombre?.toLowerCase().includes(query) ||
        owner.email?.toLowerCase().includes(query) ||
        owner.telefono?.includes(query) ||
        owner.direccion?.toLowerCase().includes(query),
    )
  }, [owners, searchQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    console.log(`handleChange called with name: ${name}, value: ${value}`)
    setAppointment((prev) => ({ ...prev, [name]: value }))

    // Reset pet selection when owner changes
    if (name === "propietario_id") {
      setAppointment((prev) => ({ ...prev, mascota_id: "" }))
    }

    // Reset time slot when veterinarian changes
    if (name === "veterinario_id") {
      setSelectedTimeSlot(null)
    }
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDuration(Number(e.target.value))
    // Reset time slot when duration changes
    setSelectedTimeSlot(null)
  }

  // Función para seleccionar una fecha del calendario
  const handleDateSelect = (date: Date) => {
    // No permitir fechas anteriores a hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Crear una nueva instancia de Date para evitar problemas de referencia
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (selectedDate >= today) {
      setSelectedDate(selectedDate)
      setSelectedTimeSlot(null)
      setShowCalendarPicker(false)
    }
  }

  // Función para seleccionar un bloque de tiempo
  const handleTimeSlotSelect = (hour: number, minute: number) => {
    const formattedHour = hour.toString().padStart(2, "0")
    const formattedMinute = minute.toString().padStart(2, "0")
    setSelectedTimeSlot(`${formattedHour}:${formattedMinute}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")

    if (
      !appointment.mascota_id ||
      !appointment.veterinario_id ||
      !selectedTimeSlot ||
      !appointment.motivo ||
      !selectedDuration
    ) {
      setErrorMessage("Por favor, completa todos los campos requeridos.")
      return
    }

    try {
      const [hours, minutes] = selectedTimeSlot.split(":").map(Number)
      const appointmentDate = new Date(selectedDate)
      appointmentDate.setHours(hours, minutes, 0, 0)

      // Verificar que la fecha y hora no sean pasadas
      const now = new Date()
      if (appointmentDate < now) {
        setErrorMessage("No se pueden agendar citas en fechas u horas pasadas.")
        return
      }

      const fechaHora = appointmentDate.toISOString()

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mascota_id: Number.parseInt(appointment.mascota_id),
          veterinario_id: Number.parseInt(appointment.veterinario_id),
          fecha_hora: fechaHora,
          duracion_estimada: selectedDuration,
          motivo: appointment.motivo,
        }),
      })

      if (response.ok) {
        setSuccessMessage("¡Cita agendada exitosamente!")
        setAppointment({
          propietario_id: "",
          mascota_id: "",
          veterinario_id: "",
          motivo: "",
        })
        setSelectedOwner(null)
        setSelectedTimeSlot(null)
        setShowCalendar(false)

        // Actualizar la lista de citas para la fecha seleccionada
        const dateString = selectedDate.toISOString().split("T")[0]
        const updatedAppointmentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/fecha/${dateString}`)
        if (updatedAppointmentsResponse.ok) {
          const updatedAppointmentsData = await updatedAppointmentsResponse.json()
          setDateAppointments(updatedAppointmentsData)
        }
      } else {
        setErrorMessage("Error al agendar la cita: " + response.statusText)
      }
    } catch (error) {
      console.error("Error al agendar la cita:", error)
      setErrorMessage("Error al agendar la cita. Por favor intente nuevamente.")
    }
  }

  const handleSelectOwner = (owner: Owner) => {
    setSelectedOwner(owner)
    setAppointment((prev) => ({
      ...prev,
      propietario_id: owner.id.toString(),
    }))
    setShowOwnerSearch(false)
  }

  const handleClearOwner = () => {
    setSelectedOwner(null)
    setAppointment((prev) => ({
      ...prev,
      propietario_id: "",
      mascota_id: "",
    }))
  }

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Obtener la fecha mínima (hoy) para el selector de fecha
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isToday =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-pink-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-pink-700 mb-6">Agendar Nueva Cita</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {/* Formulario de cita */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Detalles de la Cita</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Propietario <span className="text-red-500">*</span>
                  </label>

                  {selectedOwner ? (
                    <div className="flex items-center p-3 bg-pink-50 border border-pink-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{selectedOwner.nombre}</p>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          {selectedOwner.email && <p>Email: {selectedOwner.email}</p>}
                          {selectedOwner.telefono && <p>Teléfono: {selectedOwner.telefono}</p>}
                          {selectedOwner.direccion && <p>Dirección: {selectedOwner.direccion}</p>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearOwner}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowOwnerSearch(true)}
                        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <span className="text-gray-500">Buscar propietario...</span>
                        <Search className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  )}

                  {showOwnerSearch && (
                    <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg absolute z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Buscar Propietario</h3>
                        <button
                          type="button"
                          onClick={() => setShowOwnerSearch(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar por nombre, email, teléfono..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          />
                          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {filteredOwners.length > 0 ? (
                          <ul className="divide-y divide-gray-100">
                            {filteredOwners.map((owner) => (
                              <li
                                key={owner.id}
                                className="py-2 px-1 hover:bg-pink-50 cursor-pointer rounded-md transition-colors"
                                onClick={() => handleSelectOwner(owner)}
                              >
                                <p className="font-medium text-gray-800">{owner.nombre}</p>
                                <div className="text-sm text-gray-600 mt-1">
                                  {owner.email && <p>Email: {owner.email}</p>}
                                  {owner.telefono && <p>Teléfono: {owner.telefono}</p>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-center py-4 text-gray-500">No se encontraron propietarios</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="mascota_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Mascota <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="mascota_id"
                    name="mascota_id"
                    value={appointment.mascota_id}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                    disabled={!appointment.propietario_id}
                  >
                    <option value="">
                      {appointment.propietario_id
                        ? filteredPets.length > 0
                          ? "Seleccionar mascota"
                          : "No hay mascotas para este propietario"
                        : "Primero seleccione un propietario"}
                    </option>
                    {filteredPets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nombre} - {pet.especie}
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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

                <div className="md:col-span-2">
                  <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de la cita <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="motivo"
                    name="motivo"
                    value={appointment.motivo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                    placeholder="Describa el motivo de la cita"
                    required
                  />
                </div>
              </div>

              {!appointment.veterinario_id && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex items-start">
                  <Info className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                  <p>Seleccione un veterinario para ver su disponibilidad en el calendario.</p>
                </div>
              )}

              {showCalendar && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Seleccione fecha y hora</h3>

                  {/* Selector de fecha con calendario */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de la cita</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCalendarPicker(!showCalendarPicker)}
                        className="w-full md:w-64 flex items-center justify-between p-2 border border-gray-300 rounded-lg hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <span>
                            {isToday ? "Hoy" : ""} {formatDate(selectedDate)}
                          </span>
                        </div>
                        <span className="text-gray-500">{showCalendarPicker ? "▲" : "▼"}</span>
                      </button>

                      {showCalendarPicker && (
                        <div className="absolute z-10 mt-1 w-full md:w-auto">
                          <CalendarPicker selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selector de duración */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duración de la cita</label>
                    <select
                      value={selectedDuration}
                      onChange={handleDurationChange}
                      className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value={1}>30 minutos (1 bloque)</option>
                      <option value={2}>1 hora (2 bloques)</option>
                      <option value={3}>1 hora 30 minutos (3 bloques)</option>
                      <option value={4}>2 horas (4 bloques)</option>
                    </select>
                  </div>

                  {/* Horarios disponibles */}
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">
                      Horarios disponibles para {vets.find((v) => v.id === Number(appointment.veterinario_id))?.nombre}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Seleccione un horario disponible para la cita. Los bloques ocupados o pasados no están
                      disponibles.
                    </p>
                  </div>

                  {loadingAppointments ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-pulse text-pink-600">Cargando horarios disponibles...</div>
                    </div>
                  ) : (
                    <TimeSlotGrid
                      selectedDate={selectedDate}
                      appointments={appointment.veterinario_id ? vetAppointments : dateAppointments}
                      selectedDuration={selectedDuration}
                      selectedTimeSlot={selectedTimeSlot}
                      onTimeSlotSelect={handleTimeSlotSelect}
                    />
                  )}

                  {selectedTimeSlot && (
                    <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg text-pink-800">
                      <p className="font-medium">Horario seleccionado: {selectedTimeSlot}</p>
                      <p>Duración: {selectedDuration * 30} minutos</p>
                      <p>
                        Hora de finalización: {(() => {
                          const [hours, minutes] = selectedTimeSlot.split(":").map(Number)
                          const endTime = new Date(selectedDate)
                          endTime.setHours(hours, minutes, 0, 0)
                          endTime.setMinutes(endTime.getMinutes() + selectedDuration * 30)
                          return `${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center"
                  disabled={!selectedTimeSlot && showCalendar}
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Información</h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center mb-2">
                    <User className="h-5 w-5 text-pink-600 mr-2" />
                    Propietarios
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total de propietarios registrados: <span className="font-medium">{owners.length}</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center mb-2">
                    <PawPrint className="h-5 w-5 text-pink-600 mr-2" />
                    Mascotas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total de mascotas registradas: <span className="font-medium">{pets.length}</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center mb-2">
                    <Stethoscope className="h-5 w-5 text-pink-600 mr-2" />
                    Veterinarios
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total de veterinarios disponibles: <span className="font-medium">{vets.length}</span>
                  </p>
                  {appointment.veterinario_id && (
                    <p className="text-sm text-pink-600 mt-2">
                      Mostrando disponibilidad para:{" "}
                      <span className="font-medium">
                        {vets.find((v) => v.id === Number(appointment.veterinario_id))?.nombre ||
                          "Veterinario seleccionado"}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 flex items-center mb-3">
                  <Clock className="h-5 w-5 text-pink-600 mr-2" />
                  Horarios Disponibles
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Horario de atención: <span className="font-medium">24 horas</span>
                </p>
                <p className="text-sm text-gray-600">
                  Duración estándar de cita: <span className="font-medium">30 minutos</span>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="bg-pink-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-pink-800 flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-pink-600 mr-2" />
                    Recordatorio
                  </h3>
                  <ul className="text-sm text-pink-700 space-y-1 pl-7 list-disc">
                    <li>Verificar disponibilidad del veterinario</li>
                    <li>Confirmar datos de contacto del propietario</li>
                    <li>Recordar al propietario llegar 10 minutos antes</li>
                    <li>Informar sobre cualquier preparación especial</li>
                  </ul>
                </div>
              </div>

              {selectedTimeSlot && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-md font-medium text-green-800 flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      Resumen de Cita
                    </h3>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li>
                        <strong>Fecha:</strong> {formatDate(selectedDate)}
                      </li>
                      <li>
                        <strong>Hora:</strong> {selectedTimeSlot}
                      </li>
                      <li>
                        <strong>Duración:</strong> {selectedDuration * 30} minutos
                      </li>
                      {selectedOwner && (
                        <li>
                          <strong>Propietario:</strong> {selectedOwner.nombre}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgendarCitasView
