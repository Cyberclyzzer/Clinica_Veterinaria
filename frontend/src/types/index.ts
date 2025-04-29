// User related types
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  OWNER = 'owner',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface StaffMember extends User {
  position: string;
  specialization?: string;
}

export interface PetOwner extends User {
  phone: string;
  address?: string;
  pets: Pet[];
}

// Pet related types
export interface Pet {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  fecha_nacimiento: Date;
  propietario_id: string;
  photo?: string;
}

export interface MedicalRecord {
  id: string;
  date: Date;
  description: string;
  veterinarianId: string;
}

// Appointment related types

export interface Appointment {
  id: string;
  fecha: Date;
  hora: string;
  mascota_id: string;
  veterinario_id: string;
  motivo: string;
}

// Treatment related types
export interface Treatment {
  id: string;
  descripcion: string;
  costo: number;
}

// Relación entre citas y tratamientos
export interface CitaTratamiento {
  id: string; // PK generado automáticamente
  cita_id: string; // FK id de la cita finalizada
  tratamiento_id: string; // FK tratamiento que se realizó
  cantidad: number; // Cantidad de veces que se aplicó el tratamiento
  subtotal: number; // Cantidad por el precio del tratamiento
}

// Estado de pagos
export enum EstadoPago {
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

// Método de pago
export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
}

// Pagos
export interface Pago {
  id: string;
  cita_id: string;
  monto_total: number;
  fecha_pago: Date;
  metodo: MetodoPago;
  estado: EstadoPago;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}