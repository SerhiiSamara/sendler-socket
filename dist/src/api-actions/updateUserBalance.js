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
const fetchUserDeliveredSms_1 = __importDefault(require("./fetchUserDeliveredSms"));
const fetchUserAdjusmentSms_1 = __importDefault(require("./fetchUserAdjusmentSms"));
const fetchUserPaidSms_1 = __importDefault(require("./fetchUserPaidSms"));
const fetchUserPendingSms_1 = __importDefault(require("./fetchUserPendingSms"));
function updateUserBalance(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (id === null || id === undefined) {
                return null;
            }
            else {
                let balance;
                let paidSms;
                let deliveredSms;
                let pendingSms;
                let adjusmentSms;
                const resPaidSms = yield (0, fetchUserPaidSms_1.default)(id);
                paidSms = Number(resPaidSms.rows[0].paid_sms);
                const resDeliveredSms = yield (0, fetchUserDeliveredSms_1.default)(id);
                deliveredSms = Number(resDeliveredSms.rows[0].delevered_sms);
                const resPendigSms = yield (0, fetchUserPendingSms_1.default)(id);
                pendingSms = Number(resPendigSms.rows[0].pending_sms);
                const resAjustmentSms = yield (0, fetchUserAdjusmentSms_1.default)(id);
                adjusmentSms = Number(resAjustmentSms.rows[0].sum);
                balance = paidSms - deliveredSms - pendingSms - adjusmentSms;
                yield db_1.default.query(`UPDATE users SET balance = ${balance} WHERE user_id = ${id} RETURNING *`);
                return balance;
            }
            ;
        }
        catch (error) {
            throw new Error(error.message);
        }
        ;
    });
}
exports.default = updateUserBalance;
;
//# sourceMappingURL=updateUserBalance.js.map