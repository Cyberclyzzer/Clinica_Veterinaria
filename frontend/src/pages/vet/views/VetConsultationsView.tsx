"use client"

import type React from "react"
import { FileText, PawPrint, Calendar, Search, Filter } from "lucide-react"
import { useState } from "react"

interface Consultation {
  id: number
  mascota: string
  descripcion: string
  tratamiento: string
  fecha: string
}

interface VetConsultationsViewProps {
  consultations: Consultation[]
}

const VetConsultationsView: React.FC<VetConsultationsViewProps> = ({ consultations }) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterDate, setFilterDate] = useState<string>("")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Filter consultations based on search term and date
  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.tratamiento.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = filterDate ? consultation.fecha.includes(filterDate) : true

    return matchesSearch && matchesDate
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6">Mis Consultas</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por paciente o tratamiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-600 text-white p-3 rounded-lg mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">Total Consultas</p>
            <p className="text-2xl font-bold text-green-900">{consultations.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
            <PawPrint className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Pacientes Atendidos</p>
            <p className="text-2xl font-bold text-blue-900">
              {new Set(consultations.map((c) => c.mascota)).size}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-600 text-white p-3 rounded-lg mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">Última Consulta</p>
            <p className="text-lg font-bold text-green-900">
              {consultations.length > 0
                ? formatDate(
                    consultations.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].fecha,
                  )
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      {filteredConsultations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No hay consultas registradas</h3>
          <p className="text-gray-500">
            {searchTerm || filterDate
              ? "No se encontraron consultas con los filtros aplicados."
              : "Aún no has registrado ninguna consulta."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-2"></div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <PawPrint className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-lg font-semibold text-green-700">{consultation.mascota}</span>
                      <span className="ml-2 text-sm bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                        {formatDate(consultation.fecha)}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Diagnóstico:</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{consultation.descripcion}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Tratamiento:</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{consultation.tratamiento}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VetConsultationsView
