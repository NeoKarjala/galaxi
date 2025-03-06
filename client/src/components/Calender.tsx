import { useState } from 'react';

const Calender = () => {
  const times = [
    '08.00',
    '09.00',
    '10.00',
    '11.00',
    '12.00',
    '13.00',
    '14.00',
    '15.00',
    '16.00',
    '17.00',
    '18.00',
    '19.00',
    '20.00',
  ];

  const days = ['Ma', 'Ti', 'Ke', 'To', 'Pe'];

  const [reservations, setReservations] = useState(new Set<string>());

  const handleCreateReservation = (slot: string) => {
    setReservations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slot)) {
        newSet.delete(slot);
      } else {
        newSet.add(slot);
      }
      return newSet;
    });
  };

  return (
    <div className='p-4 bg-primary text-secondary'>
      <div className='grid grid-cols-5 gap-4'>
        {days.map((day) => (
          <div
            key={day}
            className='bg-secondary p-2 text-center text-white font-bold'
          >
            {day}
            <div className='flex flex-col mt-2'>
              {times.map((time) => {
                const slot = `${day}-${time}`;
                const isReserved = reservations.has(slot);
                return (
                  <button
                    key={slot}
                    className={`p-2 m-1 rounded-md text-center font-semibold ${
                      isReserved ? 'bg-red-500' : 'bg-white'
                    } text-secondary`}
                    onClick={() => handleCreateReservation(slot)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calender;
