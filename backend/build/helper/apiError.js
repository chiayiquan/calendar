"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var apiError = exports.apiError = function apiError(res, e) {
  res.status(400);
  res.send({
    code: e.code,
    message: e.sqlMessage
  });
};
//# sourceMappingURL=apiError.js.map