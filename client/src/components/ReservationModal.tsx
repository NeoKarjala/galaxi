import { useState, useEffect } from "react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; time: string; description: string; device: string }) => void;
  selectedSlot: string | null; // Valittu kellonaika ja päivä muodossa "Ma-08.00"
}

function ReservationModal({ isOpen, onClose, onSubmit, selectedSlot }: ReservationModalProps) {
  // Mock-laitteet ennen kuin API on käytössä
  const mockDevices = ["PC", "Pöytä", "TV"];

  // Alustetaan lomaketiedot
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
    device: "",
  });

  // Päivitetään lomaketiedot, kun käyttäjä valitsee ajan
  useEffect(() => {
    if (selectedSlot) {
      const [date, time] = selectedSlot.split("-");
      setFormData((prev) => ({ ...prev, date, time }));
    }
  }, [selectedSlot]);

  // Lomakekenttien käsittely
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Lomakkeen lähetys
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mock data lähetetty:", formData); // Vain testaukseen, voi poistaa API:n valmistuessa
    onSubmit(formData);
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
            <label className="label">Päivämäärä:</label>
            <input type="text" name="date" value={formData.date} readOnly className="input input-bordered" />
          </div>
          <div className="form-control mb-4">
            <label className="label">Aloitusaika:</label>
            <input type="text" name="time" value={formData.time} readOnly className="input input-bordered" />
          </div>

          {/* Päättymisaika (käyttäjä syöttää) */}
          <div className="form-control mb-4">
            <label className="label">Päättymisaika:</label>
            <input type="time" name="endTime" onChange={handleChange} required className="input input-bordered" />
          </div>

          {/* Kuvaus */}
          <div className="form-control mb-4">
            <label className="label">Kuvaus:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered" />
          </div>

          {/* Laitevalinta (dropdown) */}
          <div className="form-control mb-4">
            <label className="label">Valitse laite:</label>
            <select name="device" value={formData.device} onChange={handleChange} className="select select-bordered">
              <option value="">-- Valitse laite --</option>
              {mockDevices.map((device, index) => (
                <option key={index} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </div>

          {/* Napit */}
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">Peruuta</button>
            <button type="submit" className="btn btn-primary">Varaa</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
