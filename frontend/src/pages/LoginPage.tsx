import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path to redirect to after login (or default to appropriate dashboard)
  const from = location.state?.from?.pathname || '/';
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
    
        navigate('/owner');

      } catch (err) {
        console.error('Error durante el inicio de sesion:', err);
      }
  };

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="mx-auto h-12 w-auto text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
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
                Sign in
              </Button>
            </div>
          </form>

          <div className='text-sm'>
              <Link 
                to="/register" 
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                No tienes cuenta? Registrate
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;