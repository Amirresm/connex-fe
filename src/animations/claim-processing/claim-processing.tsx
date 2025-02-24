"use client";

import Lottie from "lottie-react";
import claimAnimation from "../loading-string.json";

export default function ClaimProcessing() {
	return (
		<div className="h-full flex flex-col justify-center items-center">
			<Lottie animationData={claimAnimation} />
		</div>
	);
}
