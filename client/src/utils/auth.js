import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.log("Token expired");
      logout();
      return false;
    }
    return true;
  } catch (e) {
    console.log("Invalid token", e.message);
    logout();
    return false;
  }
};

export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('role');
  window.location.href = '/login';
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};
