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
const db_1 = __importDefault(require("../../db"));
function fetchUserDataFromDatabase(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.default.query(`SELECT balance, email, user_active, user_create_date, user_id, user_login, user_name, user_role, tel
  	FROM users
		WHERE user_id = ${id}`);
        return res;
    });
}
exports.default = fetchUserDataFromDatabase;
;
//# sourceMappingURL=fetchUserDataFromDatabase.js.map