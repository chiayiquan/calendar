import Register from "./api/register";
import Login from "./api/login";
import AddGoal from "./api/addGoal";

function routes(app) {
  app.get("/", (_req, res) => {
    res.json({ data: "Server is up" });
  });

  app.post("/register", Register);
  app.post("/login", Login);
  app.post("/add-goal", AddGoal);
}

export default routes;
