/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";
import {convexAuth} from "@convex-dev/auth/server"
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.signOut = exports.signIn = exports.auth = void 0;
// var server_1 = require("@convex-dev/auth/server");
exports.auth = (_a = (0, convexAuth)({
    providers: [],
}), _a.auth), exports.signIn = _a.signIn, exports.signOut = _a.signOut, exports.store = _a.store;
