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
const fetchUserAdjusmentSms_1 = __importDefault(require("./fetchUserAdjusmentSms"));
const fetchUserDeliveredSms_1 = __importDefault(require("./fetchUserDeliveredSms"));
const fetchUserPaidSms_1 = __importDefault(require("./fetchUserPaidSms"));
const fetchUserPendingSms_1 = __importDefault(require("./fetchUserPendingSms"));
const fetchUserSentSms_1 = __importDefault(require("./fetchUserSentSms"));
const updateUserBalance_1 = __importDefault(require("./updateUserBalance"));
const fetchUserPaymentHistory_1 = __importDefault(require("./fetchUserPaymentHistory"));
const fetchUserRejectedSmsByUserId_1 = __importDefault(require("./fetchUserRejectedSmsByUserId"));
function fetchUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!id) {
                console.log(`Can not get user id.`);
                return;
            }
            (0, updateUserBalance_1.default)(Number(id));
            const res = yield db_1.default.query(`SELECT balance, email, user_active, user_create_date, user_id, user_login, user_name, user_role, tel
		FROM users
		WHERE user_id = ${id}`);
            if (!res) {
                return null;
            }
            const resAlfaNames = yield db_1.default.query(`SELECT alfa_name, alfa_name_active
		FROM sendler_name
		WHERE user_id = ${id}`);
            if (!resAlfaNames) {
                return null;
            }
            const alfaNamesActive = [];
            const alfaNamesDisable = [];
            for (const resAlfaName of resAlfaNames.rows) {
                if (resAlfaName.alfa_name_active) {
                    alfaNamesActive.push(resAlfaName.alfa_name);
                }
                else {
                    alfaNamesDisable.push(resAlfaName.alfa_name);
                }
            }
            ;
            const user = res.rows[0];
            const deliveredSms = yield (0, fetchUserDeliveredSms_1.default)(Number(id));
            user.delivered_sms = Number(deliveredSms.rows[0].delevered_sms);
            const sentSms = yield (0, fetchUserSentSms_1.default)(Number(id));
            user.sent_sms = Number(sentSms === null || sentSms === void 0 ? void 0 : sentSms.rows[0].sent_sms);
            const pendingSms = yield (0, fetchUserPendingSms_1.default)(Number(id));
            user.pending_sms = Number(pendingSms === null || pendingSms === void 0 ? void 0 : pendingSms.rows[0].pending_sms);
            const rejectedSms = yield (0, fetchUserRejectedSmsByUserId_1.default)(Number(id));
            user.rejected_sms = Number(rejectedSms === null || rejectedSms === void 0 ? void 0 : rejectedSms.rows[0].rejected_sms);
            const paidSms = yield (0, fetchUserPaidSms_1.default)(Number(id));
            user.paid_sms = Number(paidSms === null || paidSms === void 0 ? void 0 : paidSms.rows[0].paid_sms);
            const adjusmentSms = yield (0, fetchUserAdjusmentSms_1.default)(Number(id));
            user.adjusment_sms = Number(adjusmentSms === null || adjusmentSms === void 0 ? void 0 : adjusmentSms.rows[0].sum);
            let paymentHistory = yield (0, fetchUserPaymentHistory_1.default)(Number(id));
            user.paymentHistory = paymentHistory.rows;
            user.alfa_names_active = alfaNamesActive;
            user.alfa_names_disable = alfaNamesDisable;
            return user;
        }
        catch (error) {
            console.log(error.message);
        }
    });
}
exports.default = fetchUser;
//# sourceMappingURL=fetchUser.js.map