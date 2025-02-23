"use client";

import Link from "next/link";
import "./sidebar.css";
import {
	ArrowUpTrayIcon,
	HomeIcon,
	CheckBadgeIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { docListMock } from "@/mocks/all_mocks";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { asyncSleep } from "@/utils/async_utils";

function Header() {
	return (
		<div className="">
			<div className="flex flex-row gap-2 mx-2 items-center justify-center text-secondary">
				<CheckBadgeIcon className="w-6" />
				<span className="text-md">Fact Checker</span>
			</div>
		</div>
	);
}

function Actions() {
	return (
		<div className="flex flex-row gap-2 mx-4 mt-8 items-center justify-center">
			<Link href={"/"} className="btn btn-primary btn-outline">
				<PlusCircleIcon className="w-8" /> New Document
			</Link>
		</div>
	);
}

function ModeSelect() {
	return "Mode";
}

type DocumentListProps = {
	documentList?: any[];
	activeId: string;
	isLoading?: boolean;
};

function DocumentList(props: DocumentListProps) {
	const { documentList, activeId, isLoading } = props;

	return isLoading || !documentList ? (
		<div className="w-full h-1/2 flex items-center justify-center">
			<span className="loading loading-ring loading-lg" />
		</div>
	) : (
		<ul className="menu menu-md rounded-box p-0">
			{documentList.map((document, index) => (
				<React.Fragment key={document.id}>
					<li
						className="w-full document-list-item"
						style={{ "--index": index }}
					>
						<Link
							className={document.id === activeId ? "active" : ""}
							href={`/docs/${document.id}`}
						>
							<span className="text-xs w-full overflow-hidden whitespace-nowrap text-ellipsis">
								{document.summary}
							</span>
						</Link>
					</li>
					{index < documentList.length - 1 && <div className="divider my-0" />}
				</React.Fragment>
			))}
		</ul>
	);
}

export default function Sidebar(props: {}) {
	const { id } = useParams<{ id: string }>();
	const documentListQuery = useQuery({
		queryKey: ["documentList"],
		queryFn: async () => {
			await asyncSleep(1000);
			return docListMock;
		},
	});

	return (
		<div className="h-full flex flex-col gap-4 p-4 bg-base-300 w-[260px] border-r border-neutral-700">
			<Header />
			<Actions />
			<DocumentList
				activeId={id}
				documentList={documentListQuery.data}
				isLoading={documentListQuery.isLoading}
			/>
		</div>
	);
}
