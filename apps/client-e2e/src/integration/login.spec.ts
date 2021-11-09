import { Select } from "../support/element-selector";

/** Opens the login dialog, enters credentials and clicks login button. */
function loginWith(username: string, password: string): void {
	cy.getBySelector(Select.openLoginButton).click();
	cy.getBySelector(Select.dialog.login.usernameInput).type(username);
	cy.getBySelector(Select.dialog.login.passwordInput).type(password);
	cy.getBySelector(Select.dialog.login.loginBtn).click();
}

const sparkyLoginResponse = {
	user: {
		username: "user",
		fullName: null,
		realm: "MEMORY",
		passwordDto: null,
		settings: {
			wantsAi: false,
			emailReceive: false,
			emailAddress: null,
			payload: null
		},
		role: "ADMIN",
		expirationDate: null
	},
	token: {
		token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJMSVZFIHNwYXJreXNlcnZpY2UtYXBpIiwiYXVkIjoiTElWRSBzcGFya3lzZXJ2aWNlLWFwcCIsInN1YiI6InVzZXIiLCJleHAiOjE2MzY1NjQ3MDYsInJvbCI6WyJBRE1JTiJdLCJyZWFsbSI6Ik1FTU9SWSIsImp0aSI6ImY0ZWQ2NzZiLWFkNzUtNGZlNy05MjU0LTM2YTE1MjZhMDBlMyJ9.8IaCGsnxYpbwZL1_1cONRx3aWVDAYUq7icXGr2VzCGDSkWOZUXDq-3adr-BV4XapO6KFxFHMqMh-g4tdwTSgdQ",
		expiration: "11/10/2021 17:18:26"
	}
};

const backendWhoAmIResponse = {
	id: "41352fcc-9b4b-4215-bf29-693f7488a2df",
	matrNr: null,
	email: null,
	username: "user",
	displayName: "user",
	role: "SYSTEM_ADMIN",
	courses: []
};

const sparkyUrl = "http://localhost:8080/api/v1/authenticate";
const backendUrl = "http://localhost:3000/auth/whoAmI";

describe("Login", () => {
	beforeEach(() => {
		cy.intercept("POST", sparkyUrl, {
			statusCode: 200,
			body: sparkyLoginResponse
		});

		cy.intercept("GET", backendUrl, {
			statusCode: 200,
			body: backendWhoAmIResponse
		});

		cy.clearLocalStorage("studentMgmtTokenKey");
		cy.visit("/");
	});

	it("Click on Login Button -> Opens Login Dialog", () => {
		cy.getBySelector(Select.openLoginButton).click();
		cy.getBySelector(Select.dialog.login.container).should("be.visible");
	});

	it("Valid credentials -> Dialog closes and User is logged in", () => {
		loginWith("user", "abcdefgh");
		cy.getBySelector(Select.dialog.login.container).should("not.exist");
		cy.getBySelector(Select.getStarted.userGreeting).should("contain.text", "user");
		cy.getBySelector(Select.terminal.stdin).should("be.visible");
	});

	it("Invalid credentials -> Displays error message", () => {
		cy.intercept("POST", sparkyUrl, {
			statusCode: 401
		});

		loginWith("user", "wrong_password");
		cy.getBySelector(Select.dialog.login.errorMessage).should(
			"contain.text",
			"The given username or password was incorrect."
		);
	});

	it("No Connection to Sparky -> Displays error message", () => {
		cy.intercept("POST", sparkyUrl, {
			forceNetworkError: true
		});

		loginWith("user", "abcdefgh");
		cy.getBySelector(Select.dialog.login.errorMessage).should(
			"contain.text",
			"Failed to connect to the server."
		);
	});

	it("No Connection to Backend -> Displays error message", () => {
		cy.intercept("GET", backendUrl, {
			forceNetworkError: true
		});

		loginWith("user", "abcdefgh");
		cy.getBySelector(Select.dialog.login.errorMessage).should(
			"contain.text",
			"Failed to connect to the server."
		);
	});
});
