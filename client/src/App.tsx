import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './routes/Dashboard';
import Root from './routes/Root';
import OwnReservations from './components/OwnReservations';
import AllReservations from './components/AllReservations';
import LoginPage from './routes/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page on oma erillinen reitti ilman Root-layouttia */}
        <Route path="/login" element={<LoginPage />} />

        {/* Suojattujen sivujen reitit Rootin sisällä */}
        <Route path="/" element={<Root />}>
          <Route index element={<Dashboard />} />
          <Route path="ownReservations" element={<OwnReservations />} />
          <Route path="allReservations" element={<AllReservations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
