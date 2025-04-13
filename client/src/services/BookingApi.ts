import axios, { AxiosError } from 'axios';
import { addAuthorizationHeader, getToken, isAdmin } from '../utils/jwtUtils';

const apiClient = axios.create({
    baseURL: 'http://localhost:5141/api',
    timeout: 5000,
});

export interface Booking {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
    computerId?: number;
    isRoomBooking?: boolean;
  roomBookingType?: "private" | "public";
}

// Hakee kaikki varaukset
export const getAllBookingsApi = async () => {
    try {
        const token = getToken(); // Haetaan token utiliteetista
        
        // Lisätään Authorization-header
        const headers = addAuthorizationHeader(token);
        
        // Tarkistetaan onko käyttäjä admin
        if (!isAdmin(token)) {
            throw new Error('Sinulla ei ole oikeuksia nähdä kaikkia varauksia.');
        }

        // API-pyyntö varauksille
        const response = await apiClient.get<Booking[]>('/bookings', { headers });

        return response.data; // Palautetaan varaukset
    } catch (error) {
        throw new Error((error as Error).message); // Virheiden käsittely
    }
};

// Hakee varaukset käyttäjän ID:n perusteella käyttäen JWT tokenia
export const getUserBookingApi = async () => {
    const token = localStorage.getItem('jwtToken'); // Haetaan token localStoragesta

    if (!token) {
        throw new Error('User is not authenticated');
    }

    try {
        const response = await apiClient.get<Booking[]>('/me/bookings', {
            headers: {
                Authorization: `Bearer ${token}`, // Token lähetetään Authorization-headerissä
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};

// Luo uuden varauksen
export const createBookingApi = async (newBooking: Booking): Promise<void> => {
    console.log("apiCreate", newBooking);
    
    const token = localStorage.getItem("jwtToken");
    const response = await apiClient.post('/me/bookings', newBooking, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    
    return response.data;
  };

// Päivittää olemassa olevan varauksen
export const updateBookingApi = async (updatedBooking: Booking): Promise<Booking> => {
    try {
        console.log("api", updatedBooking);
        
        const token = localStorage.getItem("jwtToken");
        const response = await apiClient.put(`/me/bookings/${updatedBooking.id}`, updatedBooking, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};

// Poistaa varauksen
export const deleteBookingApi = async (id: string): Promise<void> => {
    try {
      console.log("api", id);
      const token = localStorage.getItem("jwtToken");
  
      const response = await apiClient.delete(`/me/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      throw new Error(`Error fetching message: ${err.response?.data}`);
    }
  };
  
