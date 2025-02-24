import api from "@/api/api";
import { removeToken, retrieveToken } from "@/utils/tokenUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

export function useAuthentication() {
	const queryClient = useQueryClient();
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

	const logout = React.useCallback(() => {
		removeToken();
		queryClient.invalidateQueries({ queryKey: ["auth_info"] });
		queryClient.setQueryData(["auth_info"], null);
	}, [queryClient]);

	return {
		isAuthenticated: !!authInfo.data && !authInfo.error,
		// isAuthenticatedOptimistic: !!authInfo.data || !!retrieveToken() && authInfo.isLoading,
		isAuthenticatedOptimistic: !!authInfo.data,
		hasToken: !!retrieveToken(),
		isLoading: authInfo.isLoading,
		username: authInfo.data?.username,
		logout,
	};
}
