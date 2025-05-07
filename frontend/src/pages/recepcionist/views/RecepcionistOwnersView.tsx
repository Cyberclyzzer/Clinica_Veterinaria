"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, Search, User, Mail, Phone, MapPin, PawPrint, ChevronDown, ChevronUp, Plus } from "lucide-react"

interface Owner {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion?: string
}

interface Pet {
  id: number
  nombre: string
  especie: string
  raza: string
  fecha_nacimiento: string
  propietario_id: number
}

const RecepcionistOwnersView: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([])
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [expandedOwner, setExpandedOwner] = useState<number | null>(null)
  const [ownerPets, setOwnerPets] = useState<{ [key: number]: Pet[] }>({})
  const [loadingPets, setLoadingPets] = useState<{ [key: number]: boolean }>({})

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
          owner.telefono.includes(term) ||
          (owner.direccion && owner.direccion.toLowerCase().includes(term.toLowerCase())),
      )
      setFilteredOwners(filtered)
    } else {
      setFilteredOwners(owners)
    }
  }

  const toggleOwnerExpand = async (ownerId: number) => {
    if (expandedOwner === ownerId) {
      setExpandedOwner(null)
      return
    }

    setExpandedOwner(ownerId)

    // Check if we already have the pets for this owner
    if (!ownerPets[ownerId] && !loadingPets[ownerId]) {
      setLoadingPets((prev) => ({ ...prev, [ownerId]: true }))
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/propietario/${ownerId}`)
        const data = await response.json()
        setOwnerPets((prev) => ({ ...prev, [ownerId]: data }))
      } catch (error) {
        console.error(`Error fetching pets for owner ${ownerId}:`, error)
      } finally {
        setLoadingPets((prev) => ({ ...prev, [ownerId]: false }))
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case "perro":
        return "🐕"
      case "gato":
        return "🐈"
      case "ave":
        return "🦜"
      case "conejo":
        return "🐇"
      case "pez":
        return "🐠"
      default:
        return "🐾"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-pink-600">Cargando propietarios...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-pink-700">Propietarios</h1>
        <div className="text-sm text-gray-500">Total: {owners.length} propietarios</div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono o dirección..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      {/* Propietarios List */}
      {filteredOwners.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron propietarios</h3>
          <p className="text-gray-500">
            {searchTerm
              ? "No hay propietarios que coincidan con los criterios de búsqueda."
              : "No hay propietarios registrados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOwners.map((owner) => (
            <div key={owner.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-pink-100 text-pink-600 p-3 rounded-full mr-4">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{owner.nombre}</h3>
                      <div className="mt-1 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {owner.email}
                        </p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {owner.telefono}
                        </p>
                        {owner.direccion && (
                          <p className="flex items-start">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                            {owner.direccion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleOwnerExpand(owner.id)}
                    className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <span className="mr-1">{expandedOwner === owner.id ? "Ocultar mascotas" : "Ver mascotas"}</span>
                    {expandedOwner === owner.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Pets Section */}
                {expandedOwner === owner.id && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-700 flex items-center">
                        <PawPrint className="h-5 w-5 text-pink-600 mr-2" />
                        Mascotas
                      </h4>
                      <button className="text-sm text-pink-600 hover:text-pink-800 flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar mascota
                      </button>
                    </div>

                    {loadingPets[owner.id] ? (
                      <div className="text-center py-4">
                        <div className="animate-pulse text-pink-600">Cargando mascotas...</div>
                      </div>
                    ) : !ownerPets[owner.id] || ownerPets[owner.id].length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p>Este propietario no tiene mascotas registradas</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ownerPets[owner.id].map((pet) => (
                          <div key={pet.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-2">{getSpeciesIcon(pet.especie)}</span>
                              <h5 className="text-lg font-medium text-gray-800">{pet.nombre}</h5>
                            </div>
                            <div className="pl-8 space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Especie:</span> {pet.especie}
                              </p>
                              <p>
                                <span className="font-medium">Raza:</span> {pet.raza}
                              </p>
                              <p>
                                <span className="font-medium">Nacimiento:</span> {formatDate(pet.fecha_nacimiento)}
                              </p>
                            </div>
                            <div className="mt-3 pl-8">
                              <button className="text-sm text-pink-600 hover:text-pink-800">Agendar cita</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecepcionistOwnersView
