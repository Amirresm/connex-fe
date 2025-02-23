import Lottie from "lottie-react";
import claimAnimation from "./claim-process.json";

export default function ClaimProcessing() {
	return (
		<div className="h-full flex flex-col justify-center items-center">
			<Lottie animationData={claimAnimation} />
		</div>
	);
}
