"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var corsOpts = {
  origin: "*",

  methods: ["GET", "POST"]
};

var app = (0, _express2.default)();
app.use((0, _cors2.default)(corsOpts));
app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json());

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function () {
  console.log("listening to Port", app.get("port"));
  console.log("Go to http://localhost:3000");
});

(0, _routes2.default)(app);
//# sourceMappingURL=server.js.map