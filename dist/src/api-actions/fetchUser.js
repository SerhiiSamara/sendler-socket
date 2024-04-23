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
const fetchUserAdjusmentSms_1 = __importDefault(require("./fetchUserAdjusmentSms"));
const fetchUserDeliveredSms_1 = __importDefault(require("./fetchUserDeliveredSms"));
const fetchUserPaidSms_1 = __importDefault(require("./fetchUserPaidSms"));
const fetchUserPendingSms_1 = __importDefault(require("./fetchUserPendingSms"));
const fetchUserSentSms_1 = __importDefault(require("./fetchUserSentSms"));
const updateUserBalance_1 = __importDefault(require("./updateUserBalance"));
const fetchUserPaymentHistory_1 = __importDefault(require("./fetchUserPaymentHistory"));
const fetchUserRejectedSmsByUserId_1 = __importDefault(require("./fetchUserRejectedSmsByUserId"));
const fetchUserAlfaNames_1 = __importDefault(require("./fetchUserAlfaNames"));
const fetchUserDataFromDatabase_1 = __importDefault(require("./fetchUserDataFromDatabase"));
const fetchUserSmsSendingInProgress_1 = __importDefault(require("./fetchUserSmsSendingInProgress"));
function fetchUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!id) {
                return null;
            }
            ;
            const resAlfaNamesData = (0, fetchUserAlfaNames_1.default)(Number(id));
            const deliveredSmsData = (0, fetchUserDeliveredSms_1.default)(Number(id));
            const sentSmsData = (0, fetchUserSentSms_1.default)(Number(id));
            const pendingSmsData = (0, fetchUserPendingSms_1.default)(Number(id));
            const rejectedSmsData = (0, fetchUserRejectedSmsByUserId_1.default)(Number(id));
            const paidSmsData = (0, fetchUserPaidSms_1.default)(Number(id));
            const adjusmentSmsData = (0, fetchUserAdjusmentSms_1.default)(Number(id));
            const paymentHistoryData = (0, fetchUserPaymentHistory_1.default)(Number(id));
            const userResData = (0, fetchUserDataFromDatabase_1.default)(Number(id));
            const updateUserBalanceData = (0, updateUserBalance_1.default)(Number(id));
            const sendingSmsData = (0, fetchUserSmsSendingInProgress_1.default)(Number(id));
            const [resAlfaNames, deliveredSms, sentSms, pendingSms, rejectedSms, paidSms, adjusmentSms, paymentHistory, userRes, updateUserBal, sendingSms] = yield Promise.allSettled([
                resAlfaNamesData,
                deliveredSmsData,
                sentSmsData,
                pendingSmsData,
                rejectedSmsData,
                paidSmsData,
                adjusmentSmsData,
                paymentHistoryData,
                userResData,
                updateUserBalanceData,
                sendingSmsData
            ]);
            let user;
            if (userRes.status === 'fulfilled') {
                user = userRes.value.rows[0];
                if (resAlfaNames.status === 'fulfilled') {
                    const alfaNamesActive = [];
                    const alfaNamesDisable = [];
                    for (const resAlfaName of resAlfaNames.value.rows) {
                        if (resAlfaName.alfa_name_active) {
                            alfaNamesActive.push(resAlfaName.alfa_name);
                        }
                        else {
                            alfaNamesDisable.push(resAlfaName.alfa_name);
                        }
                    }
                    ;
                    user.alfa_names_active = alfaNamesActive;
                    user.alfa_names_disable = alfaNamesDisable;
                }
                else {
                    throw resAlfaNames.reason;
                }
                ;
                if (deliveredSms.status === 'fulfilled') {
                    user.delivered_sms = Number(deliveredSms === null || deliveredSms === void 0 ? void 0 : deliveredSms.value.rows[0].delevered_sms);
                }
                else {
                    throw deliveredSms.reason;
                }
                ;
                if (sentSms.status === 'fulfilled') {
                    user.sent_sms = Number(sentSms === null || sentSms === void 0 ? void 0 : sentSms.value.rows[0].sent_sms);
                }
                else {
                    throw sentSms.reason;
                }
                ;
                if (pendingSms.status === 'fulfilled') {
                    user.pending_sms = Number(pendingSms === null || pendingSms === void 0 ? void 0 : pendingSms.value.rows[0].pending_sms);
                }
                else {
                    throw pendingSms.reason;
                }
                ;
                if (rejectedSms.status === 'fulfilled') {
                    user.rejected_sms = Number(rejectedSms === null || rejectedSms === void 0 ? void 0 : rejectedSms.value.rows[0].rejected_sms);
                }
                else {
                    throw rejectedSms.reason;
                }
                ;
                if (paidSms.status === 'fulfilled') {
                    user.paid_sms = Number(paidSms === null || paidSms === void 0 ? void 0 : paidSms.value.rows[0].paid_sms);
                }
                else {
                    throw paidSms.reason;
                }
                ;
                if (adjusmentSms.status === 'fulfilled') {
                    user.adjusment_sms = Number(adjusmentSms === null || adjusmentSms === void 0 ? void 0 : adjusmentSms.value.rows[0].sum);
                }
                else {
                    throw adjusmentSms.reason;
                }
                ;
                if (paymentHistory.status === 'fulfilled') {
                    user.paymentHistory = paymentHistory === null || paymentHistory === void 0 ? void 0 : paymentHistory.value.rows;
                }
                else {
                    throw paymentHistory.reason;
                }
                ;
                if (sendingSms.status === 'fulfilled') {
                    user.sendingSms = sendingSms === null || sendingSms === void 0 ? void 0 : sendingSms.value;
                }
                else {
                    throw sendingSms.reason;
                }
                ;
                return user;
            }
            else {
                throw userRes.reason;
            }
            ;
        }
        catch (error) {
            throw new Error(error.message);
        }
        ;
    });
}
exports.default = fetchUser;
;
//# sourceMappingURL=fetchUser.js.map