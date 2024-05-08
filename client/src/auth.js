export const isLoggedIn = () => {
  let token = localStorage.getItem("token");
  return token !== null;
};

export const doLogout = (next) => {
  localStorage.removeItem("token");
  next();
};
