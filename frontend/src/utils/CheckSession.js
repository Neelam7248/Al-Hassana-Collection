//it is  iam am currently using in add products component only

import { isSessionExpired, logout } from "./auth"; // aapka existing file

export const checkSessionAndRedirect = () => {
  if (isSessionExpired()) {
    logout();

    // current page save
    const currentPath = window.location.pathname;

    // redirect to login with return path
    window.location.href = `/signin?redirect=${currentPath}`;

    return true; // session expired
  }

  return false; // session valid
};