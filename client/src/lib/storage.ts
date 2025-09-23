export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};
