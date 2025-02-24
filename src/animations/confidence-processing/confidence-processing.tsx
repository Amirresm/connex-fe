"use client";

import Lottie from "lottie-react";
// import confidenceAnimation from "./confidence-process.json";
import confidenceAnimation from "../loading-string.json";

export default function ConfidenceProcessing() {
	return (
		<div className="h-full flex flex-col justify-center items-center">
			<Lottie animationData={confidenceAnimation} />
		</div>
	);
}
