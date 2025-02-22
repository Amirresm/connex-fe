import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/16/solid";
import React from "react";

type DocumentEntryProps = {
	onSubmit?: (query: string) => void;
};

export default function DocumentEntry(props: DocumentEntryProps) {
	const { onSubmit } = props;

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const handleChange = React.useCallback((e: React.ChangeEvent) => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "inherit";
			const maxHeight = Math.max(0, Math.min(200, textareaRef.current.scrollHeight));
			textareaRef.current.style.height = `${maxHeight}px`;
		}
	}, []);

	const handleSubmit = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const query = textareaRef.current?.value || "";
		onSubmit?.(query);
	}, [onSubmit]);

	const handleReset = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (textareaRef.current)
			textareaRef.current.value = "";
	}, []);

	React.useEffect(() => {
		const textarea = textareaRef.current;

		const keypressHandler = (e: KeyboardEvent) => {
			if (textarea && e.key === "Enter" && e.shiftKey) {
				handleSubmit(e as any);
			}
		};
		if (textarea) {
			// textarea.focus();
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
		<div className="w-full">
			<div className="relative textarea bg-base-300 px-5 pt-4 pb-16">
				<textarea
					ref={textareaRef}
					className="resize-none outline-none w-full bg-base-300 text-lg"
					placeholder="Enter document content here..."
					onChange={handleChange}
				></textarea>
				<div className="absolute bottom-3 right-4">
					<div className="flex items-center justify-end gap-2">
						<button className="btn btn-ghost btn-sm" onClick={handleReset}>
							<TrashIcon className="w-5" /> Clear
						</button>
						<button className="btn btn-circle btn-primary btn-md" onClick={handleSubmit}>
							<PaperAirplaneIcon className="w-6" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
