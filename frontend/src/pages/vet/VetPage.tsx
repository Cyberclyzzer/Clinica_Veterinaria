"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ClipboardList, FileText, LogOut, User, Menu, X, Stethoscope, Home } from "lucide-react"
import { Navigate } from "react-router-dom"
import VetDashboardView from "./views/VetDashboardView"
import VetAppointmentsView from "./views/VetAppointmentsView"
import VetRegisterConsultationView from "./views/VetRegisterConsultationView"
import VetConsultationsView from "./views/VetConsultationsView"

interface Appointment {
  id: number
  mascota_nombre: string
  propietario_nombre: string
  fecha_hora: string
  motivo: string
}

interface MedicalRecord {
  mascota_id: number
  descripcion: string
  tratamiento: string
  fecha: string
}

interface Consultation {
  id: number
  mascota_nombre: string
  descripcion: string
  tratamiento: string
  fecha: string
}

function VetPage() {
  const userId = sessionStorage.getItem("userId")
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [activeView, setActiveView] = useState<"dashboard" | "citas" | "consultas" | "mis-consultas">("dashboard")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [medicalRecord, setMedicalRecord] = useState<Partial<MedicalRecord>>({
    mascota_id: 0,
    descripcion: "",
    tratamiento: "",
    fecha: "",
  })
  const [vetName, setVetName] = useState<string>("Veterinario")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
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
        if (data.rol_id === 2) {
          setIsAuthorized(true)

          // Fetch vet name
          try {
            const vetResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/veterinarios/${userId}`)
            if (vetResponse.ok) {
              const vetData = await vetResponse.json()
              if (vetData && vetData.nombre) {
                setVetName(vetData.nombre)
              }
            }
          } catch (error) {
            console.error("Error fetching vet data:", error)
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/veterinario/${userId}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setAppointments(data)
        } else {
          console.error("API response for appointments is not an array:", data)
          setAppointments([])
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        setAppointments([])
      }
    }

    if (isAuthorized) {
      fetchAppointments()
    }
  }, [isAuthorized, userId])

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/consultas/veterinario/${userId}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setConsultations(data)
        } else {
          console.error("API response for consultations is not an array:", data)
          setConsultations([])
        }
      } catch (error) {
        console.error("Error fetching consultations:", error)
        setConsultations([])
      }
    }

    if (isAuthorized) {
      fetchConsultations()
    }
  }, [isAuthorized, userId])

  const handleMedicalRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMedicalRecord({ ...medicalRecord, [name]: value })
  }

  const registerMedicalRecord = async () => {
    if (medicalRecord.mascota_id && medicalRecord.descripcion && medicalRecord.tratamiento && medicalRecord.fecha) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/historial-medico`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(medicalRecord),
        })

        if (response.ok) {
          alert("Consulta registrada exitosamente.")
          setMedicalRecord({ mascota_id: 0, descripcion: "", tratamiento: "", fecha: "" })

          // Refresh consultations
          const consultResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/consultas/veterinario/${userId}`)
          const consultData = await consultResponse.json()
          if (Array.isArray(consultData)) {
            setConsultations(consultData)
          }
        } else {
          console.error("Error al registrar la consulta:", response.statusText)
        }
      } catch (error) {
        console.error("Error al registrar la consulta:", error)
      }
    } else {
      alert("Por favor, completa todos los campos antes de registrar la consulta.")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("userId")
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if (isAuthorized === false) {
    return <Navigate to="/login" />
  }

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-blue-600">Verificando autorización...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6" />
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
        } md:block w-full md:w-64 bg-gradient-to-b from-green-700 to-green-600 text-white flex flex-col z-10 shadow-[5px_0_15px_rgba(0,0,0,0.2)]`}
      >
        <div className="p-6 border-b border-green-500 hidden md:block">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6" />
            <span className="text-2xl font-bold">PetCare</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-green-500 flex items-center space-x-3">
          <div className="bg-green-800 rounded-full p-2">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">Dr. {vetName}</p>
            <p className="text-xs text-green-200">Veterinario</p>
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
                    ? "bg-white text-green-700 font-medium shadow-md"
                    : "text-white hover:bg-green-500"
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("citas")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "citas"
                    ? "bg-white text-green-700 font-medium shadow-md"
                    : "text-white hover:bg-green-500"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Citas Pendientes</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("consultas")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "consultas"
                    ? "bg-white text-green-700 font-medium shadow-md"
                    : "text-white hover:bg-green-500"
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                <span>Registrar Consulta</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("mis-consultas")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                  activeView === "mis-consultas"
                    ? "bg-white text-green-700 font-medium shadow-md"
                    : "text-white hover:bg-green-500"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Mis Consultas</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-500">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-white hover:bg-green-500 transition-colors"
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
            <VetDashboardView appointments={appointments} consultations={consultations} setActiveView={setActiveView} />
          )}
          {activeView === "citas" && <VetAppointmentsView appointments={appointments} />}
          {activeView === "consultas" && (
            <VetRegisterConsultationView
              medicalRecord={medicalRecord}
              setMedicalRecord={setMedicalRecord}
              appointments={appointments}
              registerMedicalRecord={registerMedicalRecord}
              handleMedicalRecordChange={handleMedicalRecordChange}
            />
          )}
          {activeView === "mis-consultas" && <VetConsultationsView consultations={consultations} />}
        </div>
      </main>
    </div>
  )
}

export default VetPage
