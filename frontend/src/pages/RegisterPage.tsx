import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path to redirect to after login (or default to appropriate dashboard)
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios-crud`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
    
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
    
        const data = await response.json();
        console.log('Registro exitoso:', data);
    
        navigate(from, { replace: true });
      } catch (err) {
        console.error('Error durante el registro:', err);
      }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="mx-auto h-12 w-auto text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear una cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your veterinary clinic portal
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email address
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
                Password
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
            
            {error && (
              <div className="text-sm text-error-600 bg-error-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
              >
                Register
              </Button>
            </div>
          </form>

          <div className='text-sm'>
              <Link 
                to="/login" 
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Tienes una cuenta? Inicia sesion
              </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;