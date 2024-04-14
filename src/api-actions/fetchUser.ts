import db from "../../db";
import fetchUserAdjusmentSms from "./fetchUserAdjusmentSms";
import fetchUserDeliveredSms from "./fetchUserDeliveredSms";
import fetchUserPaidSms from "./fetchUserPaidSms";
import fetchUserPendingSms from "./fetchUserPendingSms";
import fetchUserSentSms from "./fetchUserSentSms";
import updateUserBalance from "./updateUserBalance";
import fetchUserPaymentHistory from "./fetchUserPaymentHistory";

export default async function fetchUser(id: number) {
	try {
		if (!id) {
			console.log(`Can not get user id.`);
			return;
		}
		updateUserBalance(Number(id));
		const res = await db.query(
			`SELECT balance, email, user_active, user_create_date, user_id, user_login, user_name, user_role, tel
		FROM users
		WHERE user_id = ${id}`
		);

		if (!res) {
			return null;
		}

		const resAlfaNames = await db.query(`SELECT alfa_name, alfa_name_active
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
			} else {
				alfaNamesDisable.push(resAlfaName.alfa_name);
			}
		};

		const user = res.rows[0];
		const deliveredSms = await fetchUserDeliveredSms(Number(id));
		user.delivered_sms = Number(deliveredSms.rows[0].delevered_sms);

		const sentSms = await fetchUserSentSms(Number(id));
		user.sent_sms = Number(sentSms?.rows[0].sent_sms);

		const pendingSms = await fetchUserPendingSms(Number(id));
		user.pending_sms = Number(pendingSms?.rows[0].pending_sms);

		const paidSms = await fetchUserPaidSms(Number(id));
		user.paid_sms = Number(paidSms?.rows[0].paid_sms);

		const adjusmentSms = await fetchUserAdjusmentSms(Number(id));
		user.adjusment_sms = Number(adjusmentSms?.rows[0].sum);

		let paymentHistory = await fetchUserPaymentHistory(Number(id));
		user.paymentHistory = paymentHistory.rows;

		user.alfa_names_active = alfaNamesActive;
		user.alfa_names_disable = alfaNamesDisable;

		return user;
		return id;
	} catch (error) {
		console.log(error.message);
	}
}

