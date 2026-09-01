export const hasValidAuthToken = () => {
  const token = localStorage.getItem("token");
  return Boolean(token && token !== "null" && token !== "undefined");
};

export const clearAuthSession = () => {
  localStorage.clear();
  window.localStorage.removeItem("persist:root");
};
