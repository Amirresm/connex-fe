import { ClaimType } from "./claim";

export type NewDocumentType = {
	document: string;
	groundTruth: string;
}

export type DocumentListItemType = {
	id: string;
	title: string;
}

export type DocumentFullType = {
	uuid: string,
	document_title: string,
	document_content: string,
	ground_truch: string,
	claims: ClaimType[],
	user_uuid: string,
	status: "claim" | "confidence" | "ready",
};
