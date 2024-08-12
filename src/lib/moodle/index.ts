import playwright from 'playwright';
import { authenticator } from 'otplib';

export const clickInputButton = async (page: playwright.Page, text: string) => {
	await page.getByText(text, { exact: true }).click();
};

export const login = async (
	page: playwright.Page,
	username: string,
	password: string,
	secret: string
) => {
	await page.getByLabel('Email address').fill(username);
	await page.getByLabel('Password').fill(password);
	await clickInputButton(page, 'Sign in');
	await page.getByLabel('Select Google Authenticator.').click();
	const token = authenticator.generate(secret);
	await page.getByLabel('Enter code').fill(token);
	await clickInputButton(page, 'Verify');
};

export const submitAssignment = async (
	url: string,
	username: string,
	password: string,
	secret: string
) => {
	const browser = await playwright['chromium'].launch();
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto(url, { waitUntil: 'networkidle' });
	if (page.url().includes('https://monashuni.okta.com')) {
		await login(page, username, password, secret);
	}
	await page.waitForURL(url);
	await page.getByRole('button', { name: 'Submit assignment' }).click();
	await page.getByLabel('I accept the Student Statement.').check();
	await clickInputButton(page, 'Continue');
	// await page.screenshot({ path: 'test-files/test.png', fullPage: true });
};
