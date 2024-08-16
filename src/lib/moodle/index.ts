import playwright from 'playwright';
import { authenticator } from 'otplib';
import moment from 'moment';

export const getInputButton = async (page: playwright.Page, text: string) => {
	return await page.getByText(text, { exact: true });
};

export const moodleLogin = async (
	url: string,
	email: string,
	password: string,
	secret: string
): Promise<playwright.Page> => {
	const browser = await playwright['chromium'].launch();
	const context = await browser.newContext();
	const page = await context.newPage();
	try {
		await page.goto(url, { waitUntil: 'networkidle' });
		await page.getByLabel('Email address').fill(email);
		await page.getByLabel('Password').fill(password);
		(await getInputButton(page, 'Sign in')).click();
		await page.getByLabel('Select Google Authenticator.').click();
		const token = authenticator.generate(secret);
		await page.getByLabel('Enter code').fill(token);
		(await getInputButton(page, 'Verify')).click();
		await page.waitForURL(url, { waitUntil: 'networkidle' });
	} catch (error) {
		console.log(error);
		// await page.screenshot({ path: 'test-files/test.png', fullPage: true });
		throw error;
	}
	return page;
};

export const getAssignmentDueDate = async (page: playwright.Page) => {
	const text = await page.getByText(/Due: .+/).innerText();
	const dateText = text.replace('Due: ', '');
	return parseDateString(dateText);
};

export const getAssignmentTitle = async (page: playwright.Page) => {
	return (await page.title()).split('|')[0].trim();
};

export const submitAssignment = async (page: playwright.Page, dry = false) => {
	await page.getByRole('button', { name: 'Submit assignment' }).click();
	await page.getByLabel('I accept the Student Statement.').check();
	const button = await getInputButton(page, 'Continue');
	if (dry) return;
	await button.click();
};

export const parseDateString = (date: string): moment.Moment => {
	return moment(date, 'dddd, D MMMM YYYY, h:mm A');
};

export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
