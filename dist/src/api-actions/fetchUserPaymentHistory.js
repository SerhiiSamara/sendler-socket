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
function fetchUserPaymentHistory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.default.query(`SELECT transaction_id, user_id, sms_count, money_count, to_char(transactions_date, 'DD.MM.YYYY HH24:MI:SS') AS transactions_date, paid, paymant_date  FROM transactions_history WHERE user_id = $1`, [id]);
        return res;
    });
}
exports.default = fetchUserPaymentHistory;
;
//# sourceMappingURL=fetchUserPaymentHistory.js.map