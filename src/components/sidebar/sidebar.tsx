"use client";

import Link from "next/link"
import "./sidebar.css"
import { ArrowUpTrayIcon, HomeIcon } from "@heroicons/react/24/solid";

function ModeSelect() {

	return (
		"Mode"
	)
}

export default function Sidebar(props: {}) {

	const routes = [
		{ name: "Home", path: "/", decoration: HomeIcon },
		{ name: "Upload", path: "/upload", decoration: ArrowUpTrayIcon },
	]
	return (
		<div className="routes-container">
			<ModeSelect />
			<ul className="menu rounded-box">
				{routes.map((route, index) => (
					<li key={route.name}>
						<Link href={route.path}>
							<route.decoration className="w-5 mr-2"/>
							{route.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
