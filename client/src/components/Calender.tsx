const Calender = () => {
  const times = [
    '08.00',
    '08.30',
    '09.00',
    '09.30',
    '10.00',
    '10.30',
    '11.00',
    '11.30',
    '12.00',
    '12.30',
    '13.00',
    '13.30',
    '14.00',
    '14.30',
    '15.00',
    '15.30',
    '16.00',
    '16.30',
    '17.00',
    '17.30',
    '18.00',
    '18.30',
    '19.00',
    '19.30',
    '20.00',
  ];

  const days = ['Ma', 'Ti', 'Ke', 'To', 'Pe'];

  return (
    <>
      <div className='p-4 bg-primary text-secondary'>
        <div className='grid grid-cols-5 gap-4'>
          {days.map((day) => (
            <div
              key={day}
              className='bg-secondary p-2 text-center text-white font-bold'
            >
              {day}
              <div className='flex flex-col mt-2'>
                {times.map((time) => (
                  <button
                    key={time}
                    className='p-2 m-1 rounded-md text-center font-semibold bg-white text-secondary'
                    onClick={() => console.log('click')}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calender;
