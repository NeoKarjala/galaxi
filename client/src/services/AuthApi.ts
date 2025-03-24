import axios from 'axios';

// Määritellään palautettavan vastauksen tyyppi
interface AuthResponse {
  token: string;
  role: string;
}

// Luo axios-instanssi
const apiClient = axios.create({
  baseURL: 'http://localhost:5141/api', // Perus-URL API:lle
  timeout: 5000, // Aikakatkaisu 5 sekuntia
});

// Kirjautumistoiminto
export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Käytetään aiemmin luotua apiClient-instanssia
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    
    // Säilytä token ja rooli localStorageen
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Rekisteröintitoiminto
export const registerApi = async (email: string, password: string, role?: string): Promise<string> => {
  try {
    const user = {
      email,
      password,
      role, // Rooli voidaan määritellä rekisteröinnissä
    };

    // Käytetään apiClient-instanssia
    const response = await apiClient.post<string>('/auth/register', user);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};
