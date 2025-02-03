import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Root = () => {
  return (
    <>
      <div>
        <Navigation />

        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
