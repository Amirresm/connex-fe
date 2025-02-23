import { NewDocumentType } from "@/models/document";

const baseUrl = "http://localhost:7000/api/v1";

export class FetchError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

function betterFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
	const token = localStorage.getItem("token");

	if (token) {
		if (!init) {
			init = {};
		}
		if (!init.headers) {
			init.headers = {};
		}

		if (init.headers instanceof Headers) {
			init.headers.set("Authorization", `Bearer ${token}`);
		} else {
			init.headers["Authorization"] = `Bearer ${token}`;
		}
	}

	return fetch(input, init).then((response) => {
		if (!response.ok) {
			throw new FetchError("Failed to fetch", response.status);
		}
		return response;
	});
}
export async function login(username: string, password: string) {
	const formData = new FormData();
	formData.append("username", username);
	formData.append("password", password);
	const response = await betterFetch(`${baseUrl}/signin`, {
		method: "POST",
		body: formData,
	});
	const json = await response.json();
	const { access_token, token_type } = json;
	return { access_token, token_type };
}

export async function signup(username: string, password: string, email: string) {
	const response = await betterFetch(`${baseUrl}/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: username, password, email: `${username}@example.com` })
	});
	const json = await response.json();
	const { access_token, token_type } = json;
	return { access_token, token_type };
}


export async function fetchAuth() {
	const response = await betterFetch(`${baseUrl}/auth_validate`);
	const json = await response.json();
	return {
		username: json.name,
	};
}

async function initDocument(data: NewDocumentType) {
	const body = {
		document_content: data.document,
		ground_truth: data.groundTruth,
	};
	const response = await betterFetch(`${baseUrl}/document/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const json = await response.json();
	return json as {
		id: number;
		document_content: string;
		ground_truth: string;
	};
}

const api = {
	login,
	signup,
	fetchAuth,
	initDocument,
};

export default api;
