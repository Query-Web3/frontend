export interface Message {
	message: string;
	type?: 'info' | 'warning' | 'error' | 'success' | 'log';
	duration?: number;
	key: number;
}

export type List = Record<string, Message>;
