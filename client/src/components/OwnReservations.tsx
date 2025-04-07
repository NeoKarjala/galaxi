import { useState, useEffect } from 'react';
import {
  getUserBookingApi,
  deleteBookingApi,
  Booking,
} from '../services/BookingApi';

const OwnReservations = () => {
  const userId = '123'; // Kovakoodattu käyttäjä

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hae varaukset
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookingApi(userId);
      setBookings(Array.isArray(data) ? data : [data]); // Varmistetaan, että saadaan taulukko
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Poista varaus
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Haluatko varmasti poistaa varauksen?')) {
      try {
        await deleteBookingApi(id);
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        alert('Poistaminen epäonnistui');
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Ladataan varauksia...</p>;
  if (error) return <p>Jottain meni pieleen: {error}</p>;

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold mb-4'>Omat varaukset</h1>
      {bookings.length === 0 ? (
        <p>Ei varauksia.</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className='card-body border flex gap-4 flex-col rounded-md shadow p-4'
            >
              <p><strong>Kuvaus:</strong> {booking.description}</p>
              <p><strong>Aika:</strong> {booking.startTime} - {booking.endTime}</p>
              <p><strong>Paikka:</strong> {booking.location}</p>
              <div className='flex gap-2'>
                <button className='btn btn-sm btn-warning'>Muokkaa</button>
                <button
                  className='btn btn-sm btn-error'
                  onClick={() => handleDelete(booking.id)}
                >
                  Poista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnReservations;
