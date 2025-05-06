"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { PawPrint, Search, Filter, Calendar, User, Edit, Trash2 } from "lucide-react"

interface Pet {
  id: number
  nombre: string
  especie: string
  raza: string
  fecha_nacimiento: string
  propietario_nombre?: string
}

const MascotasView: React.FC = () => {
  const [mascotas, setMascotas] = useState<Pet[]>([])
  const [filteredMascotas, setFilteredMascotas] = useState<Pet[]>([])
  const [especieFilter, setEspecieFilter] = useState<string>("") // Estado para la especie seleccionada
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-crud`)
        const data = await response.json()

        // Try to get owner names for each pet
        const mascotasWithOwners = await Promise.all(
          data.map(async (pet: Pet) => {
            try {
              const ownerResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios/mascota/${pet.id}`)
              if (ownerResponse.ok) {
                const ownerData = await ownerResponse.json()
                return { ...pet, propietario_nombre: ownerData.nombre }
              }
              return pet
            } catch (error) {
              return pet
            }
          }),
        )

        setMascotas(mascotasWithOwners)
        setFilteredMascotas(mascotasWithOwners)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching mascotas:", error)
        setLoading(false)
      }
    }

    fetchMascotas()
  }, [])

  // Maneja el cambio en el filtro de especie
  const handleEspecieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEspecie = e.target.value
    setEspecieFilter(selectedEspecie)
    filterMascotas(searchTerm, selectedEspecie)
  }

  // Maneja el cambio en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterMascotas(term, especieFilter)
  }

  // Función para filtrar mascotas
  const filterMascotas = (term: string, especie: string) => {
    let filtered = mascotas

    // Filtrar por término de búsqueda
    if (term) {
      filtered = filtered.filter(
        (pet) =>
          pet.nombre.toLowerCase().includes(term.toLowerCase()) ||
          pet.raza.toLowerCase().includes(term.toLowerCase()) ||
          (pet.propietario_nombre && pet.propietario_nombre.toLowerCase().includes(term.toLowerCase())),
      )
    }

    // Filtrar por especie
    if (especie) {
      filtered = filtered.filter((pet) => pet.especie === especie)
    }

    setFilteredMascotas(filtered)
  }

  // Obtén las especies únicas para el filtro
  const uniqueEspecies = Array.from(new Set(mascotas.map((pet) => pet.especie)))

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
        <div className="animate-pulse text-indigo-600">Cargando mascotas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Mascotas</h1>
        <div className="text-sm text-gray-500">Total: {mascotas.length} mascotas</div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, raza o propietario..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              id="especieFilter"
              value={especieFilter}
              onChange={handleEspecieChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las especies</option>
              {uniqueEspecies.map((especie) => (
                <option key={especie} value={especie}>
                  {especie}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mascotas List */}
      {filteredMascotas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <PawPrint className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron mascotas</h3>
          <p className="text-gray-500">
            {searchTerm || especieFilter
              ? "No hay mascotas que coincidan con los criterios de búsqueda."
              : "No hay mascotas registradas en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMascotas.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-full mr-3 text-xl">
                    {getSpeciesIcon(pet.especie)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{pet.nombre}</h3>
                    <p className="text-sm text-amber-600 font-medium">
                      {pet.especie} - {pet.raza}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    Nacimiento: {formatDate(pet.fecha_nacimiento)}
                  </p>
                  {pet.propietario_nombre && (
                    <p className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      Propietario: {pet.propietario_nombre}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MascotasView
