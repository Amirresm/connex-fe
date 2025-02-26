"use client";

import Lottie from "lottie-react";
// import confidenceAnimation from "./confidence-process.json";
import confidenceAnimation from "../loading-circle.json";
import React from "react";
import { shuffle } from "lodash";
import "./confidence-processing.css";

export default function ConfidenceProcessing({
	messages,
}: {
	messages?: string[];
}) {
	const [visibleIndex, setVisibleIndex] = React.useState(0);

	const messagesData = React.useMemo(() => {
		if (!messages) return [];
		setVisibleIndex(messages.length);
		const span = 100;
		return shuffle(
			messages?.map((message, index) => ({
				message,
				x: Math.random() * span - span / 2,
				y: Math.random() * span - span / 2,
			})),
		);
	}, [messages]);

	React.useEffect(() => {
		setTimeout(() => {
			setVisibleIndex(messagesData.length - 1);
		}, 100);
		const interval = setInterval(() => {
			setVisibleIndex((prev) => (prev > 0 ? prev - 1 : messagesData.length));
		}, 2000);
		return () => {
			clearInterval(interval);
		};
	}, [messagesData]);

	return (
		<div className="relative h-full flex flex-col justify-center items-center">
			<Lottie
				animationData={confidenceAnimation}
				style={{ width: 500, height: 500 }}
			/>
			<div className="absolute w-full h-full flex justify-center items-center">
				{messagesData.map(({ message, x, y }, index) => (
					<div
						key={index}
						style={{ marginTop: `${y}%`, marginLeft: `${x}%` }}
						className={`message ${
							index >= visibleIndex ? "message-in message-idle" : "message-out"
						}`}
					>
						{message}
					</div>
				))}
			</div>
		</div>
	);
}
