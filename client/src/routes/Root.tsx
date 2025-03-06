import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Root = () => {
  return (
    <>
      <div className='w-screen bg-primary h-40 flex justify-center items-center'>
        <h1 className='text-6xl font-bold'>Xamkin pelihuoneen kalenteri</h1>
      </div>
      <div className='flex h-screen'>
        <Navigation />

        <div className='py-16 px-72 w-full'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
