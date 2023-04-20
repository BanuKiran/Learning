import jwtDecode from 'jwt-decode';
import axios from 'axios';
//

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (user: any | null) => {
  if (user && user.accessToken) {
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;
  } else {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
