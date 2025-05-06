"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home, PawPrint, Calendar, LogOut, User, Menu, X } from "lucide-react"
import OwnerDashboardView from "./views/OwnerDashboardView"
import OwnerPetsView from "./views/OwnerPetsView"
import OwnerAppointmentsView from "./views/OwnerAppointmentsView"

function OwnerPage() {
  const [activeView, setActiveView] = useState<"dashboard" | "pets" | "appointments">("dashboard")
  const [ownerName, setOwnerName] = useState<string>("Propietario")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch owner data
    const fetchOwnerData = async () => {
      const userId = sessionStorage.getItem("userId")
      if (!userId) return

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios/${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.nombre) {
            setOwnerName(data.nombre)
          }
        }
      } catch (error) {
        console.error("Error fetching owner data:", error)
      }
    }

    fetchOwnerData()
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("userId")
    sessionStorage.removeItem("userData")
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PawPrint className="h-6 w-6" />
          <span className="font-bold text-xl">PetCare</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gradient-to-b from-blue-700 to-blue-600 text-white flex flex-col z-10 shadow-[5px_0_15px_rgba(0,0,0,0.2)]`}
      >
        <div className="p-6 border-b border-blue-500 hidden md:block">
          <div className="flex items-center space-x-2">
            <PawPrint className="h-6 w-6" />
            <span className="text-2xl font-bold">PetCare</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-blue-500 flex items-center space-x-3">
          <div className="bg-blue-800 rounded-full p-2">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">{ownerName}</p>
            <p className="text-xs text-blue-200">Propietario</p>
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
                    ? "bg-white text-blue-700 font-medium shadow-md"
                    : "text-white hover:bg-blue-500"
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("pets")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "pets"
                    ? "bg-white text-blue-700 font-medium shadow-md"
                    : "text-white hover:bg-blue-500"
                }`}
              >
                <PawPrint className="h-5 w-5" />
                <span>Mis Mascotas</span>
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
                    ? "bg-white text-blue-700 font-medium shadow-md"
                    : "text-white hover:bg-blue-500"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Citas</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-white hover:bg-blue-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {activeView === "dashboard" && <OwnerDashboardView setActiveView={setActiveView} />}
          {activeView === "pets" && <OwnerPetsView />}
          {activeView === "appointments" && <OwnerAppointmentsView />}
        </div>
      </main>
    </div>
  )
}

export default OwnerPage
