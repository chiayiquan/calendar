// change the 192.168.1.xx to your machine local ip
// react native doesn't allow localhost as the access
const url = "http://192.168.1.208:3000";
const ApiRoutes = {
  login: `${url}/login`,
  register: `${url}/register`,
};

export default ApiRoutes;
