import { DocumentListItemType, NewDocumentType } from "@/models/document";
import { removeToken, retrieveToken } from "@/utils/tokenUtils";

const baseUrl = "http://localhost:7000/api/v1";

export class FetchError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

function betterFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
	const token = retrieveToken();

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
			if (response.status === 401) {
				if (typeof window !== "undefined") {
					window.location.href = "/";
				}
				removeToken();
			}
			throw new FetchError("Failed to fetch", response.status);
		}
		return response;
	});
}
export async function login(username: string, password: string) {
	const formData = new FormData();
	formData.append("username", username);
	formData.append("password", password);
	const response = await betterFetch(`${baseUrl}/signin/`, {
		method: "POST",
		body: formData,
	});
	const json = await response.json();
	const { access_token, token_type } = json;
	return { access_token, token_type };
}

export async function signup(username: string, password: string, email?: string) {
	const response = await betterFetch(`${baseUrl}/signup/`, {
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
	const response = await betterFetch(`${baseUrl}/auth_validate/`);
	const json = await response.json();
	return {
		username: json.name,
	};
}

export async function fetchDocuments() {
	const response = await betterFetch(`${baseUrl}/document/get-all`);
	const json = (await response.json()).map(({ document_id, title }: { document_id: string, title: string }) => (
		{ id: document_id, title }
	)) as DocumentListItemType[];
	return json as DocumentListItemType[];
}

export async function fetchDocument(documentId: string) {
	const response = await betterFetch(`${baseUrl}/document/${documentId}`);
	const json = await response.json();
	return json;
}

export async function fetchDocumentStatus(documentId: string) {
	const response = await betterFetch(`${baseUrl}/document/${documentId}`);
	const json = await response.json();
	const status = json.status === "claim_extraction" ? "claim" : json.status === "claim_verification" ? "confidence" : "ready";
	return status;
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
		uuid: number;
		document_content: string;
		ground_truth: string;
	};
}

const api = {
	login,
	signup,
	fetchAuth,
	fetchDocuments,
	fetchDocument,
	fetchDocumentStatus,
	initDocument,
};

export default api;
