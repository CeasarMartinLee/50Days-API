"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config();
// import { SampleController } from './controllers'
const routing_controllers_1 = require("routing-controllers");
const db_1 = require("./db");
const app = routing_controllers_1.createExpressServer({
    controllers: [],
    authorizationChecker: (action) => __awaiter(this, void 0, void 0, function* () {
        return false;
    }),
    currentUserChecker: (action) => __awaiter(this, void 0, void 0, function* () {
        return undefined;
    }),
    cors: true
});
app.set("port", process.env.PORT || 3000);
let http = require('http').Server(app);
let io = require('socket.io')(http);
io.on('connection', function (socket) {
    console.log('a user connected');
});
db_1.default().then(() => {
    app.listen(app.get("port"), () => {
        console.log("App is running on http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    });
}).catch((err) => console.error(err));
//# sourceMappingURL=index.js.map