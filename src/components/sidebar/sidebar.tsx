"use client";

import Link from "next/link";
import "./sidebar.css";
import {
	ArrowRightEndOnRectangleIcon,
	CheckBadgeIcon,
	Cog6ToothIcon,
	ExclamationCircleIcon,
	PlusCircleIcon,
	QuestionMarkCircleIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import { docListMock } from "@/mocks/all_mocks";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { asyncSleep } from "@/utils/async_utils";
import { useAuthentication } from "@/hooks/authentication";

function Header() {
	return (
		<div className="">
			<div className="flex flex-row gap-2 mt-4 items-center justify-center text-secondary">
				<CheckBadgeIcon className="w-10 brand-svg" />
				<span className="text-2xl brand-text">Fact Checker</span>
			</div>
		</div>
	);
}

function Actions() {
	return (
		<div className="flex flex-row gap-2 items-center justify-start rounded-lg border border-neutral-800 p-4">
			<Link href={"/"} className="btn btn-primary btn-ghost btn-sm">
				<PlusCircleIcon className="w-6" /> New 
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
		<ul className="menu menu-md rounded-box px-0 gap-3 min-h-0 overflow-y-auto flex-nowrap">
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
							<span className="text-md w-full overflow-hidden whitespace-nowrap text-ellipsis">
								{document.summary}
							</span>
						</Link>
					</li>
					{/* {index < documentList.length - 1 && <div className="divider my-0" />} */}
				</React.Fragment>
			))}
		</ul>
	);
}

export default function Sidebar(props: {}) {
	const authInfo = useAuthentication();
	const { id } = useParams<{ id: string }>();
	const documentListQuery = useQuery({
		queryKey: ["documentList"],
		queryFn: async () => {
			await asyncSleep(1000);
			return docListMock;
		},
		enabled: authInfo.isAuthenticatedOptimistic
	});

	return authInfo.isAuthenticatedOptimistic && (
		<div className={`h-full flex flex-col gap-2 p-4 bg-base-200 w-72 border-r border-neutral-700`}>
			<Header />
			<div className="h-10" />
			<Actions />
			<DocumentList
				activeId={id}
				documentList={documentListQuery.data}
				isLoading={documentListQuery.isLoading}
			/>
			<div className="flex-grow" />
			<div>
				<ul className="menu p-0">
					<li><a><Cog6ToothIcon className="w-3" />Settings</a></li>
					<li><a><ExclamationCircleIcon className="w-3" />About Us</a></li>
					<li><a><QuestionMarkCircleIcon className="w-3" />Feedback</a></li>
				</ul>
			</div>
			<div className="flex items-center gap-4 p-4 rounded-lg border border-neutral-800">
				<div className="avatar">
					<div className="ring-secondary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
						<div className="flex items-center justify-center w-8 h-8">
							<UserIcon className="w-5" />
						</div>
					</div>
				</div>
				<div className="text-md text-ellipsis overflow-hidden whitespace-nowrap">
					{authInfo.username}
				</div>
				<div className="flex-grow" />
				<button className="btn btn-ghost btn-sm btn-square" onClick={authInfo.logout}>
					<ArrowRightEndOnRectangleIcon className="w-6" />
				</button>
			</div>
		</div>
	);
}
