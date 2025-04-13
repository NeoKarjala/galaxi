export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    throw new Error("Invalid token format");
  }
};

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000); // sekunteina
    return expiry < now;
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // käsitellään virheellisenä
  }
}

export const getToken = (): string => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("Ei löydy JWT tokenia.");
  }
  return token;
};

// Funktio, joka tarkistaa onko käyttäjä admin
export const isAdmin = (token: string): boolean => {
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Purkaa tokenin
  return decodedToken.role === "admin";
};

// Funktio, joka lisää Authorization-headeriin JWT-tokenin
export const addAuthorizationHeader = (
  token: string
): { Authorization: string } => {
  return {
    Authorization: `Bearer ${token}`,
  };
};
