// Store user session in localStorage with expiry
export const storeSession = (userData) => {
  const sessionData = {
    ...userData,
    expiry: Date.now() + 12 * 60 * 60 * 1000, // 12 hours from now
  };
  localStorage.setItem("userSession", JSON.stringify(sessionData));
};

// Retrieve session and validate expiry
export const getSession = () => {
  const sessionData = localStorage.getItem("userSession");
  if (sessionData) {
    const parsedData = JSON.parse(sessionData);
    if (Date.now() > parsedData.expiry) {
      // Session expired
      clearSession();
      return null;
    }
    return parsedData;
  }
  return null;
};

// Clear session from localStorage
export const clearSession = () => {
  localStorage.removeItem("userSession");
  localStorage.removeItem("cart");
};
