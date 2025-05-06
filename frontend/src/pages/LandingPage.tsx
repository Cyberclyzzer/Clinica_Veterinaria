import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 py-12">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row items-center overflow-hidden">
        <div className="md:w-1/2 p-10">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 leading-tight tracking-wide">
            Bienvenido a <span className="text-green-600">PetCare</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Gestiona tus citas, consultas y más con nuestra plataforma diseñada para ti y tus mascotas.
          </p>
          <p className="text-md text-green-600 font-semibold mb-8">
            Tu aliado confiable para el cuidado de tus mascotas.
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <Link to="/login" aria-label="Iniciar sesión en PetCare">
              <button className="btn btn-primary flex items-center justify-center px-8 py-3 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                <LogIn className="h-6 w-6 mr-3" />
                Iniciar Sesión
              </button>
            </Link>
            <Link to="/register" aria-label="Registrarse en PetCare">
              <button className="btn btn-accent flex items-center justify-center px-8 py-3 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                <UserPlus className="h-6 w-6 mr-3" />
                Registrarse
              </button>
            </Link>
          </div>
        </div>
      </div>
      <footer className="mt-12 text-white text-sm">
        © {new Date().getFullYear()} PetCare. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default LandingPage;
