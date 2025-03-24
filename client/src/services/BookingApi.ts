import axios, { AxiosError, AxiosResponse } from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5141/api',
    timeout: 5000,
});

export interface Booking {
    id?: string;
    userId: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
}

// Hakee kaikki varaukset
export const getAllBookingsApi = async () => {
    try {
        const response = await apiClient.get<Booking[]>('/booking');
        return response.data.map(booking => ({ id: booking.id, status: 'Varattu' }));
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};

// Hakee varaukset käyttäjän ID:n perusteella
export const getUserBookingApi = async (id: string) => {
    try {
        const response = await apiClient.get<Booking>(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};

//Luo uuden varauksen
export const createBookingApi = async (booking: Booking) => {
    try {
        const response: AxiosResponse = await apiClient.post('/bookings', booking);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};

// Päivittää olemassa olevan varauksen
export const updateBookingApi = async (id: string, updatedBooking: Booking) => {
    try {
        const response = await apiClient.put(`/bookings/${id}`, updatedBooking);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};

// Poistaa varauksen
export const deleteBookingApi = async (id: string) => {
    try {
        const response = await apiClient.delete(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        throw new Error(`Error fetching message: ${err.response?.data}`);
    }
};
