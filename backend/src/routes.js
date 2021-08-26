import Register from "./api/register";
function routes(app) {
  app.get("/", (_req, res) => {
    res.json({ data: "Server is up" });
  });

  app.post("/register", Register);
}

export default routes;
