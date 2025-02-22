import { ClaimType } from "@/models/claim";
import React from "react";

type ClaimListProps = {
	claimList: ClaimType[];
}

const confidenceColors = {
	0: " text-red-600",
	20: " text-amber-600",
	40: "text-yellow-600",
	60: "text-lime-600",
	80: "text-green-500",
};
const confidenceColor = (confidence: number) => {
	return Object.entries(confidenceColors).reduce<string>((acc, [key, value]) => {
		return confidence >= parseInt(key) ? value : acc;
	}, "");
};

export default function ClaimList(props: ClaimListProps) {
	const { claimList } = props;

	return (
		<div className="w-full h-full overflow-y-scroll">
			<ul className="rounded-box p-0">
				{claimList.map((claim) => (
					<React.Fragment key={claim.id}>
						<li className="w-full flex gap-8 items-center">
							<div
								className={`radial-progress text-sm ${confidenceColor(claim.confidence)}`}
								style={{ "--value": claim.confidence, "--size": "3rem", "--thickness": "3px" }}
							>
								{claim.confidence}%
							</div>
							<span className="text-md w-full overflow-hidden whitespace-nowrap text-ellipsis">{claim.claim}</span>
						</li>
						<div className="divider divider-neutral mx-20" />
					</React.Fragment>
				))}
			</ul>
		</div>
	);
}
