export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
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
