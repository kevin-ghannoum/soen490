import axios from 'axios';

// LocalStorage service for handling storing, removing or fetching accesstoken
const localStorageService = (() => {
  return {
    setToken: (token: { accessToken: string; refreshToken: string; idToken: string }) => {
      localStorage.setItem('access_token', token.accessToken);
      localStorage.setItem('refresh_token', token.refreshToken);
      localStorage.setItem('id_token', token.idToken);
    },
    getAccessToken: () => {
      return localStorage.getItem('access_token');
    },
    getRefreshToken: () => {
      return localStorage.getItem('refresh_token');
    },
    getIdToken: () => {
      return localStorage.getItem('id_token');
    },
    clearAllTokens: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
    },
    setBearerToken: () => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');
      axios.defaults.headers.common['access_token'] = localStorage.getItem('access_token');
    },
  };
})();

export default localStorageService;
