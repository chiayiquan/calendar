import http from "http";
import app from "./app";

const server = http.createServer(app);

const listeningPort = process.env.PORT || 3000;
server.listen(listeningPort, function () {
  console.log(`Go to http://localhost:${listeningPort}`);
});

export default app;
