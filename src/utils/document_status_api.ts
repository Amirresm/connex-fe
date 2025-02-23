import { asyncSleep } from "./async_utils";

const statusStore: {
	[documentId: string]: number;
} = {};

export default async function getDocumentStatus(documentId: string) {
	await asyncSleep(1000);
	const id = parseInt(documentId);
	if (id < 10) return "ready";
	if (!statusStore[documentId]) {
		statusStore[documentId] = Date.now();
	}
	const elapsed = Date.now() - statusStore[documentId];
	if (elapsed > 8000) {
		return "ready";
	} else if (elapsed > 5000) {
		return "confidence";
	} else {
		return "claim";
	}
}
