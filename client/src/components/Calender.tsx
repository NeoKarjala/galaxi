import { useState, useEffect } from "react";
import ReservationModal from "./ReservationModal"; // Lisää modal

const Calender = () => {
  const times = ["08.00", "09.00", "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00", "19.00", "20.00"];
  const days = ["Ma", "Ti", "Ke", "To", "Pe"];

  const [reservations, setReservations] = useState<Set<string>>(new Set());
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Mock-varaukset
  useEffect(() => {
    const mockReservations = [{ date: "Ma", time: "08.00" }, { date: "Ti", time: "10.00" }, { date: "Ke", time: "14.00" }];
    setReservations(new Set(mockReservations.map((res) => `${res.date}-${res.time}`)));
  }, []);

  const handleOpenModal = (slot: string) => {
    if (!reservations.has(slot)) {
      setSelectedSlot(slot);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="p-8 rounded-md bg-primary">
      <div className="grid grid-cols-5 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-secondary p-2 rounded-md text-center text-black font-bold">
            {day}
            <div className="flex flex-col mt-2 text-secondary">
              {times.map((time) => {
                const slot = `${day}-${time}`;
                const isReserved = reservations.has(slot);
                return (
                  <button
                    key={slot}
                    className={`p-2 m-1 rounded-md text-center font-semibold ${isReserved ? "bg-red-500 cursor-not-allowed" : "bg-white"}`}
                    onClick={() => handleOpenModal(slot)}
                    disabled={isReserved}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal komponentti */}
      <ReservationModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={() => {}} selectedSlot={selectedSlot} />
    </div>
  );
};

export default Calender;
