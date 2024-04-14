"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
require("dotenv/config");
const fetchUser_1 = __importDefault(require("./api-actions/fetchUser"));
const { NEXT_APP_URL, SOCKET_PORT } = process.env;
const io = new socket_io_1.Server(Number(SOCKET_PORT), {
    cors: {
        origin: NEXT_APP_URL,
        methods: ["GET", "POST"],
    },
});
exports.default = io.on("connection", (socket) => {
    let timeOut;
    console.log("User is connected.");
    socket.on('message', (message, roomName) => __awaiter(void 0, void 0, void 0, function* () {
        const updateBalanceInRealTime = (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i <= 0) {
                return 0;
            }
            timeOut = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield (0, fetchUser_1.default)(message);
                if (user) {
                    console.log("User balance", user.balance);
                    io.emit('message', user);
                }
                return yield updateBalanceInRealTime(i - 10000);
            }), 10000);
        });
        yield updateBalanceInRealTime(21600000);
    }));
    socket.on("disconnect", (reason) => {
        clearTimeout(timeOut);
        console.log("User is disconnected.");
    });
});
console.log(`Server listening on port ${SOCKET_PORT}`);
//# sourceMappingURL=server.js.map