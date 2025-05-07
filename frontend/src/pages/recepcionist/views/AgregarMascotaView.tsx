"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PawPrint, User, Search, CheckCircle, AlertCircle, Calendar, ArrowLeft } from "lucide-react"

interface Owner {
  id: number
  nombre: string
  email: string
  telefono: string
}

const AgregarMascotaView: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([])
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const [mascota, setMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
  })

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`)
        const data = await response.json()
        setOwners(data)
        setFilteredOwners(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching owners:", error)
        setLoading(false)
      }
    }

    fetchOwners()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term) {
      const filtered = owners.filter(
        (owner) =>
          owner.nombre.toLowerCase().includes(term.toLowerCase()) ||
          owner.email.toLowerCase().includes(term.toLowerCase()) ||
          owner.telefono.includes(term),
      )
      setFilteredOwners(filtered)
    } else {
      setFilteredOwners(owners)
    }
  }

  const handleSelectOwner = (owner: Owner) => {
    setSelectedOwner(owner)
    // Reset form and messages when changing owner
    setMascota({
      nombre: "",
      especie: "",
      raza: "",
      fecha_nacimiento: "",
    })
    setSuccessMessage("")
    setErrorMessage("")
  }

  const handleBackToOwners = () => {
    setSelectedOwner(null)
    setSearchTerm("")
    setFilteredOwners(owners)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMascota({ ...mascota, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")

    if (!selectedOwner) {
      setErrorMessage("Por favor, seleccione un propietario primero.")
      return
    }

    if (!mascota.nombre || !mascota.especie || !mascota.raza || !mascota.fecha_nacimiento) {
      setErrorMessage("Por favor, complete todos los campos requeridos.")
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-crud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...mascota,
          propietario_id: selectedOwner.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccessMessage(`¡Mascota "${mascota.nombre}" registrada exitosamente para ${selectedOwner.nombre}!`)
        setMascota({
          nombre: "",
          especie: "",
          raza: "",
          fecha_nacimiento: "",
        })
      } else {
        const errorData = await response.json()
        setErrorMessage(`Error al registrar la mascota: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error registering pet:", error)
      setErrorMessage("Error al registrar la mascota. Por favor, intente nuevamente.")
    }
  }

  // Get maximum date (today) for the date input
  const today = new Date().toISOString().split("T")[0]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-pink-600">Cargando propietarios...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        {selectedOwner ? "Agregar Mascota" : "Seleccionar Propietario"}
      </h1>

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

      {!selectedOwner ? (
        // Owner Selection View
        <div>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar propietario por nombre, email o teléfono..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {filteredOwners.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron propietarios</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "No hay propietarios que coincidan con los criterios de búsqueda."
                  : "No hay propietarios registrados en el sistema."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOwners.map((owner) => (
                <div
                  key={owner.id}
                  onClick={() => handleSelectOwner(owner)}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-pink-100 text-pink-600 p-3 rounded-full mr-4">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{owner.nombre}</h3>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium w-20">Email:</span>
                      {owner.email}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium w-20">Teléfono:</span>
                      {owner.telefono}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Pet Registration Form
        <div>
          <button onClick={handleBackToOwners} className="flex items-center text-pink-600 hover:text-pink-800 mb-6">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Volver a selección de propietarios
          </button>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Propietario: {selectedOwner.nombre}</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Mascota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={mascota.nombre}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-1">
                    Especie <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="especie"
                    name="especie"
                    value={mascota.especie}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  >
                    <option value="">Seleccionar especie</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Pez">Pez</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="raza" className="block text-sm font-medium text-gray-700 mb-1">
                    Raza <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="raza"
                    name="raza"
                    value={mascota.raza}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      value={mascota.fecha_nacimiento}
                      onChange={handleInputChange}
                      max={today}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center"
                >
                  <PawPrint className="h-5 w-5 mr-2" />
                  Registrar Mascota
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-start">
            <div className="bg-pink-100 text-pink-600 p-2 rounded-full mr-3 mt-1">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-pink-800 mb-1">Información Importante</h3>
              <p className="text-sm text-pink-700">
                Asegúrese de verificar los datos de la mascota con el propietario antes de registrarla. Es recomendable
                solicitar documentación como cartilla de vacunación o certificado de nacimiento para confirmar la
                información.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgregarMascotaView
