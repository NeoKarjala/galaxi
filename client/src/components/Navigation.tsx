import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate(); // Luo navigointifunktio

  const handleLogout = () => {
    // Poista JWT-token localStoragesta
    localStorage.removeItem("jwtToken");

    // Navigoi takaisin login-sivulle
    navigate("/login");
  };

  return (
    <>
      <div className="bg-secondary text-secondary flex flex-col justify-between px-8 py-32 w-80">
        <div>
          <ul className="menu flex gap-4 w-full">
            <li>
              <Link
                className="btn btn-outline bg-primary hover:border-primary hover:text-primary"
                to="/"
              >
                Kalenteri
              </Link>
            </li>
            <li>
              <Link
                className="btn btn-outline bg-primary hover:border-primary hover:text-primary"
                to="/ownReservations"
              >
                Omat varaukset
              </Link>
            </li>
            <li>
              <Link
                className="btn btn-outline bg-primary hover:border-primary hover:text-primary"
                to="/AllReservations"
              >
                Kaikki varaukset
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="menu flex gap-4 w-full">
            <li className="btn btn-outline bg-primary hover:border-primary hover:text-primary">
              Kieli / Language
            </li>
            <li
              className="btn btn-outline bg-primary hover:border-primary hover:text-primary"
              onClick={handleLogout} // Käytä handleLogout-funktiota
            >
              Kirjaudu ulos
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navigation;
