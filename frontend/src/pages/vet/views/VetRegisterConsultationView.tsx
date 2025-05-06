"use client"

import type React from "react"
import { ClipboardList, PawPrint, Calendar, FileText, CheckCircle } from "lucide-react"

interface MedicalRecord {
  mascota_id: number
  descripcion: string
  tratamiento: string
  fecha: string
}

interface Appointment {
  id: number
  mascota_nombre: string
  propietario_nombre: string
  fecha_hora: string
  motivo: string
}

interface VetRegisterConsultationViewProps {
  medicalRecord: Partial<MedicalRecord>
  setMedicalRecord: React.Dispatch<React.SetStateAction<Partial<MedicalRecord>>>
  appointments: Appointment[]
  registerMedicalRecord: () => void
  handleMedicalRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const VetRegisterConsultationView: React.FC<VetRegisterConsultationViewProps> = ({
  medicalRecord,
  setMedicalRecord,
  appointments,
  registerMedicalRecord,
  handleMedicalRecordChange,
}) => {
  // Get today's date in YYYY-MM-DD format for the date input
  const today = new Date().toISOString().split("T")[0]

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6">Registrar Consulta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-green-600 text-white px-6 py-3 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Formulario de Consulta</h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="mascota_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Seleccionar Paciente <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="mascota_id"
                    name="mascota_id"
                    value={medicalRecord.mascota_id || ""}
                    onChange={(e) => setMedicalRecord({ ...medicalRecord, mascota_id: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Seleccionar paciente</option>
                    {appointments.map((appt) => (
                      <option key={appt.id} value={appt.id}>
                        {appt.mascota_nombre} - {appt.propietario_nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Consulta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={medicalRecord.fecha || today}
                    onChange={handleMedicalRecordChange}
                    max={today}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción / Diagnóstico <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={medicalRecord.descripcion || ""}
                    onChange={handleMedicalRecordChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    placeholder="Ingrese el diagnóstico detallado del paciente..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tratamiento" className="block text-sm font-medium text-gray-700 mb-1">
                    Tratamiento <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="tratamiento"
                    name="tratamiento"
                    value={medicalRecord.tratamiento || ""}
                    onChange={handleMedicalRecordChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    placeholder="Detalle el tratamiento recomendado..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={registerMedicalRecord}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Registrar Consulta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Citas Pendientes</h2>
            </div>

            <div className="p-4">
              {appointments.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p>No hay citas pendientes</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setMedicalRecord({ ...medicalRecord, mascota_id: appt.id })}
                    >
                      <div className="flex items-center mb-1">
                        <PawPrint className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium">{appt.mascota_nombre}</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        <p>{appt.propietario_nombre}</p>
                        <p className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(appt.fecha_hora).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-5 mt-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recordatorio
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Completa todos los campos requeridos
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Selecciona al paciente de la lista de citas
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Detalla el diagnóstico y tratamiento con claridad
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Verifica la información antes de registrar
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VetRegisterConsultationView
