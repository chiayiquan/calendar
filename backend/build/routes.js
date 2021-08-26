"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function routes(app) {
  app.get("/", function (_req, res) {
    res.json({ data: "Server is up" });
  });
}

exports.default = routes;
//# sourceMappingURL=routes.js.map