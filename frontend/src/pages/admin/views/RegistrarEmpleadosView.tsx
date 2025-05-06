"use client"

import type React from "react"
import { useState } from "react"
import { UserPlus, Stethoscope, Phone, Mail, Calendar, User, Save, X } from "lucide-react"

const RegistrarEmpleadosView: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    rol: "veterinario", // Valor por defecto
    especialidad: "", // Campo adicional para veterinarios
    horario_atencion: "", // Campo adicional para veterinarios
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Primera solicitud: Registrar al usuario
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rol_id: formData.rol === "veterinario" ? 2 : 3, // Asignar 2 para veterinario y 3 para recepcionista
        }),
      })

      if (!userResponse.ok) {
        throw new Error("Error al registrar el usuario")
      }

      const userData = await userResponse.json()
      const usuarioId = userData.usuario.id // Obtén el ID del usuario registrado

      // Segunda solicitud: Registrar al veterinario o recepcionista
      if (formData.rol === "veterinario") {
        const vetResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios-crud`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            especialidad: formData.especialidad,
            telefono_contacto: formData.telefono,
            horario_atencion: formData.horario_atencion,
            usuario_id: usuarioId, // Relación con el usuario registrado
          }),
        })

        if (!vetResponse.ok) {
          throw new Error("Error al registrar el veterinario")
        }
      } else if (formData.rol === "recepcionista") {
        const recepResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/recepcionistas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuarioId, // Relación con el usuario registrado
            telefono: formData.telefono,
          }),
        })

        if (!recepResponse.ok) {
          throw new Error("Error al registrar el recepcionista")
        }
      }

      alert("Empleado registrado exitosamente")
      setFormData({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        rol: "veterinario",
        especialidad: "",
        horario_atencion: "",
      })
    } catch (error) {
      console.error("Error al registrar el empleado:", error)
      alert("Error al registrar el empleado. Por favor, inténtelo de nuevo.")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Registrar Empleados</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Formulario de Registro</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-700 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información de cuenta */}
            <div className="md:col-span-2 bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-violet-700 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Información de Cuenta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tipo de empleado */}
            <div className="md:col-span-2 bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-pink-700 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Tipo de Empleado
              </h3>
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="veterinario">Veterinario</option>
                  <option value="recepcionista">Recepcionista</option>
                </select>
              </div>
            </div>

            {/* Campos adicionales para veterinarios */}
            {formData.rol === "veterinario" && (
              <div className="md:col-span-2 bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-teal-700 mb-4 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Información Profesional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">
                      Especialidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="horario_atencion" className="block text-sm font-medium text-gray-700 mb-1">
                      Horario de Atención <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="horario_atencion"
                        name="horario_atencion"
                        placeholder="Ej: 9:00 AM - 5:00 PM"
                        value={formData.horario_atencion}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  nombre: "",
                  email: "",
                  password: "",
                  telefono: "",
                  rol: "veterinario",
                  especialidad: "",
                  horario_atencion: "",
                })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Registrar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrarEmpleadosView
