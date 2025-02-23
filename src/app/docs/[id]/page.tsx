"use client";

import DocumentEntry from "@/components/document-entry/document-entry";
import ClaimList from "@/components/document/claim-list/claim-list";
import { sampleClaimListMock, sampleDocMock } from "@/mocks/all_mocks";
import { asyncSleep } from "@/utils/async_utils";
import {
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type DocumentDisplayProps = {
	documentSource?: string;
	isLoading?: boolean;
};

function DocumentDisplay(props: DocumentDisplayProps) {
	const { documentSource, isLoading } = props;
	return isLoading || !documentSource ? (
		<div className="w-full h-full flex flex-col gap-4">
			<div className="skeleton w-full h-6" />
			<div className="skeleton w-full h-6" />
			<div className="skeleton w-full h-6" />
		</div>
	) : (
		<div className="rounded-3xl bg-base-300 w-full h-full py-2 px-4 overflow-y-scroll border border-neutral-800">
			<span className="text-sm whitespace-pre-wrap">{documentSource}</span>
		</div>
	);
}

export default function DocumentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const documentSourceQuery = useQuery({
		queryKey: ["documentSource", id],
		queryFn: async () => {
			await asyncSleep(1000);
			return sampleDocMock.ground_truth;
		},
	});
	const claimListQuery = useQuery({
		queryKey: ["claimList", id],
		queryFn: async () => {
			await asyncSleep(1000);
			return sampleClaimListMock;
		},
	});

	const [collapsed, setCollapsed] = React.useState(true);

	const handleCollapse = React.useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	return (
		<div className="h-full flex flex-col gap-2">
			<div className="flex-1 min-h-0">
				<ClaimList claimList={claimListQuery.data} />
			</div>
			<div
				className={`divider ${collapsed ? "" : "divider-info"} flex items-center justify-center cursor-pointer`}
				onClick={handleCollapse}
			>
				<label className="cursor-pointer swap swap-rotate">
					<input
						type="checkbox"
						checked={collapsed}
						onChange={handleCollapse}
					/>
					<ChevronDoubleUpIcon className="w-4 swap-on" />
					<ChevronDoubleDownIcon className="w-4 swap-off text-info" />
				</label>
			</div>
			<div
				className={`flex flex-col gap-4 items-center ${collapsed ? "h-1/6 basis-1/6" : "h-1/2 basis-1/2"} transition-all duration-300`}
			>
				<div className="mx-auto">Source Document</div>
				<DocumentDisplay documentSource={documentSourceQuery.data} isLoading={documentSourceQuery.isLoading} />
			</div>
		</div>
	);
}
