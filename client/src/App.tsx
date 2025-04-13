import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import Root from "./routes/Root";
import OwnReservations from "./components/OwnReservations";
import AllReservations from "./components/AllReservations";
import Login from "./routes/Login";
import { isTokenExpired } from "./utils/jwtUtils";
import { TokenMonitor } from "./components/TokenMonitor";
import Register from "./components/Register";

// Suojattu reittikomponentti
function ProtectedRoute() {
  const token = localStorage.getItem("jwtToken");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("jwtToken"); // Poista vanhentunut token
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <TokenMonitor />
      <Routes>
        {/* Login page on oma erillinen reitti ilman Root-layouttia */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Suojatut reitit */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Root />}>
            <Route index element={<Dashboard />} />
            <Route path="ownReservations" element={<OwnReservations />} />
            <Route path="allReservations" element={<AllReservations />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
