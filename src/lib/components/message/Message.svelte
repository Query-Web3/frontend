<script lang="ts">
	import { backOut } from "svelte/easing";
	import {
		fly,
		scale,
		type ScaleParams,
		type TransitionConfig,
	} from "svelte/transition";
	import { store } from "./message";
	import type { List, Message } from "./types";

	let messageList: List = $state({});

	store.subscribe((list) => {
		console.log("Message list updated:", list, Object.values(list));
		messageList = list;
	});

	function out(node: HTMLElement, params?: ScaleParams): TransitionConfig {
		const height = node.scrollHeight;
		const style = getComputedStyle(node);
		const marginBottom = parseFloat(style.marginBottom);
		return {
			delay: params?.delay ?? 1,
			duration: params?.duration ?? 400,
			easing: params?.easing ?? backOut,
			css: (t) =>
				`height: ${height * t}px; margin-bottom: ${marginBottom * t}px;`,
		};
	}
</script>

<div class="box">
	{#each Object.values<Message>(messageList) as msg (msg.key)}
		<div in:fly={{ y: -50 }} out:out style="margin-bottom: 3px;">
			<div out:scale class="message {msg.type}">
				{msg.message}
			</div>
		</div>
	{/each}
</div>

<style>
	.box {
		width: 100%;
		position: fixed;
		top: 5px;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		pointer-events: none;
	}

	.message {
		display: inline-block;
		width: max-content;
		margin-bottom: 10px;
		padding: var(--ant-message-content-padding, 9px 12px);
		background: var(--ant-message-content-bg, white);
		border-radius: var(--ant-border-radius-lg, 8px);
		box-shadow: var(
			--ant-box-shadow,
			0 6px 16px 0 rgba(0, 0, 0, 0.08),
			0 3px 6px -4px rgba(0, 0, 0, 0.12),
			0 9px 28px 8px rgba(0, 0, 0, 0.05)
		);
		pointer-events: all;
	}

	.info {
		background-color: #46a1f7;
	}

	.success {
		background-color: #52c41a;
	}

	.error {
		background-color: #f5222d;
	}

	.log {
		background-color: white;
	}

	.visible {
		opacity: 1;
	}
</style>
