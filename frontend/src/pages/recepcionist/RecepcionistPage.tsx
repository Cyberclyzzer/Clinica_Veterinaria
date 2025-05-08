"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navigate } from "react-router-dom"
import {
  Users,
  Calendar,
  ClipboardList,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  Phone,
  PawPrint,
  Plus,
} from "lucide-react"

import RecepcionistDashboardView from "./views/RecepcionistDashboardView"
import RecepcionistOwnersView from "./views/RecepcionistOwnersView"
import AgendarCitasView from "./views/AgendarCitasView"
import RecepcionistAppointmentsView from "./views/RecepcionistAppointmentsView"
import AgregarMascotaView from "./views/AgregarMascotaView"

function RecepcionistPage() {
  const [activeView, setActiveView] = useState<"dashboard" | "owners" | "appointments" | "schedule" | "add-pet">(
    "dashboard",
  )
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [recepcionistName, setRecepcionistName] = useState<string>("Recepcionista")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const userId = sessionStorage.getItem("userId")
  const navigate = useNavigate()

  useEffect(() => {
    const verifyUser = async () => {
      if (!userId) {
        setIsAuthorized(false)
        return
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${userId}`)
        if (!response.ok) {
          throw new Error("User verification failed")
        }

        const data = await response.json()

        // Verifica si el rol_id es igual a 3 (recepcionista)
        if (data.rol_id === 3) {
          setIsAuthorized(true)

          // Try to get receptionist name
          try {
            const recepResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/recepcionistas/usuario/${userId}`)
            if (recepResponse.ok) {
              const recepData = await recepResponse.json()
              if (recepData && recepData.nombre) {
                setRecepcionistName(recepData.nombre)
              }
            }
          } catch (error) {
            console.error("Error fetching receptionist data:", error)
          }
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error("Error verifying user:", error)
        setIsAuthorized(false)
      }
    }

    verifyUser()
  }, [userId])

  const handleLogout = () => {
    sessionStorage.removeItem("userId")
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Si no está autorizado, redirige al login
  if (isAuthorized === false) {
    return <Navigate to="/login" />
  }

  // Mientras se verifica la autorización, muestra un mensaje de carga
  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-pink-600">Verificando autorización...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Phone className="h-6 w-6" />
          <span className="font-bold text-xl">PetCare Recepción</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gradient-to-b from-pink-700 via-pink-600 to-purple-600 text-white flex flex-col z-10 shadow-[5px_0_15px_rgba(0,0,0,0.2)]`}
      >
        <div className="p-6 border-b border-pink-500 hidden md:block">
          <div className="flex items-center space-x-2">
            <Phone className="h-6 w-6" />
            <span className="text-2xl font-bold">PetCare</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-pink-500 flex items-center space-x-3">
          <div className="bg-pink-800 rounded-full p-2">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">{recepcionistName}</p>
            <p className="text-xs text-pink-200">Recepcionista</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setActiveView("dashboard")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "dashboard"
                    ? "bg-white text-pink-700 font-medium shadow-md"
                    : "text-white hover:bg-pink-500"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("owners")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "owners"
                    ? "bg-white text-pink-700 font-medium shadow-md"
                    : "text-white hover:bg-pink-500"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Propietarios</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("appointments")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "appointments"
                    ? "bg-white text-pink-700 font-medium shadow-md"
                    : "text-white hover:bg-pink-500"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Citas</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("schedule")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "schedule"
                    ? "bg-white text-pink-700 font-medium shadow-md"
                    : "text-white hover:bg-pink-500"
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                <span>Agendar Cita</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("add-pet")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "add-pet"
                    ? "bg-white text-pink-700 font-medium shadow-md"
                    : "text-white hover:bg-pink-500"
                }`}
              >
                <PawPrint className="h-5 w-5 mr-1" />
                <span>Agregar Mascota</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-pink-500">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-white hover:bg-pink-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {activeView === "dashboard" && <RecepcionistDashboardView setActiveView={setActiveView} />}
          {activeView === "owners" && <RecepcionistOwnersView />}
          {activeView === "appointments" && <RecepcionistAppointmentsView />}
          {activeView === "schedule" && <AgendarCitasView />}
          {activeView === "add-pet" && <AgregarMascotaView />}
        </div>
      </main>
    </div>
  )
}

export default RecepcionistPage
