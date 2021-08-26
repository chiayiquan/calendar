import http from "http";
import app from "./app";

const server = http.createServer(app);

server.listen(3000, function () {
  console.log("Go to http://localhost:3000");
});

export default app;
