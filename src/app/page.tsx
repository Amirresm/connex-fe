"use client";

import api from "@/api/api";
import AuthForm from "@/components/auth-form/auth-form";
import DocumentEntry from "@/components/document-entry/document-entry";
import { useAuthentication } from "@/hooks/authentication";
import { NewDocumentType } from "@/models/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";


export default function Home() {
	const router = useRouter();

	const authInfo = useAuthentication();
	const queryClient = useQueryClient();

	const createDocumentMutation = useMutation({
		mutationFn: async (data: NewDocumentType) => {
			const initRes = await api.initDocument(data);
			return initRes;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["documentList"] });
			const target = `/docs/${data.uuid}`;
			router.push(target);
		},
	});

	const handleSubmit = React.useCallback((query: NewDocumentType) => {
		createDocumentMutation.mutate(query);
	}, [createDocumentMutation]);

	if (authInfo.isAuthenticatedOptimistic) {
		return (
			<div className="w-full h-full flex justify-center items-center px-10">
				<DocumentEntry onSubmit={handleSubmit} />
			</div>
		);
	}

	return (
		<div className="w-full h-full flex justify-center items-center px-10">
			<AuthForm />
		</div>
	);
}
