import { create } from 'zustand';
import { Pet } from '../types';

// Mock pets data
const mockPets: Pet[] = [
  {
    id: '1',
    nombre: 'Max',
    especie: 'Dog',
    raza: 'Golden Retriever',
    fecha_nacimiento: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    propietario_id: '2',
    photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    nombre: 'Luna',
    especie: 'Cat',
    raza: 'Siamese',
    fecha_nacimiento: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
    propietario_id: '2',
    photo: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=300',
  }
];

interface PetState {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPets: () => Promise<void>;
  fetchPetsByOwner: (ownerId: string) => Promise<Pet[]>;
  fetchPetById: (id: string) => Promise<Pet | undefined>;
  createPet: (pet: Omit<Pet, 'id'>) => Promise<Pet>;
  updatePet: (pet: Pet) => Promise<Pet>;
  deletePet: (id: string) => Promise<void>;
}

const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  loading: false,
  error: null,
  
  fetchPets: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ pets: mockPets, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pets', 
      });
    }
  },
  
  fetchPetsByOwner: async (ownerId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredPets = mockPets.filter(pet => pet.propietario_id === ownerId);
      set({ pets: filteredPets, loading: false });
      return filteredPets;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pets', 
      });
      return [];
    }
  },
  
  fetchPetById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const pet = mockPets.find(pet => pet.id === id);
      set({ loading: false });
      return pet;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pet', 
      });
      return undefined;
    }
  },
  
  createPet: async (petData) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new pet with generated ID
      const newPet: Pet = {
        ...petData,
        id: Math.random().toString(36).substring(2, 11),
      };
      
      // Update both mockPets and state
      mockPets.push(newPet);
      set(state => ({ 
        pets: [...state.pets, newPet],
        loading: false 
      }));
      
      return newPet;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to create pet', 
      });
      throw error;
    }
  },
  
  updatePet: async (updatedPet) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update in mockPets
      const index = mockPets.findIndex(pet => pet.id === updatedPet.id);
      if (index !== -1) {
        mockPets[index] = updatedPet;
      }
      
      // Update state
      set(state => ({
        pets: state.pets.map(pet => 
          pet.id === updatedPet.id ? updatedPet : pet
        ),
        loading: false
      }));
      
      return updatedPet;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to update pet', 
      });
      throw error;
    }
  },
  
  deletePet: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from mockPets
      const index = mockPets.findIndex(pet => pet.id === id);
      if (index !== -1) {
        mockPets.splice(index, 1);
      }
      
      // Update state
      set(state => ({
        pets: state.pets.filter(pet => pet.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete pet', 
      });
      throw error;
    }
  }
}));

export default usePetStore;