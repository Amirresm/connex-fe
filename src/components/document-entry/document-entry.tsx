import { NewDocumentType } from "@/models/document";
import { TrashIcon } from "@heroicons/react/16/solid";
import { ArrowLeftIcon, ArrowRightIcon, CloudArrowUpIcon } from "@heroicons/react/24/solid";
import React from "react";

type DocumentEntryProps = {
	onSubmit?: (data: NewDocumentType) => void;
};

export default function DocumentEntry(props: DocumentEntryProps) {
	const { onSubmit } = props;

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const dataRef = React.useRef<{ doc: string; ground: string }>({
		doc: "",
		ground: "",
	});

	const [step, setStep] = React.useState(1);

	const handleChange = React.useCallback((e: React.ChangeEvent) => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "inherit";
			const maxHeight = Math.max(
				0,
				Math.min(500, textareaRef.current.scrollHeight),
			);
			textareaRef.current.style.height = `${maxHeight}px`;
		}
	}, []);

	const handleSubmit = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			const query = textareaRef.current?.value || "";
			if (step === 1) {
				dataRef.current.doc = query;
				if (textareaRef.current) textareaRef.current.value = "";
				setStep(2);
				handleChange(null as any);
				return;
			}
			dataRef.current.ground = query;
			onSubmit?.({
				document: dataRef.current.doc,
				groundTruth: dataRef.current.ground
			});
		},
		[onSubmit, step, handleChange],
	);

	const handleReset = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			if (textareaRef.current) textareaRef.current.value = "";
			dataRef.current.doc = "";
			dataRef.current.ground = "";
			setStep(1);
			handleChange(null as any);
		},
		[handleChange],
	);

	const handleBack = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			setStep(1);
			if (textareaRef.current) textareaRef.current.value = dataRef.current.doc;
			dataRef.current.ground = "";
			handleChange(null as any);
		},
		[],
	);

	React.useEffect(() => {
		const textarea = textareaRef.current;

		const keypressHandler = (e: KeyboardEvent) => {
			if (textarea && e.key === "Enter" && e.shiftKey) {
				handleSubmit(e as any);
			}
		};
		if (textarea) {
			textarea.focus();
			textarea.onkeydown = keypressHandler;
		}
		return () => {
			if (textarea) {
				textarea.removeEventListener("keydown", keypressHandler);
			}
		};
	}, [handleSubmit]);

	React.useLayoutEffect(() => {
		handleChange(null as any);
	}, [handleChange]);

	return (
		<div className="w-full max-w-[1000px]">
			<div className="relative rounded-3xl border border-neutral-800 bg-base-200 px-5 pt-4 pb-16">
				<textarea
					ref={textareaRef}
					className="resize-none outline-none w-full bg-base-200 text-lg mx-1"
					placeholder={
						step === 1 ? "Enter document content" : "Enter ground truth content"
					}
					onChange={handleChange}
				></textarea>
				<div className="absolute bottom-3 right-4">
					<div className="flex items-center justify-end gap-2">
						<button className="btn btn-ghost btn-sm" onClick={handleReset}>
							<TrashIcon className="w-5" /> Clear
						</button>
						<button
							className={`btn btn-circle btn-ghost btn-md transition-all ${step === 2 ? "" : "w-0"}`}
							onClick={handleBack}
						>
							<ArrowLeftIcon className="w-6" />
						</button>
						<button
							className="btn btn-circle btn-primary btn-md"
							onClick={handleSubmit}
						>
							{step === 1 ? (
								<ArrowRightIcon className="w-6" />
							) : (
								<CloudArrowUpIcon className="w-6" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
