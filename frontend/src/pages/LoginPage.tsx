import React from 'react'
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import petPaw from '../assets/pet-paw.svg'; // Assume this image exists in assets

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
        
            if (!response.ok) {
              throw new Error('Error al iniciar sesion');
            }
        
            const data = await response.json();
            console.log('Inicio de sesion exitoso:', data);
            
            if (data.usuario.rol_id === 1) {
              sessionStorage.setItem('userId', data.usuario.id);
              sessionStorage.setItem('userData', data.usuario);
              navigate('/admin')
            }
            if (data.usuario.rol_id === 2) {
              sessionStorage.setItem('userId', data.usuario.id);
              sessionStorage.setItem('userData', data.usuario);
              navigate('/vet')
            }
            if (data.usuario.rol_id === 4) {
              sessionStorage.setItem('userId', data.usuario.id);
              sessionStorage.setItem('userData', data.usuario);
              navigate('/owner');
            }
    
          } catch (err) {
            console.error('Error durante el inicio de sesion:', err);
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
          Inicia sesión en tu cuenta
        </h2>
        <p className="text-center text-md text-green-700 mb-8">
          Accede a tu portal de clínica veterinaria
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label 
                htmlFor="remember-me" 
                className="ml-2 block text-sm text-gray-900"
              >
                Recuérdame
              </label>
            </div>
            
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className='mt-6 text-center text-sm'>
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
