// change the 192.168.1.xx to your machine local ip
// react native doesn't allow localhost as the access
const url = "http://192.168.1.208:3000";
// production backend url
// const url = "https://goal-tracker-calendar.herokuapp.com"
const ApiRoutes = {
  login: `${url}/login`,
  register: `${url}/register`,
  listGoal: `${url}/list-goal`,
  addGoal: `${url}/add-goal`,
  deleteGoal: `${url}/delete-goal`,
  updateGoal: `${url}/update-goal`,
};

export default ApiRoutes;
