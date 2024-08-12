import { EMAIL, MOODLE_HOME, PASSWORD, SECRET } from '$env/static/private';
import { moodleLogin } from '$lib/moodle';
import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	try {
		await moodleLogin(MOODLE_HOME || 'https://learning.monash.edu/my/', EMAIL, PASSWORD, SECRET);
		return json({});
	} catch (e) {
		error(500, { message: e instanceof Error ? e.toString() : '' });
	}
};
