import { range } from "lodash";
import { ClaimType } from "@/models/claim";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import React from "react";

type ClaimListProps = {
	claimList?: ClaimType[];
	isLoading?: boolean;
	emptyMessage: string;
};

const confidenceColors = {
	0: " text-red-600",
	20: " text-amber-600",
	40: "text-yellow-600",
	60: "text-lime-600",
	80: "text-green-500",
};
const confidenceColor = (confidence: number) => {
	return Object.entries(confidenceColors).reduce<string>(
		(acc, [key, value]) => {
			return confidence >= parseInt(key) ? value : acc;
		},
		"",
	);
};

function ClaimListSkeleton() {
	return range(5).map((i) => (
		<tr key={i}>
			<th>
				<div className="skeleton w-6 h-8" />
			</th>
			<td>
				<div className="skeleton w-12 h-12 rounded-full" />
			</td>
			<td className="w-full min-w-0">
				<div className="skeleton w-full h-8" />
			</td>
			<td>
				<div className="skeleton w-12 h-8" />
			</td>
		</tr>
	));
}

export default function ClaimList(props: ClaimListProps) {
	const { claimList, isLoading, emptyMessage } = props;

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto rounded-xl bg-base-100 px-2">
			<table className="table table-pin-rows">
				<thead>
					<tr className="text-neutral-400">
						<th></th>
						<th className="text-center">Confidence</th>
						<th>Claim</th>
						<th className="text-center">Rate</th>
					</tr>
				</thead>
				<tbody>
					{isLoading || !claimList ? (
						<ClaimListSkeleton />
					) : (
						claimList.map((claim, index) => (
							<tr key={claim.claim} className="hover">
								<th><span className="block w-6">{index + 1}</span></th>
								<td>
									<div
										className={`radial-progress text-sm ${confidenceColor(claim.confidence)}`}
										style={{
											"--value": claim.confidence,
											"--size": "3rem",
											"--thickness": "3px",
										}}
									>
										{claim.confidence}%
									</div>
								</td>
								<td className="text-md w-full min-w-0 overflow-hidden text-ellipsis">
									{claim.claim}
								</td>
								<td>
									<div className="flex items-center gap-2">
										<button className="btn btn-square">
											<HandThumbUpIcon className="w-4" />
										</button>
										<button className="btn btn-square">
											<HandThumbDownIcon className="w-4" />
										</button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
			{claimList?.length === 0 && (
				<div className="w-full h-full flex items-center justify-center">
					{emptyMessage}
				</div>
			)}
		</div>
	);
}
