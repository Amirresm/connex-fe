"use client";

import DocumentEntry from "@/components/document-entry/document-entry";
import ClaimList from "@/components/document/claim-list/claim-list";
import { sampleClaimListMock, sampleDocMock } from "@/mocks/all_mocks";
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import React from "react";

type DocumentDisplayProps = {
	documentSource: string;
};

function DocumentDisplay(props: DocumentDisplayProps) {
	const { documentSource } = props;
	return (
		<div className="textarea bg-base-300 w-full h-full overflow-y-scroll">
			<pre className="text-sm whitespace-pre-wrap">{documentSource}</pre>
		</div>
	);
}

export default function DocumentPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = React.use(params);

	const documentSource = sampleDocMock;
	const claimList = sampleClaimListMock;

	const [collapsed, setCollapsed] = React.useState(true);

	const handleCollapse = React.useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	return (
		<div className="h-full flex flex-col gap-2">
			<div className="flex-1 min-h-0">
				<ClaimList claimList={claimList} />
			</div>
			<div className={`divider ${collapsed ? "" : "divider-info"} flex items-center justify-center cursor-pointer`} onClick={handleCollapse}>
				<label className="cursor-pointer swap swap-rotate">
					<input type="checkbox" checked={collapsed} onChange={handleCollapse} />
					<ChevronDoubleUpIcon className="w-4 swap-on" />
					<ChevronDoubleDownIcon className="w-4 swap-off text-info" />
				</label>
			</div>
			<div className={`flex flex-col items-center ${collapsed ? "max-h-36 basis-36" : "max-h-[1000px] basis-1/2"} transition-all duration-300`}>
				<div className="mx-auto">Source Document</div>
				<DocumentDisplay documentSource={documentSource.ground_truth} />
			</div>
		</div>
	);
}
