import { useState, useEffect } from "react";
import {
  getUserBookingApi,
  deleteBookingApi,
  Booking,
  updateBookingApi,
} from "../services/BookingApi";
import ReservationModal from "./ReservationModal";

const OwnReservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking>(); // Tila muokkausta varten
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [booking, setBooking] = useState<Booking[]>([]);

  // Hae varaukset
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookingApi(); // Haetaan varaukset
      setBookings(Array.isArray(data) ? data : [data]); // Varmistetaan, että saadaan taulukko
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async () => {
    getUserBookingApi()
      .then((resp: Booking[]) => {
        setBookings(resp);
      })
      .catch(() => {
        console.log("get error");
      });
  };

  // Poista varaus
  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      console.log(id);
      await deleteBookingApi(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Poistaminen epäonnistui");
    }
  };

  // Aloita muokkaaminen
  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Päivitä varaus
  const handleEditBooking = (booking: Booking) => {
    setLoading(true);
    console.log("varaus", booking);

    updateBookingApi(booking)
      .then(() => {
        getBookings();
      })
      .catch((error) => {
        setError(error.message); // Asetetaan virheviesti
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [booking]);

  if (loading) return <p>Ladataan varauksia...</p>;
  if (error) return <p>Jottain meni pieleen: {error}</p>;

  return (
    <>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Omat varaukset</h1>
        {bookings.length === 0 ? (
          <p>Ei varauksia.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="card-body border grid grid-cols-2 rounded-md shadow p-4"
              >
                <p>
                  <strong>Kuvaus : </strong> {booking.description}
                </p>
                <div>
                  <p>
                    <strong>Aika : </strong>
                    {new Date(booking.startTime).toLocaleDateString("fi-FI")}
                  </p>
                  <p>
                    <strong>Klo : </strong>
                    {new Date(booking.startTime).toLocaleTimeString("fi-FI", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    -
                    {new Date(booking.endTime).toLocaleTimeString("fi-FI", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Tietokone : </strong>
                    {booking.computerId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(booking)}
                  >
                    Muokkaa
                  </button>
                  <button
                    className="btn btn-sm btn-error"
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
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleEditBooking}
        mode={"edit"}
        initialData={editingBooking}
      />
    </>
  );
};

export default OwnReservations;
