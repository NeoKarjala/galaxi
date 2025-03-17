import { useState } from 'react';

interface FormData {
  context: string;
  date: string;
  startTime: string;
  endTime: string;
}

const OwnReservations = () => {
  const [formData, setFormData] = useState<FormData>({
    context: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [savedDate, setSavedData] = useState<FormData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.context &&
      formData.date &&
      formData.startTime &&
      formData.endTime
    ) {
      setSavedData([...savedDate, formData]);
      setFormData({ context: '', date: '', startTime: '', endTime: '' });
    }
  };

  return (
    <>
      <div className='flex h-full'>
        <div className='w-3/4 border p-5'>
          <h1 className='text-2xl font-bold'>Omat varaukset</h1>
          <div className='flex flex-col gap-4'>
            {savedDate.map((item, index) => (
              <div
                key={index}
                className='card-body border flex gap-4 flex-row rounded-md shadow'
              >
                <p>
                  <strong>Kuvaus:</strong> {item.context}
                </p>
                <p>
                  <strong>Päivämäärä:</strong> {item.date}
                </p>
                <p>
                  <strong>Aloitus aika:</strong>
                  {item.startTime}
                </p>
                <p>
                  <strong>Lopetus aika:</strong> {item.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className='border p-5'>
          <h1 className='text-2xl font-bold'>Uuden varauksen teko</h1>
          <form onSubmit={handleSubmit}>
            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>Kuvaus:</span>
              </label>
              <input
                type='text'
                name='context'
                value={formData.context}
                onChange={handleChange}
                required
                className='input input-bordered'
              />
            </div>
            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>Päivämäärä:</span>
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className='input input-bordered'
              />
            </div>
            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>Aloitus aika:</span>
              </label>
              <input
                type='time'
                name='startTime'
                value={formData.startTime}
                onChange={handleChange}
                className='input input-bordered'
              />
              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Lopetus aika:</span>
                </label>
                <input
                  type='time'
                  name='endTime'
                  value={formData.endTime}
                  onChange={handleChange}
                  className='input input-bordered'
                />
              </div>
            </div>
            <button type='submit' className='btn btn-primary ml-2'>
              Lisää
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OwnReservations;
