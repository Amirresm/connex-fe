"use client";

function DocumentEntry() {
	return (
		<div className="flex flex-col gap-4">
			<div>
				<textarea
					className="textarea resize-none w-full bg-base-200"
					placeholder="Type Here"
				></textarea>
				<div className="flex justify-end gap-2">
					<button className="btn btn-ghost">Reset</button>
					<button className="btn btn-primary">Submit</button>
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<div className="p-10">
			<DocumentEntry />
		</div>
	);
}
