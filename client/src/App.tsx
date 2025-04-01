import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './routes/Dashboard';
import Root from './routes/Root';
import OwnReservations from './components/OwnReservations';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Root />}>
            <Route index element={<Dashboard />} />
            <Route path='ownReservations' element={<OwnReservations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
