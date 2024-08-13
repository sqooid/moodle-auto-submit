import { env } from '$env/dynamic/private';
import { getTimeZone } from '$lib/moodle';
import { getItems } from '$lib/scheduler/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		tz: getTimeZone(),
		email: env.EMAIL,
		items: await getItems()
	};
};
