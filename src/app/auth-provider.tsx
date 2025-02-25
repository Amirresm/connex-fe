"use client";

import api, { FetchError } from "@/api/api";
import { removeToken, retrieveToken } from "@/utils/tokenUtils";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [intiated , setInitiated] = React.useState(false);

	const authInfo = useQuery<{
		username: string
	}>({
		queryKey: ["auth_info"],
		queryFn: async () => {
			const response = await api.fetchAuth();
			return response;
		},
		enabled: () => !!retrieveToken(),
	});

	React.useEffect(() => {
		setInitiated(true);
		if (authInfo.error && authInfo.error instanceof FetchError && authInfo.error.status === 401 && pathname !== "/") {
			console.log("Invalidating token");
			removeToken();
			router.push("/");
		}
	}, [authInfo.data, authInfo.error, pathname, router]);

	if (!intiated || authInfo.isLoading) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<span className="loading loading-lg" />
			</div>
		);
	}

	return <>{children}</>;
}

