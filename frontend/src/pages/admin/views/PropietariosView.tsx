"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, Search, User, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react"

interface Propietario {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion?: string
}

const PropietariosView: React.FC = () => {
  const [propietarios, setPropietarios] = useState<Propietario[]>([])
  const [filteredPropietarios, setFilteredPropietarios] = useState<Propietario[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Dirección
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPropietarios.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{owner.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {owner.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {owner.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {owner.direccion || "No disponible"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropietariosView
