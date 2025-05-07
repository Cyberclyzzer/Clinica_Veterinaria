"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { User, Search, Phone, Mail, Edit, Trash2, UserPlus, MapPin } from "lucide-react"

interface Recepcionista {
  id: number
  nombre: string
  email: string
  telefono_contacto: string
  direccion: string
}

const RecepcionistasView: React.FC = () => {
  const [recepcionistas, setRecepcionistas] = useState<Recepcionista[]>([])
  const [filteredRecepcionistas, setFilteredRecepcionistas] = useState<Recepcionista[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchRecepcionistas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recepcionistas`)
        const data = await response.json()
        setRecepcionistas(data)
        setFilteredRecepcionistas(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching recepcionistas:", error)
        setLoading(false)
      }
    }

    fetchRecepcionistas()
  }, [])

  // Maneja el cambio en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term) {
      const filtered = recepcionistas.filter(
        (recep) =>
          recep.nombre.toLowerCase().includes(term.toLowerCase()) ||
          recep.email.toLowerCase().includes(term.toLowerCase()) ||
          (recep.telefono_contacto && recep.telefono_contacto.includes(term)),
      )
      setFilteredRecepcionistas(filtered)
    } else {
      setFilteredRecepcionistas(recepcionistas)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-indigo-600">Cargando recepcionistas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Recepcionistas</h1>
        <button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-4 py-2 rounded-lg flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Añadir Recepcionista
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Recepcionistas List */}
      {filteredRecepcionistas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron recepcionistas</h3>
          <p className="text-gray-500">
            {searchTerm
              ? "No hay recepcionistas que coincidan con los criterios de búsqueda."
              : "No hay recepcionistas registrados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecepcionistas.map((recep) => (
            <div
              key={recep.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-2"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 text-pink-600 p-2 rounded-full mr-3">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{recep.nombre}</h3>
                </div>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    {recep.direccion}
                  </p>
                  {recep.telefono_contacto && (
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {recep.telefono_contacto}
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

export default RecepcionistasView
