"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  Calendar,
  Clock,
  PawPrint,
  Stethoscope,
  FileText,
  CheckCircle,
  User,
  AlertCircle,
  Search,
  X,
} from "lucide-react"

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

  const [appointment, setAppointment] = useState({
    propietario_id: "",
    mascota_id: "",
    veterinario_id: "",
    date: "",
    time: "",
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
    setAppointment((prev) => ({ ...prev, [name]: value }))

    // Reset pet selection when owner changes
    if (name === "propietario_id") {
      setAppointment((prev) => ({ ...prev, mascota_id: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")

    if (
      !appointment.mascota_id ||
      !appointment.veterinario_id ||
      !appointment.date ||
      !appointment.time ||
      !appointment.motivo
    ) {
      setErrorMessage("Por favor, completa todos los campos requeridos.")
      return
    }

    try {
      const fechaHora = `${appointment.date}T${appointment.time}`
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mascota_id: Number.parseInt(appointment.mascota_id),
          veterinario_id: Number.parseInt(appointment.veterinario_id),
          fecha_hora: fechaHora,
          motivo: appointment.motivo,
        }),
      })

      if (response.ok) {
        setSuccessMessage("¡Cita agendada exitosamente!")
        setAppointment({
          propietario_id: "",
          mascota_id: "",
          veterinario_id: "",
          date: "",
          time: "",
          motivo: "",
        })
        setSelectedOwner(null)
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

  // Get minimum date (today) for the date picker
  const today = new Date().toISOString().split("T")[0]

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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Formulario de Cita</h2>
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
                    min={today}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
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
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 flex items-center mb-3">
                  <Clock className="h-5 w-5 text-pink-600 mr-2" />
                  Horarios Disponibles
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Horario de atención: <span className="font-medium">9:00 AM - 6:00 PM</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgendarCitasView
