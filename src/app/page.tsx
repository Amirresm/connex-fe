"use client";

import DocumentEntry from "@/components/document-entry/document-entry";
import { useRouter } from "next/navigation";
import React from "react";


export default function Home() {
	const router = useRouter();

	const handleSubmit = React.useCallback((query: string) => {
		console.log(query);
		const id = Math.round(Math.random() * 200);
		const target = `/docs/${id}`;
		router.push(target);
	}, [router]);

	return (
		<div className="w-full h-full flex justify-center items-center px-10">
			<DocumentEntry onSubmit={handleSubmit} />
		</div>
	);
}
