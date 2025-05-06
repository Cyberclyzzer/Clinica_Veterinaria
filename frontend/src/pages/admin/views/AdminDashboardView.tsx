"use client"

import type React from "react"
import {
  User,
  Users,
  PawPrint,
  UserPlus,
  BarChart3,
  Activity,
  ChevronRight,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"

interface AdminDashboardViewProps {
  vetCount: number
  receptionistCount: number
  ownerCount: number
  petCount: number
  setActiveView: (
    view: "dashboard" | "veterinarios" | "recepcionistas" | "propietarios" | "mascotas" | "registrar",
  ) => void
}

interface StatCard {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
  onClick: () => void
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  vetCount,
  receptionistCount,
  ownerCount,
  petCount,
  setActiveView,
}) => {
  const [recentVets, setRecentVets] = useState<any[]>([])
  const [recentOwners, setRecentOwners] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        // Fetch recent veterinarians
        const vetsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios`)
        const vetsData = await vetsResponse.json()
        if (Array.isArray(vetsData)) {
          setRecentVets(vetsData.slice(0, 3))
        }

        // Fetch recent owners
        const ownersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`)
        const ownersData = await ownersResponse.json()
        if (Array.isArray(ownersData)) {
          setRecentOwners(ownersData.slice(0, 3))
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching recent data:", error)
        setLoading(false)
      }
    }

    fetchRecentData()
  }, [])

  const stats: StatCard[] = [
    {
      title: "Veterinarios",
      value: vetCount,
      icon: <User className="h-6 w-6" />,
      color: "text-teal-600",
      bgColor: "bg-teal-600",
      onClick: () => setActiveView("veterinarios"),
    },
    {
      title: "Recepcionistas",
      value: receptionistCount,
      icon: <User className="h-6 w-6" />,
      color: "text-pink-600",
      bgColor: "bg-pink-600",
      onClick: () => setActiveView("recepcionistas"),
    },
    {
      title: "Propietarios",
      value: ownerCount,
      icon: <Users className="h-6 w-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-600",
      onClick: () => setActiveView("propietarios"),
    },
    {
      title: "Mascotas",
      value: petCount,
      icon: <PawPrint className="h-6 w-6" />,
      color: "text-amber-600",
      bgColor: "bg-amber-600",
      onClick: () => setActiveView("mascotas"),
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-indigo-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-700">Dashboard Administrativo</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`bg-gradient-to-br from-${stat.color.split("-")[1]}-50 to-${
              stat.color.split("-")[1]
            }-100 rounded-xl shadow-md p-6 flex items-center cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <div className={`${stat.bgColor} text-white p-3 rounded-lg mr-4`}>{stat.icon}</div>
            <div>
              <p className={`text-sm ${stat.color} font-medium`}>{stat.title}</p>
              <p className={`text-2xl font-bold text-${stat.color.split("-")[1]}-900`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Resumen del Sistema</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
                <h3 className="text-lg font-medium text-indigo-700 mb-3 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Distribución de Personal
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Veterinarios</span>
                      <span>{vetCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${(vetCount / (vetCount + receptionistCount)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Recepcionistas</span>
                      <span>{receptionistCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ width: `${(receptionistCount / (vetCount + receptionistCount)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4">
                <h3 className="text-lg font-medium text-violet-700 mb-3 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Usuarios del Sistema
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Propietarios</span>
                      <span>{ownerCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(ownerCount / (ownerCount + petCount)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Mascotas</span>
                      <span>{petCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={{ width: `${(petCount / (ownerCount + petCount)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">Veterinarios Recientes</h3>
              <div className="space-y-3">
                {recentVets.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No hay veterinarios registrados</p>
                ) : (
                  recentVets.map((vet, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-3">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{vet.nombre}</p>
                          <p className="text-sm text-gray-500">{vet.especialidad}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveView("veterinarios")}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Owners */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Propietarios Recientes</h2>
            </div>
            <button
              onClick={() => setActiveView("propietarios")}
              className="text-xs bg-white text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-50 transition-colors"
            >
              Ver todos
            </button>
          </div>

          <div className="p-4">
            {recentOwners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg font-medium text-gray-600 mb-1">No hay propietarios registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOwners.map((owner, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <p className="font-medium">{owner.nombre}</p>
                    </div>
                    <div className="space-y-2 pl-11 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {owner.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {owner.telefono}
                      </p>
                      {owner.direccion && (
                        <p className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                          {owner.direccion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Acciones Rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveView("registrar")}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <UserPlus className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Registrar Usuario</h3>
            <p className="text-sm text-violet-100">Añadir nuevo personal a la clínica</p>
          </div>

          <div
            onClick={() => setActiveView("veterinarios")}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <User className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Gestionar Veterinarios</h3>
            <p className="text-sm text-teal-100">Ver y administrar veterinarios</p>
          </div>

          <div
            onClick={() => setActiveView("mascotas")}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
          >
            <PawPrint className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Gestionar Mascotas</h3>
            <p className="text-sm text-amber-100">Ver y administrar mascotas registradas</p>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4 flex items-start">
        <div className="bg-pink-100 text-pink-600 p-2 rounded-full mr-3 mt-1">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-pink-800 mb-1">Información del Sistema</h3>
          <p className="text-sm text-pink-700">
            Bienvenido al panel de administración. Desde aquí puedes gestionar todos los aspectos de la clínica
            veterinaria, incluyendo personal, propietarios y mascotas. Si necesitas ayuda, contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardView
