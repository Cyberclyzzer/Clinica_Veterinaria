"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { Users, UserPlus, LogOut, Menu, X, LayoutDashboard, Shield, UserCog, Stethoscope, Monitor } from "lucide-react"

import VeterinariosView from "./views/VeterinariosView"
import RecepcionistasView from "./views/RecepcionistasView"
import PropietariosView from "./views/PropietariosView"
import RegistrarEmpleadosView from "./views/RegistrarEmpleadosView"
import AdminDashboardView from "./views/AdminDashboardView"

const AdminPage: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "dashboard" | "veterinarios" | "recepcionistas" | "propietarios" | "registrar"
  >("dashboard")
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [adminName, setAdminName] = useState<string>("Administrador")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [vetCount, setVetCount] = useState<number>(0)
  const [receptionistCount, setReceptionistCount] = useState<number>(0)
  const [ownerCount, setOwnerCount] = useState<number>(0)

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

        // Verifica si el rol_id es igual a 1 (administrador)
        if (data.rol_id === 1) {
          setIsAuthorized(true)

          // Try to get admin name
          /*try {
            const adminResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/administradores/usuario/${userId}`)
            if (adminResponse.ok) {
              const adminData = await adminResponse.json()
              if (adminData && adminData.nombre) {
                setAdminName(adminData.nombre)
              }
            }
          } catch (error) {
            console.error("Error fetching admin data:", error)
          }*/
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

  // Fetch counts for dashboard
  useEffect(() => {
    const fetchCounts = async () => {
      if (!isAuthorized) return

      try {
        // Fetch veterinarians count
        const vetsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios`)
        const vetsData = await vetsResponse.json()
        if (Array.isArray(vetsData)) {
          setVetCount(vetsData.length)
        }

        // Fetch receptionists count
        const recepResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/recepcionistas`)
        const recepData = await recepResponse.json()
        if (Array.isArray(recepData)) {
          setReceptionistCount(recepData.length)
        }

        // Fetch owners count
        const ownersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`)
        const ownersData = await ownersResponse.json()
        if (Array.isArray(ownersData)) {
          setOwnerCount(ownersData.length)
        }
      } catch (error) {
        console.error("Error fetching counts:", error)
      }
    }

    fetchCounts()
  }, [isAuthorized])

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
        <div className="animate-pulse text-indigo-600">Verificando autorización...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="font-bold text-xl">PetCare Admin</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gradient-to-b from-indigo-700 via-indigo-600 to-violet-600 text-white flex flex-col z-10 shadow-[5px_0_15px_rgba(0,0,0,0.2)]`}
      >
        <div className="p-6 border-b border-indigo-500 hidden md:block">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="text-2xl font-bold">PetCare Admin</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-indigo-500 flex items-center space-x-3">
          <div className="bg-indigo-800 rounded-full p-2">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">{adminName}</p>
            <p className="text-xs text-indigo-200">Administrador</p>
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
                    ? "bg-white text-indigo-700 font-medium shadow-md"
                    : "text-white hover:bg-indigo-500"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("veterinarios")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "veterinarios"
                    ? "bg-white text-indigo-700 font-medium shadow-md"
                    : "text-white hover:bg-indigo-500"
                }`}
              >
                <Stethoscope className="h-5 w-5" />
                <span>Veterinarios</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("recepcionistas")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "recepcionistas"
                    ? "bg-white text-indigo-700 font-medium shadow-md"
                    : "text-white hover:bg-indigo-500"
                }`}
              >
                <Monitor className="h-5 w-5" />
                <span>Recepcionistas</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("propietarios")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "propietarios"
                    ? "bg-white text-indigo-700 font-medium shadow-md"
                    : "text-white hover:bg-indigo-500"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Propietarios</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("registrar")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "registrar"
                    ? "bg-white text-indigo-700 font-medium shadow-md"
                    : "text-white hover:bg-indigo-500"
                }`}
              >
                <UserPlus className="h-5 w-5" />
                <span>Registrar Usuarios</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-500">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-white hover:bg-indigo-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {activeView === "dashboard" && (
            <AdminDashboardView
              vetCount={vetCount}
              receptionistCount={receptionistCount}
              ownerCount={ownerCount}
              setActiveView={setActiveView}
            />
          )}
          {activeView === "veterinarios" && <VeterinariosView />}
          {activeView === "recepcionistas" && <RecepcionistasView />}
          {activeView === "propietarios" && <PropietariosView />}
          {activeView === "registrar" && <RegistrarEmpleadosView />}
        </div>
      </main>
    </div>
  )
}

export default AdminPage
