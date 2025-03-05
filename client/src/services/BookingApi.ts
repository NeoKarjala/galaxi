import axios from 'axios';

const API_URL = 'http://localhost:5141/api/bookings'; 

export interface Booking {
    id?: string;
    userId: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
}

export const getAllBookings = async () => {
    try {
        const response = await axios.get<Booking[]>(API_URL);
        return response.data.map(booking => ({ id: booking.id, status: 'Varattu' }));
    } catch (error) {
        console.error('Error fetching bookings', error);
        throw error;
    }
};

export const getUserBooking = async (id: string) => {
    try {
        const response = await axios.get<Booking>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user booking', error);
        throw error;
    }
};

export const createBooking = async (booking: Booking) => {
    try {
        const response = await axios.post(API_URL, booking);
        return response.data;
    } catch (error) {
        console.error('Error creating booking', error);
        throw error;
    }
};

export const updateBooking = async (id: string, updatedBooking: Booking) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedBooking);
        return response.data;
    } catch (error) {
        console.error('Error updating booking', error);
        throw error;
    }
};

export const deleteBooking = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting booking', error);
        throw error;
    }
};
