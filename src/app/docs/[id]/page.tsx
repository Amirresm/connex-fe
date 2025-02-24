"use client";

import DocumentClaimContainer from "@/components/document/document-claim-container/DocumentClaimContainer";
import NewDocumentProcessing from "@/animations/new-document-processing/new-document-processing";
import getDocumentStatus from "@/utils/document_status_api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import api from "@/api/api";

export default function DocumentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const socketRef = React.useRef<WebSocket | null>(null);
	const { id } = React.use(params);

	const documentStatusQuery = useQuery({
		queryKey: ["documentStatus", id],
		queryFn: async ({ queryKey }) => {
			const status = await api.fetchDocumentStatus(queryKey[1]);
			return status;
		},
		refetchInterval: (query) => {
			return query.state.data !== "ready" ? 1000 : false;
		},
		// enabled: false
	});

	React.useEffect(() => {
		// connect to socket
		const socket = new WebSocket(`ws://localhost:7000/ws/${id}`);
		socketRef.current = socket;
		socket.onopen = (e) => {
			console.log("Socket connected", e);
		};
		socket.onmessage = (e) => {
			console.log("Socket message", e);
		};

	}, [id]);


	if (documentStatusQuery.isLoading || !documentStatusQuery.data) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<div className="loading loading-dots loading-lg"></div>
			</div>
		);
	} else if (["claim", "confidence"].includes(documentStatusQuery.data)) {
		return <NewDocumentProcessing state={documentStatusQuery.data} />;
	} else {
		return <DocumentClaimContainer documentId={id} />;
	}
}
