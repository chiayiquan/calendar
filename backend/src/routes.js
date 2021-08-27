import Register from "./api/register";
import Login from "./api/login";
import AddGoal from "./api/addGoal";
import ListGoal from "./api/listGoal";
import UpdateGoal from "./api/updateGoal";

function routes(app) {
  app.get("/", (_req, res) => {
    res.json({ data: "Server is up" });
  });
  app.get("/list-goal", ListGoal);

  app.post("/register", Register);
  app.post("/login", Login);
  app.post("/add-goal", AddGoal);
  app.post("/update-goal", UpdateGoal);
}

export default routes;
