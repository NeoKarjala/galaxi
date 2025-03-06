import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <>
      <div className='bg-secondary text-primary flex px-5 py-32 w-72'>
        <ul className='menu flex gap-4 w-full'>
          <li>
            <Link className='btn btn-outline' to='/'>
              Dashboard
            </Link>
          </li>
          <li>
            <Link className='btn btn-outline' to='/ownReservations'>
              Omat varaukset
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navigation;
