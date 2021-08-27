import Register from "./api/register";
import Login from "./api/login";

function routes(app) {
  app.get("/", (_req, res) => {
    res.json({ data: "Server is up" });
  });

  app.post("/register", Register);
  app.post("/login", Login);
}

export default routes;
