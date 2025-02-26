"use client";
import * as React from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
	QueryClient,
	defaultShouldDehydrateQuery,
	isServer,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import api, { FetchError } from "@/api/api";
import { retrieveToken } from "@/utils/tokenUtils";

function makeQueryClient() {
	const qc = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
			dehydrate: {
				// include pending queries in dehydration
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
		},
	});
	return qc;
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		return makeQueryClient();
	} else {
		// Browser: make a new query client if we don't already have one
		// This is very important, so we don't re-make a new client if React
		// suspends during the initial render. This may not be needed if we
		// have a suspense boundary BELOW the creation of the query client
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	const router = useRouter();

	React.useEffect(() => {
		console.log("Setting default options");
		queryClient.setDefaultOptions({
			mutations: {
				onError: (err) => {
					console.log("From mutation error", err);
					if (err instanceof FetchError && err.status === 401) {
						router.replace("/");
					} else {
						throw err;
					}
				},
			},
		});
	}, [queryClient, router]);

	// React.useEffect(() => {
	// 	function detectColorScheme() {
	// 		let theme = "light"; //default to light

	// 		if (localStorage.getItem("theme")) {
	// 			if (localStorage.getItem("theme") == "dark") {
	// 				theme = "dark";
	// 			}
	// 		} else if (!window.matchMedia) {
	// 			return false;
	// 		} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
	// 			theme = "dark";
	// 		}

	// 		if (theme == "dark") {
	// 			document.documentElement.setAttribute("data-theme", "dark");
	// 		}
	// 	}
	// 	detectColorScheme();
	// }, []);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
