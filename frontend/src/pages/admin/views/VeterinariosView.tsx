"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { User, Search, Filter, Stethoscope, Phone, Clock, Edit, Trash2 } from "lucide-react"

interface Veterinario {
  id: number
  nombre: string
  especialidad: string
  telefono_contacto: string
  horario_atencion: string
}

const VeterinariosView: React.FC = () => {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([])
  const [filteredVeterinarios, setFilteredVeterinarios] = useState<Veterinario[]>([])
  const [especialidadFilter, setEspecialidadFilter] = useState<string>("") // Estado para la especialidad seleccionada
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchVeterinarios = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios`)
        const data = await response.json()
        setVeterinarios(data)
        setFilteredVeterinarios(data) // Inicialmente, muestra todos los veterinarios
        setLoading(false)
      } catch (error) {
        console.error("Error fetching veterinarios:", error)
        setLoading(false)
      }
    }

    fetchVeterinarios()
  }, [])

  // Maneja el cambio en el filtro de especialidad
  const handleEspecialidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEspecialidad = e.target.value
    setEspecialidadFilter(selectedEspecialidad)
    filterVeterinarios(searchTerm, selectedEspecialidad)
  }

  // Maneja el cambio en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterVeterinarios(term, especialidadFilter)
  }

  // Función para filtrar veterinarios
  const filterVeterinarios = (term: string, especialidad: string) => {
    let filtered = veterinarios

    // Filtrar por término de búsqueda
    if (term) {
      filtered = filtered.filter(
        (vet) => vet.nombre.toLowerCase().includes(term.toLowerCase()) || vet.telefono_contacto.includes(term),
      )
    }

    // Filtrar por especialidad
    if (especialidad) {
      filtered = filtered.filter((vet) => vet.especialidad === especialidad)
    }

    setFilteredVeterinarios(filtered)
  }

  // Obtén las especialidades únicas para el filtro
  const uniqueEspecialidades = Array.from(new Set(veterinarios.map((vet) => vet.especialidad)))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-indigo-600">Cargando veterinarios...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Veterinarios</h1>
        <button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center">
          <User className="h-5 w-5 mr-2" />
          Añadir Veterinario
        </button>
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
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              id="especialidadFilter"
              value={especialidadFilter}
              onChange={handleEspecialidadChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las especialidades</option>
              {uniqueEspecialidades.map((especialidad) => (
                <option key={especialidad} value={especialidad}>
                  {especialidad}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Veterinarios List */}
      {filteredVeterinarios.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron veterinarios</h3>
          <p className="text-gray-500">
            {searchTerm || especialidadFilter
              ? "No hay veterinarios que coincidan con los criterios de búsqueda."
              : "No hay veterinarios registrados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVeterinarios.map((vet) => (
            <div
              key={vet.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-3">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{vet.nombre}</h3>
                    <p className="text-sm text-teal-600 font-medium">{vet.especialidad}</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {vet.telefono_contacto}
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    {vet.horario_atencion}
                  </p>
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

export default VeterinariosView
