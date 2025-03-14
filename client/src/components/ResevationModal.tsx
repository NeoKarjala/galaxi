import { useState } from "react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; time: string; description: string }) => void;
}

function ReservationModal({ isOpen, onClose, onSubmit }: ReservationModalProps) {
  // Tilamuuttujat lomaketiedoille
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
  });

  // Lomakekenttien käsittely
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Lomakkeen lähetys
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null; // Älä piirrä mitään, jos modaali on suljettu

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="font-bold text-xl mb-4">Make a Reservation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered"
            />
          </div>
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Reserve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
