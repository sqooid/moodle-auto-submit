import { env } from '$env/dynamic/private';
import mail from '@sendgrid/mail';
import type { SubmissionItemType } from './db';

mail.setApiKey(env.SENDGRID_KEY);

export const sendMail = async (item: SubmissionItemType) => {
	const text = `Name: ${item.title}
Url: ${item.url}
Submission date: ${item.dueDatetime}`;
	const msg = {
		to: env.EMAIL,
		from: env.SENDGRID_SENDER,
		subject: `Moodle Automatic Submission Failed`,
		text: text,
		html: text
	};
	try {
		const res = await mail.send(msg);
		console.log(`sent mail ${res[0].toString()}`);
	} catch (error) {
		console.log(`failed to send mail ${error}`);
	}
};
