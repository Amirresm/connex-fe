"use client";

import Link from "next/link";
import "./sidebar.css";
import { ArrowUpTrayIcon, HomeIcon, CheckBadgeIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { docListMock } from "@/mocks/all_mocks";
import React from "react";

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

	return (
		"Mode"
	);
}

function DocumentList({ documentList }: { documentList: any[] }) {
	return (
		<ul className="menu menu-md rounded-box p-0">
			{documentList.map((document, index) => (
				<React.Fragment key={document.id}>
					<li className="w-full">
						<Link href={`${document.id}`}>
							<span className="text-xs w-full overflow-hidden whitespace-nowrap text-ellipsis">{document.summary}</span>
						</Link>
					</li>
					{index < documentList.length - 1 && <div className="divider my-0" />}
				</React.Fragment>
			))}
		</ul>
	);
}

export default function Sidebar(props: {}) {
	const sidebarItems = docListMock;

	return (
		<div className="routes-container">
			<Header />
			<Actions />
			<DocumentList documentList={sidebarItems} />
		</div>
	);
}
