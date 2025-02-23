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
	const pathname = usePathname();

	React.useEffect(() => {
		queryClient.setDefaultOptions({
			mutations: {
				onError: (err) => {
					console.log("From mutation error", err);
					if (err instanceof FetchError && err.status === 401) {
						router.replace("/");
					}
				}
			}
		});

		// (async () => {
		// 	console.log("Prefetching auth info");
		// 	console.log("Query client", queryClient.getQueryData(["auth_info"]));
		// 	await queryClient.prefetchQuery({
		// 		queryKey: ["auth_info"],
		// 		queryFn: async () => {
		// 			const response = await api.fetchAuth();
		// 			return response;
		// 		}
		// 	});
		// })();
	}, [queryClient, router]);

	const authInfo = queryClient.getQueryData(["auth_info"]);

	React.useEffect(() => {
		if (!authInfo && pathname !== "/") {
			router.replace("/");
		}
	}, [authInfo, pathname, router]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
