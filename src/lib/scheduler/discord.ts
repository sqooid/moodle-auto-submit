import { env } from '$env/dynamic/private';
import type { SubmissionItemType } from './db';

export const sendDiscordNotification = async (item: SubmissionItemType, success: boolean) => {
	const msg = {
		content: `Automatic submission _${success ? 'success' : 'failed'}_
Name: ${item.title}
Link: ${item.url}`
	};
	const result = await fetch(env.DISCORD_WEBHOOK_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(msg)
	});
	if (!result.ok) {
		console.log(`failed to send notification: ${await result.text()}`);
	}
	return result.ok;
};
