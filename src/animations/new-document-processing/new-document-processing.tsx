import ClaimProcessing from "../claim-processing/claim-processing";
import ConfidenceProcessing from "../confidence-processing/confidence-processing";
import "./new-document-processing.css";

type NewDocumentProcessingProps = {
	state: string;
	messages?: string[];
};

export default function NewDocumentProcessing(
	props: NewDocumentProcessingProps,
) {
	const { state, messages } = props;

	const message =
		state === "claim"
			? ["Extracting ", "Document Claims", " ..."]
			: ["Calculating ", "Confidence Scores", " ..."];

	return (
		<div className="h-full flex flex-col justify-center items-center container">
			<div className="relative h-1/2 artwork">
				<div
					className={`w-full h-full absolute ${state === "claim" ? "fade-in" : "fade-out"}`}
				>
					<ClaimProcessing />
				</div>
				<div
					className={`w-full h-full absolute conf-div ${state === "confidence" ? "fade-in" : "hidden"}`}
				>
					<ConfidenceProcessing messages={messages} />
				</div>
			</div>
			<div className="relative">
				<div className="border border-neutral-700 rounded-lg bg-base-300 glow">
					<span className="text-lg font-bold">{message[0]}</span>
					<span className="text-lg font-bold text-glow">{message[1]}</span>
					<span className="text-lg font-bold">{message[2]}</span>
				</div>
			</div>
		</div>
	);
}
