import fetchUserAdjusmentSms from "./fetchUserAdjusmentSms";
import fetchUserDeliveredSms from "./fetchUserDeliveredSms";
import fetchUserPaidSms from "./fetchUserPaidSms";
import fetchUserPendingSms from "./fetchUserPendingSms";
import fetchUserSentSms from "./fetchUserSentSms";
import updateUserBalance from "./updateUserBalance";
import fetchUserPaymentHistory from "./fetchUserPaymentHistory";
import fetchUserRejectedSmsByUserId from "./fetchUserRejectedSmsByUserId";
import fetchUserAlfaNames from "./fetchUserAlfaNames";
import fetchUserDataFromDatabase from "./fetchUserDataFromDatabase";
import fetchUserSmsSendingInProgress from "./fetchUserSmsSendingInProgress";

import { QueryResult } from "pg";
import {
	IUser,
	IResAjustmentSms,
	IResPaidSms,
	IPaymentHistory,
	IResDeliveredSms,
	IResSentdSms,
	IResPendingSms,
	IResRejectedSms,
	IResAlfaNames,
	ISendingProcess,
} from "../globaltypes/types";

export default async function fetchUser(id: number): Promise<IUser | null> {
	try {

		if (!id) {
			return null;
		};

		const resAlfaNamesData = fetchUserAlfaNames(Number(id));
		const deliveredSmsData = fetchUserDeliveredSms(Number(id));
		const sentSmsData = fetchUserSentSms(Number(id));
		const pendingSmsData = fetchUserPendingSms(Number(id));
		const rejectedSmsData = fetchUserRejectedSmsByUserId(Number(id));
		const paidSmsData = fetchUserPaidSms(Number(id));
		const adjusmentSmsData = fetchUserAdjusmentSms(Number(id));
		const paymentHistoryData = fetchUserPaymentHistory(Number(id));
		const userResData = fetchUserDataFromDatabase(Number(id));
		const updateUserBalanceData = updateUserBalance(Number(id));
		const sendingSmsData = fetchUserSmsSendingInProgress(Number(id));

		const [
			resAlfaNames,
			deliveredSms,
			sentSms,
			pendingSms,
			rejectedSms,
			paidSms,
			adjusmentSms,
			paymentHistory,
			userRes,
			updateUserBal,
			sendingSms
		]: [PromiseSettledResult<QueryResult<IResAlfaNames>>,
				PromiseSettledResult<QueryResult<IResDeliveredSms>>,
				PromiseSettledResult<QueryResult<IResSentdSms>>,
				PromiseSettledResult<QueryResult<IResPendingSms>>,
				PromiseSettledResult<QueryResult<IResRejectedSms>>,
				PromiseSettledResult<QueryResult<IResPaidSms>>,
				PromiseSettledResult<QueryResult<IResAjustmentSms>>,
				PromiseSettledResult<QueryResult<IPaymentHistory>>,
				PromiseSettledResult<QueryResult<IUser>>,
				PromiseSettledResult<number | null>,
				PromiseSettledResult<ISendingProcess[]>
			] = await Promise.allSettled([
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

		let user: IUser;
		if (userRes.status === 'fulfilled') {
			user = userRes.value.rows[0];

			if (resAlfaNames.status === 'fulfilled') {
				const alfaNamesActive: string[] = [];
				const alfaNamesDisable: string[] = [];
				for (const resAlfaName of resAlfaNames.value.rows) {
					if (resAlfaName.alfa_name_active) {
						alfaNamesActive.push(resAlfaName.alfa_name);
					} else {
						alfaNamesDisable.push(resAlfaName.alfa_name);
					}
				};
				user.alfa_names_active = alfaNamesActive;
				user.alfa_names_disable = alfaNamesDisable;
			} else {
				throw resAlfaNames.reason;
			};

			if (deliveredSms.status === 'fulfilled') {
				user.delivered_sms = Number(deliveredSms?.value.rows[0].delevered_sms);
			} else {
				throw deliveredSms.reason;
			};

			if (sentSms.status === 'fulfilled') {
				user.sent_sms = Number(sentSms?.value.rows[0].sent_sms);
			} else {
				throw sentSms.reason;
			};

			if (pendingSms.status === 'fulfilled') {
				user.pending_sms = Number(pendingSms?.value.rows[0].pending_sms);
			} else {
				throw pendingSms.reason;
			};

			if (rejectedSms.status === 'fulfilled') {
				user.rejected_sms = Number(rejectedSms?.value.rows[0].rejected_sms);
			} else {
				throw rejectedSms.reason;
			};

			if (paidSms.status === 'fulfilled') {
				user.paid_sms = Number(paidSms?.value.rows[0].paid_sms);
			} else {
				throw paidSms.reason;
			};

			if (adjusmentSms.status === 'fulfilled') {
				user.adjusment_sms = Number(adjusmentSms?.value.rows[0].sum);
			} else {
				throw adjusmentSms.reason;
			};

			if (paymentHistory.status === 'fulfilled') {
				user.paymentHistory = paymentHistory?.value.rows;
			} else {
				throw paymentHistory.reason;
			};

			if (sendingSms.status === 'fulfilled') {
				user.sendingSms = sendingSms?.value
			} else {
				throw sendingSms.reason;
			};

			return user;
		} else {
			throw userRes.reason;
		};

	} catch (error: any) {
		throw new Error(error.message);
	};
};



