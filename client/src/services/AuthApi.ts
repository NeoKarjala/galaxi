import axiosInstance from './AxiosInstance';

interface AuthResponse {
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginApi = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email,
      user,
    });
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};
