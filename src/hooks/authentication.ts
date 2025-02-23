import api, { FetchError } from "@/api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

export function useAuthentication() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const authInfo = useQuery<{
		username: string
	}>({
		queryKey: ["auth_info"],
		queryFn: async () => {
			const response = await api.fetchAuth();
			return response;
		},
		retry: false,
	});

	React.useEffect(() => {
		if (authInfo.error && authInfo.error instanceof FetchError && authInfo.error.status === 401) {
			console.log(authInfo.data);
			router.push("/");
		}
	}, [authInfo.error, router]);

	const logout = React.useCallback(() => {
		localStorage.removeItem("token");
		queryClient.invalidateQueries({ queryKey: ["auth_info"] });
		queryClient.setQueryData(["auth_info"], null);
	}, [queryClient]);

	return {
		isAuthenticated: !!authInfo.data,
		isAuthenticatedOptimistic: !!authInfo.data || !!localStorage.getItem("token") && authInfo.isLoading,
		hasToken: !!localStorage.getItem("token"),
		isLoading: authInfo.isLoading,
		username: authInfo.data?.username,
		logout,
	};
}
