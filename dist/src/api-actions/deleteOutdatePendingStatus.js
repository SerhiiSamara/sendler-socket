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
function deleteOutdatePendingStatus(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query(`UPDATE recipients_status
		SET recipient_status = 'rejected'
		WHERE recipient_id IN (
		SELECT rs.recipient_id
		FROM recipients_status rs
		INNER JOIN send_groups sg ON sg.group_id = rs.group_id
		WHERE sg.user_id = ${id} AND rs.recipient_status = 'pending')
		AND EXTRACT(EPOCH FROM now())-EXTRACT(EPOCH FROM status_changing_date) > 172800;		
		`);
    });
}
exports.default = deleteOutdatePendingStatus;
;
//# sourceMappingURL=deleteOutdatePendingStatus.js.map