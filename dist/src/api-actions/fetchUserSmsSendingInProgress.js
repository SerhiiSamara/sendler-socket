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
function fetchUserSmsSendingInProgress(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.default.query(`SELECT rs.history_id, recipient_status, COUNT(*), to_char(sh.sending_group_date, 'DD.MM.YYYY HH24:MI:SS') AS sending_group_date
FROM recipients_status rs
INNER JOIN sending_history sh ON sh.history_id = rs.history_id
WHERE rs.history_id IN (
SELECT DISTINCT rs.history_id
FROM recipients_status rs
INNER JOIN sending_history sh ON sh.history_id = rs.history_id
INNER JOIN sending_members sm ON sh.history_id = sm.history_id
INNER JOIN send_groups sg ON sg.group_id = sm.group_id
WHERE rs.recipient_status = 'pending' AND sg.user_id = ${id})
GROUP BY rs.history_id, recipient_status, sh.sending_group_date`);
        // modify sending array
        let sendingInProgress = [];
        for (let i = 0; i < res.rows.length; i = i + 1) {
            sendingInProgress.push({
                history_id: res.rows[i].history_id,
                date: res.rows[i].sending_group_date
            });
            if (res.rows[i]) {
                if (res.rows[i].recipient_status === 'rejected') {
                    sendingInProgress[i].rejected = Number(res.rows[i].count);
                }
                ;
                if (res.rows[i].recipient_status === 'fullfield') {
                    sendingInProgress[i].fullfield = Number(res.rows[i].count);
                }
                ;
                if (res.rows[i].recipient_status === 'pending') {
                    sendingInProgress[i].pending = Number(res.rows[i].count);
                }
                ;
            }
            ;
        }
        ;
        // duplicate data of sending in each items with same history_id
        for (let i = 0; i < sendingInProgress.length; i += 1) {
            for (let j = 0; j < sendingInProgress.length; j += 1) {
                if (sendingInProgress[i].history_id === sendingInProgress[j].history_id) {
                    sendingInProgress[i] = Object.assign(Object.assign({}, sendingInProgress[i]), sendingInProgress[j]);
                }
                ;
            }
            ;
        }
        ;
        //remove duplicate items of sending array
        for (let i = 0; i < sendingInProgress.length; i += 1) {
            for (let j = 0; j < sendingInProgress.length; j += 1) {
                if (sendingInProgress[i].history_id === sendingInProgress[j].history_id) {
                    if (i !== j) {
                        sendingInProgress.splice(j, 1);
                    }
                }
                ;
            }
            ;
        }
        ;
        return sendingInProgress;
    });
}
exports.default = fetchUserSmsSendingInProgress;
;
//# sourceMappingURL=fetchUserSmsSendingInProgress.js.map