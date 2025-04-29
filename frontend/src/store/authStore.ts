import { create } from 'zustand';
import { User, UserRole, AuthState } from '../types';

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'staff@example.com',
    role: UserRole.STAFF,
    position: 'Veterinarian',
    specialization: 'Small Animals',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'owner@example.com',
    role: UserRole.OWNER,
    phone: '555-123-4567',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    position: 'Clinic Manager',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email (in a real app, we'd verify password too)
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Simulate JWT token
      const token = `mock-jwt-token-${user.id}`;
      
      // Store in localStorage (for persistence)
      localStorage.setItem('auth_token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Authentication failed', 
      });
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null,
    });
  },
  
  fetchUser: async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return;
    }
    
    set({ loading: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Extract user id from token (in a real app, we'd decode JWT)
      const userId = token.split('-').pop();
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user', 
      });
      
      // Clear invalid auth data
      localStorage.removeItem('auth_token');
    }
  },
}));

export default useAuthStore;