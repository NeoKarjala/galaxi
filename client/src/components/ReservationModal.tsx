import { useState, useEffect } from "react";
import { Booking } from "../services/BookingApi";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: string | null;
  // onSubmit: (bookingData: Booking) => Promise<void>;
  onCreateBooking: (newBooking: Booking) => void;
}

const ReservationModal = ({
  isOpen,
  onClose,
  selectedSlot,
  // onSubmit,
  onCreateBooking,
}: ReservationModalProps) => {
  const [bookingData, setBookingData] = useState<Booking>({
    id: "",
    description: "",
    startTime: "",
    endTime: "",
    computerId: 0,
    isRoomBooking: false,
    roomBookingType: "public",
  });

  // Päivitetään lomaketiedot, kun käyttäjä valitsee ajan
  useEffect(() => {
    if (selectedSlot) {
      const [day, time] = selectedSlot.split("-");

      // Muutetaan viikonpäivä (Ma, Ti, ...) oikeaksi päivämääräksi
      const days = ["Ma", "Ti", "Ke", "To", "Pe"];
      const dayIndex = days.indexOf(day);

      const today = new Date();
      const currentWeekMonday = new Date(today);
      currentWeekMonday.setDate(today.getDate() - today.getDay() + 1); // maanantai

      const bookingDate = new Date(currentWeekMonday);
      bookingDate.setDate(currentWeekMonday.getDate() + dayIndex);

      const [hour, minute] = time.split(".");
      bookingDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

      const isoStartTime = bookingDate.toISOString();
      console.log("Asetettu startTime:", isoStartTime);
      setBookingData((prev) => ({
        ...prev,
        startTime: isoStartTime,
      }));
    }
  }, [selectedSlot]);

  // Lomakekenttien käsittely
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Lomakkeen lähetys
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBooking(bookingData);
    onClose();
  };

  if (!isOpen) return null; // Piilota modal, jos se ei ole auki

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="font-bold text-xl mb-4">Tee varaus</h2>
        <form onSubmit={handleSubmit}>
          {/* Päivämäärä ja aika (lukittu) */}

          <div className="form-control mb-4">
            <label className="label">Aloitusaika:</label>
            <input
              type="text"
              name="time"
              value={new Date(bookingData.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              readOnly
              className="input input-bordered"
            />
          </div>

          {/* Päättymisaika (syötettävä ja tallennettava) */}
          <div className="form-control mb-4">
            <label className="label">Päättymisaika:</label>
            <select
              name="endTime"
              value={
                bookingData.endTime
                  ? (() => {
                      const date = new Date(bookingData.endTime);
                      const hours = date.getHours().toString().padStart(2, "0");
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");
                      return `${hours}:${minutes}`;
                    })()
                  : ""
              }
              onChange={(e) => {
                const [hour, minute] = e.target.value.split(":").map(Number);

                if (!bookingData.startTime) return;

                const startDate = new Date(bookingData.startTime);
                const endDate = new Date(startDate);
                endDate.setHours(hour, minute, 0, 0);

                console.log("Päivitetään endTime:", endDate.toISOString());

                setBookingData((prev) => ({
                  ...prev,
                  endTime: endDate.toISOString(),
                }));
              }}
              className="select select-bordered"
              required
            >
              <option value="">-- Valitse päättymisaika --</option>
              {Array.from({ length: 13 }, (_, i) => {
                const hour = 8 + i;
                const time = `${hour.toString().padStart(2, "0")}:00`;
                return (
                  <option key={time} value={time}>
                    {time}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Kuvaus */}
          <div className="form-control mb-4">
            <label className="label">Kuvaus:</label>
            <textarea
              name="description"
              value={bookingData.description}
              onChange={handleChange}
              className="textarea textarea-bordered"
            />
          </div>

          {/* Napit */}
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">
              Peruuta
            </button>
            <button type="submit" className="btn btn-primary">
              Varaa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
