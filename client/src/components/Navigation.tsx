import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <>
      <div className='bg-secondary text-primary flex justify-center p-3'>
        <div>
          <h1 className='text-5xl'>GaLaXi</h1>
          <Link className='btn btn-outline' to='/'>
            Dashboard
          </Link>
          <Link className='btn btn-outline' to='/ownReservations'>
            Omat varaukset
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
