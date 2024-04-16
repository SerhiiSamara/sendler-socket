
export interface ITel {
	tel: string;
}

export interface IUserId {
	user_id: number;
}

export interface IUser extends ITel, IUserId {
	user_login: string;
	email: string;
	user_name: string;
	user_active?: boolean;
	user_password: string;
	balance?: number;
	user_token?: string | null;
	user_create_date: Date;
	alfa_names_active: string[];
	alfa_names_disable: string[];
	sent_sms: number;
	delivered_sms: number;
	paymentHistory: IPaymentHistory[];
};

export interface IPaymentHistory {
	transaction_id: number;
	user_id: number;
	sms_count: number;
	money_count: string;
	transactions_date: string;
	paymant_date: string | null;
	paid: boolean;
};

export interface IGroupName {
	group_name: string;
};

export type SmsStatusEnum = 'pending' | 'rejected' | 'fullfield';

export interface IUser extends ITel, IUserId {
	user_login: string;
	email: string;
	user_name: string;
	user_active?: boolean;
	user_password: string;
	balance?: number;
	user_token?: string | null;
	user_create_date: Date;
	alfa_names_active: string[];
	alfa_names_disable: string[];
	sent_sms: number;
	delivered_sms: number;
	pending_sms: number;
	paid_sms: number;
	adjusment_sms: number;
	paymentHistory: IPaymentHistory[];
};
export interface IResAjustmentSms {
	sum: string;
};

export interface IResPaidSms {
	paid_sms: string;
};

export interface IResDeliveredSms {
	delevered_sms: string;
};

export interface IResSentdSms {
	sent_sms: string;
};

export interface IResPendingSms {
	pending_sms: string;
};

export interface IResRejectedSms {
	rejected_sms: string;
};
