export function retrieveToken(): string | null {
	if (typeof window !== "undefined" && !!window.localStorage && window.localStorage.getItem('token')) {
		return window.localStorage.getItem('token') as string;
	}
	return null;
}

export function storeToken(token: string) {
	if (typeof window !== "undefined" && !!window.localStorage) {
		window.localStorage.setItem('token', token);
	}
}

export function removeToken() {
	if (typeof window !== "undefined" && !!window.localStorage) {
		window.localStorage.removeItem('token');
	}
}
