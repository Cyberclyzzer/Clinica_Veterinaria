"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PawPrint, Plus, Calendar, Edit, Trash2, Search, X } from "lucide-react"

interface Pet {
  id: number
  nombre: string
  especie: string
  raza: string
  fecha_nacimiento: string
}

function OwnerPetsView() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [newPet, setNewPet] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
  })
  const userId = sessionStorage.getItem("userId")

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/propietario/${userId}`)
        const data = await response.json()
        setPets(data)
      } catch (error) {
        console.error("Error fetching pets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPet({ ...newPet, [name]: value })
  }

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPet.nombre || !newPet.especie || !newPet.raza || !newPet.fecha_nacimiento) {
      alert("Por favor complete todos los campos")
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-crud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPet,
          propietario_id: userId,
        }),
      })

      if (response.ok) {
        const addedPet = await response.json()
        setPets([...pets, addedPet])
        setNewPet({
          nombre: "",
          especie: "",
          raza: "",
          fecha_nacimiento: "",
        })
        setShowAddForm(false)
      } else {
        alert("Error al agregar mascota")
      }
    } catch (error) {
      console.error("Error adding pet:", error)
    }
  }

  const filteredPets = pets.filter(
    (pet) =>
      pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.raza.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <div className="animate-pulse text-blue-600">Cargando mascotas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 md:mb-0">Mis Mascotas</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          {showAddForm ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Agregar Mascota
            </>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar mascota..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Add Pet Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Agregar Nueva Mascota
          </h2>
          <form onSubmit={handleAddPet} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={newPet.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-1">
                  Especie
                </label>
                <select
                  id="especie"
                  name="especie"
                  value={newPet.especie}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Raza
                </label>
                <input
                  type="text"
                  id="raza"
                  name="raza"
                  value={newPet.raza}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={newPet.fecha_nacimiento}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Mascota
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pets List */}
      {filteredPets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <PawPrint className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No hay mascotas registradas</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No se encontraron mascotas con ese criterio de búsqueda."
              : "Agrega tu primera mascota para comenzar."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Mascota
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getSpeciesIcon(pet.especie)}</span>
                    <h3 className="text-xl font-semibold text-blue-700">{pet.nombre}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <span className="font-medium w-24">Especie:</span>
                    {pet.especie}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-24">Raza:</span>
                    {pet.raza}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-24">Nacimiento:</span>
                    {formatDate(pet.fecha_nacimiento)}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium">
                    <Calendar className="h-4 w-4 mr-1" />
                    Agendar cita
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

export default OwnerPetsView
