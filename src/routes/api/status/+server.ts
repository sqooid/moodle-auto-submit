import { env } from '$env/dynamic/private';
import { moodleLogin } from '$lib/moodle';
import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	try {
		await moodleLogin(
			env.MOODLE_HOME || 'https://learning.monash.edu/my/',
			env.EMAIL,
			env.PASSWORD,
			env.SECRET
		);
		return json({});
	} catch (e) {
		error(500, { message: e instanceof Error ? e.toString() : '' });
	}
};
