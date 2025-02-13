import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Root = () => {
  return (
    <>
      <div>
        <Navigation />

        <div className='py-10 px-96'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
