import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import Providers from "./providers";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
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
					<div className="flex flex-row h-full main-bg-gradient">
						<div className="">
							<Sidebar />
						</div>
						<div className="flex-grow p-10">{children}</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
