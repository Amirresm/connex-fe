"use client";

import DocumentClaimContainer from "@/components/document/document-claim-container/document-claim-container";
import NewDocumentProcessing from "@/animations/new-document-processing/new-document-processing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import api from "@/api/api";

export default function DocumentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);
	const queryClient = useQueryClient();

	const documentStatusQuery = useQuery({
		queryKey: ["documentStatus", id],
		queryFn: async ({ queryKey }) => {
			const data = await api.fetchDocumentStatus(queryKey[1]);
			return data;
		},
	});

	const [currentState, setCurrentState] = React.useState<
		"claim" | "confidence" | "ready"
	>();

	React.useEffect(() => {
		if (documentStatusQuery.data && !currentState) {
			setCurrentState(documentStatusQuery.data?.status);
		}
	}, [currentState, documentStatusQuery.data]);

	const generateTitleMutation = useMutation({
		mutationKey: ["generateDocTitle", id],
		mutationFn: async () => {
			await api.generateDocTitle(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documentList"] });
		},
	});

	const extractClaimsMutation = useMutation({
		mutationKey: ["extractClaims", id],
		mutationFn: async () => {
			await api.extractClaims(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["document", id] });
			queryClient.invalidateQueries({ queryKey: ["documentStatus", id] });
			setCurrentState("confidence");
		},
	});

	const verifyClaimsMutation = useMutation({
		mutationKey: ["verifyClaims", id],
		mutationFn: async () => {
			await api.verifyClaims(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["document", id] });
			setCurrentState("ready");
		},
	});

	React.useEffect(() => {
		switch (currentState) {
			case "claim":
				if (!generateTitleMutation.isPending) generateTitleMutation.mutate();
				if (!extractClaimsMutation.isPending) extractClaimsMutation.mutate();
				break;
			case "confidence":
				if (!verifyClaimsMutation.isPending) verifyClaimsMutation.mutate();
				break;
			case "ready":
				break;
		}
	}, [
		currentState,
		extractClaimsMutation,
		generateTitleMutation,
		verifyClaimsMutation,
	]);

	if (
		documentStatusQuery.isLoading ||
		!documentStatusQuery.data ||
		!currentState
	) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<div className="loading loading-dots loading-lg"></div>
			</div>
		);
	} else if (["claim", "confidence"].includes(currentState)) {
		return (
			<NewDocumentProcessing
				state={currentState}
				messages={documentStatusQuery.data?.interClaims}
			/>
		);
	} else {
		return <DocumentClaimContainer id={id} />;
	}
}
