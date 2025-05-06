import React from 'react'
import { useState, FormEvent } from 'react';
import { Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import petPaw from '../assets/pet-paw.svg'; // Assume this image exists in assets

function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol_id] = useState(4);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        try {
            const signupResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rol_id }),
            });
    
            if (!signupResponse.ok) {
                throw new Error('Error al registrar el usuario');
            }
    
            const signupData = await signupResponse.json();
            const usuario_id = signupData.usuario.id;
    
            const propResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/propietarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, telefono, email, direccion, usuario_id }),
            });
    
            if (!propResponse.ok) {
                throw new Error('Error al registrar el propietario');
            }
    
            const propietarioData = await propResponse.json();
    
            console.log('Registro exitoso:', signupData);
            console.log('Propietario registrado:', propietarioData);
    
            navigate('/login');
        } catch (err) {
            console.error('Error durante el registro:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-green-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
          <img src={petPaw} alt="Pet Paw" className="absolute top-10 right-10 w-32 opacity-20 select-none pointer-events-none" />
          <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-3xl shadow-xl p-10 relative z-10">
            <div className="flex justify-center mb-6">
              <img src={petPaw} className="h-14 w-auto text-blue-700" />
            </div>
            <h2 className="text-center text-4xl font-extrabold text-blue-800 mb-2">
              Crear una cuenta
            </h2>
            <p className="text-center text-md text-green-700 mb-8">
              Accede a tu portal de clínica veterinaria
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre y Apellido
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label 
                  htmlFor="address" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <div className="mt-1">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="address"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label 
                  htmlFor="number" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de Teléfono
                </label>
                <div className="mt-1">
                  <input
                    id="number"
                    name="number"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Registrarse
                </button>
              </div>
            </form>

            <div className='mt-6 text-center text-sm'>
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Tienes una cuenta? Inicia sesión
                </Link>
            </div>
          </div>
        </div>
    )
}

export default RegisterPage
