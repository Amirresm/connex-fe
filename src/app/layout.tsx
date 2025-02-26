import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import Providers from "./providers";
import AuthProvider from "./auth-provider";

export const metadata: Metadata = {
	title: "Fact Checker",
	description: "Fact Checker",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="w-screen h-screen">
				<Providers>
					<AuthProvider>
						<div className="flex flex-row h-full main-bg-gradient">
							<div className="">
								<Sidebar />
							</div>
							<div className="flex-grow p-4">{children}</div>
						</div>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
