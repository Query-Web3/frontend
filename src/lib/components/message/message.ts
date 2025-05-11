import { writable } from 'svelte/store';
import type { List, Message } from './types';
import { mount } from 'svelte';
import MessageComp from './Message.svelte';

export const store = writable<List>({});

let c = 0;

let div: HTMLDivElement | undefined

function add(m: Message) {
	if (!div) {
		div = document.createElement('div');
		document.body.appendChild(div);

		mount(MessageComp, {
			target: div
		})
	} else {
		document.body.appendChild(div);
	}

	store.update((list) => {
		const key = c++;
		const duration = (m.duration ?? 4) * 1000;

		setTimeout(() => {
			store.update((list) => {
				delete list[key];
				console.log(`Removed message: ${m.message}`);
				return { ...list };
			});
		}, duration).toString();

		return Object.assign(list, {
			[key]: { ...m, key: key }
		});
	});
}

export function info(msg: string) {
	add({ key: 0, message: msg, type: 'info' });
}

export function success(msg: string) {
	add({ key: 0, message: msg, type: 'success' });
}

export function error(msg: string) {
	add({ key: 0, message: msg, type: 'error' });
}

export function log(msg: string) {
	add({ key: 0, message: msg, type: 'log' });
}

const message = {
	info,
	success,
	error,
	log
};

export default message;
