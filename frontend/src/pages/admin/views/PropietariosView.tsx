"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Users,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  PawPrint,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react"

interface Propietario {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion?: string
}

interface Mascota {
  id: number
  nombre: string
  especie: string
  raza: string
  fecha_nacimiento: string
}

const PropietariosView: React.FC = () => {
  const [propietarios, setPropietarios] = useState<Propietario[]>([])
  const [filteredPropietarios, setFilteredPropietarios] = useState<Propietario[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [expandedOwner, setExpandedOwner] = useState<number | null>(null)
  const [ownerPets, setOwnerPets] = useState<{ [key: number]: Mascota[] }>({})
  const [loadingPets, setLoadingPets] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`)
        const data = await response.json()
        setPropietarios(data)
        setFilteredPropietarios(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching propietarios:", error)
        setLoading(false)
      }
    }

    fetchPropietarios()
  }, [])

  // Maneja el cambio en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term) {
      const filtered = propietarios.filter(
        (owner) =>
          owner.nombre.toLowerCase().includes(term.toLowerCase()) ||
          owner.email.toLowerCase().includes(term.toLowerCase()) ||
          owner.telefono.includes(term) ||
          (owner.direccion && owner.direccion.toLowerCase().includes(term.toLowerCase())),
      )
      setFilteredPropietarios(filtered)
    } else {
      setFilteredPropietarios(propietarios)
    }
  }

  // Función para obtener las mascotas de un propietario
  const fetchOwnerPets = async (ownerId: number) => {
    if (ownerPets[ownerId]) {
      // Ya tenemos las mascotas de este propietario
      return
    }

    setLoadingPets((prev) => ({ ...prev, [ownerId]: true }))

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/propietario/${ownerId}`)
      const data = await response.json()

      setOwnerPets((prev) => ({ ...prev, [ownerId]: data }))
    } catch (error) {
      console.error(`Error fetching pets for owner ${ownerId}:`, error)
      setOwnerPets((prev) => ({ ...prev, [ownerId]: [] }))
    } finally {
      setLoadingPets((prev) => ({ ...prev, [ownerId]: false }))
    }
  }

  // Función para expandir/colapsar la información de un propietario
  const toggleOwnerExpansion = (ownerId: number) => {
    if (expandedOwner === ownerId) {
      setExpandedOwner(null)
    } else {
      setExpandedOwner(ownerId)
      fetchOwnerPets(ownerId)
    }
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Función para obtener el icono de la especie
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
        <div className="animate-pulse text-indigo-600">Cargando propietarios...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Propietarios</h1>
        <div className="text-sm text-gray-500">Total: {propietarios.length} propietarios</div>
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
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Propietarios List */}
      {filteredPropietarios.length === 0 ? (
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
          {filteredPropietarios.map((owner) => (
            <div key={owner.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOwnerExpansion(owner.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{owner.nombre}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {owner.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{owner.telefono}</span>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {expandedOwner === owner.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Owner Details with Pets */}
              {expandedOwner === owner.id && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Información de Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">{owner.telefono}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">{owner.direccion || "No disponible"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-medium text-gray-700">Mascotas</h3>
                    </div>

                    {loadingPets[owner.id] ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-pulse text-indigo-600">Cargando mascotas...</div>
                      </div>
                    ) : ownerPets[owner.id]?.length === 0 ? (
                      <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <PawPrint className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Este propietario no tiene mascotas registradas.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ownerPets[owner.id]?.map((pet) => (
                          <div
                            key={pet.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-1"></div>
                            <div className="p-4">
                              <div className="flex items-center mb-2">
                                <div className="bg-amber-100 text-amber-600 p-1.5 rounded-full mr-2 text-lg">
                                  {getSpeciesIcon(pet.especie)}
                                </div>
                                <div>
                                  <h4 className="text-md font-semibold text-gray-800">{pet.nombre}</h4>
                                  <p className="text-xs text-amber-600 font-medium">
                                    {pet.especie} - {pet.raza}
                                  </p>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 mb-2 flex items-center">
                                <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                Nacimiento: {formatDate(pet.fecha_nacimiento)}
                              </div>
                              <div className="flex justify-end space-x-1 pt-1 border-t border-gray-100">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropietariosView
