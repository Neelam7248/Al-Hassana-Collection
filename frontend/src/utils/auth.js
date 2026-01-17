// Save token and user info
export const saveAuthData = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
  // ⏰ save login time
  sessionStorage.setItem("loginTime", Date.now());
};

// Get token
export const getToken = () => {
  return sessionStorage.getItem('token');
};

// Get user info
export const getUser = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!sessionStorage.getItem('token');
};

// Check if current user is admin
export const isAdmin = () => {
  const user = getUser();
  return user?.userType === 'admin';
};

// Logout (clear all auth data)
export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("loginTime");
};
 
// Check if 30-minute session expired
export const isSessionExpired = () => {
  const loginTime = sessionStorage.getItem("loginTime");
  if (!loginTime) return true;

  const THIRTY_MINUTES = 30 * 60 * 1000; // 30 min
  return Date.now() - Number(loginTime) > THIRTY_MINUTES;
};
