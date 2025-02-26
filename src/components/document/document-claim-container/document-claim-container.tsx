import React from "react";

import ClaimList from "@/components/document/claim-list/claim-list";
import {
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import "./document-claim-container.css";

type DocumentHeaderProps = {
	title?: string;
	isLoading?: boolean;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
};

function DocumentHeader(props: DocumentHeaderProps) {
	const { onSearchQueryChange } = props;
	const handleSearchQueryChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onSearchQueryChange(e.target.value);
		},
		[onSearchQueryChange],
	);

	return (
		<div className="h-12 p-3 bg-base-100 rounded-lg flex justify-center items-center gap-3">
			{props.isLoading ? (
				<div className="w-72 h-6 skeleton rounded-sm" />
			) : (
				<h1 className="text-xl font-bold">{props.title}</h1>
			)}
			<div className="flex-1" />
			<label className="input input-sm input-bordered flex items-center gap-2">
				<MagnifyingGlassIcon className="w-5" />
				<input
					type="text"
					className="grow"
					placeholder="Search"
					value={props.searchQuery}
					onChange={handleSearchQueryChange}
				/>
			</label>
		</div>
	);
}

type DocumentDisplayProps = {
	documentSource?: string;
	groundTruth?: string;
	isLoading?: boolean;
};

function DocumentDisplay(props: DocumentDisplayProps) {
	const { documentSource, groundTruth, isLoading } = props;
	const [mode, setMode] = React.useState<"document" | "ground-truth">(
		"document",
	);

	return isLoading || !documentSource ? (
		<div className="w-full h-full flex flex-col gap-4">
			<div className="skeleton w-full h-6" />
			<div className="skeleton w-full h-6" />
			<div className="skeleton w-full h-6" />
		</div>
	) : (
		<div className="h-full w-full flex flex-col">
			<div className="flex items-center justify-start gap-4 mb-2">
				<div className="">
					<ul className="menu menu-horizontal gap-2">
						<li onClick={() => setMode("document")}>
							<a className={mode === "document" ? "btn-custom-active" : ""}>
								Document
							</a>
						</li>
						<li onClick={() => setMode("ground-truth")}>
							<a className={mode === "ground-truth" ? "btn-custom-active" : ""}>
								Ground Truth
							</a>
						</li>
					</ul>
				</div>
				{/* <div className="dropdown"> */}
				{/* 	<div tabIndex={0} role="button" className="btn btn-sm m-1">Viewing {mode === "document" ? "Document" : "Ground Truth"}</div> */}
				{/* 	<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"> */}
				{/* 		<li onClick={() => setMode("document")}><a>Document</a></li> */}
				{/* 		<li onClick={() => setMode("ground-truth")}><a>Ground Truth</a></li> */}
				{/* 	</ul> */}
				{/* </div> */}
			</div>
			<div className="rounded-3xl bg-base-200 w-full h-full py-2 px-4 overflow-y-auto border border-neutral-800">
				<span className="text-md whitespace-pre-wrap">
					{mode === "document" ? documentSource : groundTruth}
				</span>
			</div>
		</div>
	);
}

type DocumentClaimContainerProps = { id: string };

export default function DocumentClaimContainer(
	props: DocumentClaimContainerProps,
) {
	const { id } = props;
	const [searchQuery, setSearchQuery] = React.useState("");

	const documentQuery = useQuery({
		queryKey: ["document", id],
		queryFn: async ({ queryKey }) => {
			const data = await api.fetchDocument(queryKey[1]);
			return data;
		},
	});

	const [collapsed, setCollapsed] = React.useState(true);

	const handleCollapse = React.useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	const claims = React.useMemo(() => {
		if (!documentQuery.data?.claims) return [];
		if (!searchQuery) return documentQuery.data.claims;
		return documentQuery.data.claims.filter((claim) =>
			claim.claim.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [documentQuery.data?.claims, searchQuery]);

	return (
		<div className="h-full flex flex-col gap-1">
			<DocumentHeader
				title={documentQuery.data?.document_title}
				isLoading={documentQuery.isLoading}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
			/>
			<div className="flex-1 min-h-0">
				<ClaimList
					claimList={claims}
					isLoading={documentQuery.isLoading}
					emptyMessage={
						searchQuery
							? "No claims found, clear search to show all"
							: "No claims extracted"
					}
				/>
			</div>
			<div
				className={`divider ${collapsed ? "" : "divider-info"} flex items-center justify-center cursor-pointer mb-1`}
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
				className={`flex flex-col gap-4 items-center ${collapsed ? "h-1/5 basis-1/5" : "h-1/2 basis-1/2"} transition-all duration-300`}
			>
				<DocumentDisplay
					documentSource={documentQuery.data?.document_content}
					groundTruth={documentQuery.data?.ground_truth}
					isLoading={documentQuery.isLoading}
				/>
			</div>
		</div>
	);
}
