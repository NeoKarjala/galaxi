import { useEffect, useState } from 'react';
import { getAllBookingsApi, Booking } from '../services/BookingApi';

const AllReservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookingsApi();
      setBookings(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  if (loading) return <p>Ladataan varauksia...</p>;
  if (error) return <p>Virhe: {error}</p>;

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold mb-4'>Kaikki varaukset (Dev-näkymä)</h1>
      {bookings.length === 0 ? (
        <p>Ei varauksia.</p>
      ) : (
        <div className='grid gap-4'>
          {bookings.map((booking, index) => (
            <div key={index} className='border rounded-md p-4 shadow'>
              <p><strong>ID:</strong> {booking.id}</p>
              <p><strong>Käyttäjä:</strong> {booking.userId}</p>
              <p><strong>Kuvaus:</strong> {booking.description}</p>
              <p><strong>Aika:</strong> {booking.startTime} – {booking.endTime}</p>
              <p><strong>Paikka:</strong> {booking.location}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReservations;
