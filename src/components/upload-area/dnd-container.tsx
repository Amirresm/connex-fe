import React, { useRef, useEffect, useState, HTMLInputTypeAttribute } from "react";
import { ArrowUpTrayIcon, DocumentIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";

export function CustomDragDrop({
	files,
	onUpload,
	onDelete,
	count,
	formats
}: {
	files: any[],
	onUpload: (files: any) => void,
	onDelete: (index: number) => void,
	count: number,
	formats: string[]
}) {
	const dropContainer = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const fileRef = useRef(null);

	function handleDrop(e: React.ChangeEvent<HTMLInputElement>, type: string) {
		let localFiles;
		if (type === "inputFile") {
			localFiles = [...e.target.files];
		} else {
			e.preventDefault();

			e.stopPropagation();

			setDragging(false);

			localFiles = [...e.dataTransfer.files];
		}

		const allFilesValid = localFiles.every((file) => {
			return formats.some((format) => file.type.endsWith(`/${format}`));
		});

		if (!allFilesValid) {
			showAlert(
				"warning",
				"Invalid Media",
				`Invalid file format. Please only upload ${formats
					.join(", ")
					.toUpperCase()}`
			);
			return;
		}
		if (count && count < localFiles.length + files.length) {
			showAlert(
				"error",
				"Error",
				`Only ${count} file${count !== 1 ? "s" : ""} can be uploaded at a time`
			);
			return;
		}

		if (localFiles && localFiles.length) {
			const nFiles = localFiles.map(async (file) => {
				const base64String = await convertFileBase64(file);
				return {
					name: file.name,
					photo: base64String,
					type: file.type,
					size: file.size
				};
			});

			Promise.all(nFiles).then((newFiles) => {
				onUpload(newFiles);
			});
		}
	}

	async function convertFileBase64(file: File) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	}

	useEffect(() => {
		function handleDragOver(e: React.DragEvent) {
			e.preventDefault();
			e.stopPropagation();
			setDragging(true);
		}
		function handleDragLeave(e: React.DragEvent) {
			e.preventDefault();
			e.stopPropagation();
			setDragging(false);
		}
		dropContainer.current.addEventListener("dragover", handleDragOver);
		dropContainer.current.addEventListener("drop", handleDrop);
		dropContainer.current.addEventListener("dragleave", handleDragLeave);

		return () => {
			if (dropContainer.current) {
				dropContainer.current.removeEventListener("dragover", handleDragOver);
				dropContainer.current.removeEventListener("drop", handleDrop);
				dropContainer.current.removeEventListener("dragleave", handleDragLeave);
			}
		};
	}, [files]);

	function showAlert(icon, title, text) {
		console.log("Alert", title, text)
	}

	function showImage(image) {
		console.log("image")
	}

	return (
		<>
			<div
				className={`${dragging
					? "border border-blue-600 bg-base-100"
					: "border-dashed border-base-content"
					} flex items-center justify-center mx-auto text-center border rounded-md mt-4 py-5`}
				ref={dropContainer}
			>
				<div className="flex-1 flex flex-col">
					<div className="mx-auto text-gray-400 mb-2">
						<ArrowUpTrayIcon />
					</div>
					<div className="text-xs font-normal text-base-content">
						<input
							className="opacity-0 hidden"
							type="file"
							multiple
							accept="image/*"
							ref={fileRef}
							onChange={(e) => handleDrop(e, "inputFile")}
						/>
						<span
							className="text-blue-600 cursor-pointer"
							onClick={() => {
								fileRef.current.click();
							}}
						>
							Click to upload
						</span>{" "}
						or drag and drop
					</div>
					<div className="text-xs font-normal text-base-content">
						Only two files PNG, JPG or JPEG
					</div>
				</div>
			</div>

			{files.length > 0 && (
				<div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4">
					{files.map((img, index) => (
						<div key={index} className="w-full px-3 py-3 rounded-md bg-base-100 flex justify-between items-center">
								<div className="w-2/3 flex justify-start items-center space-x-2">
									<div
										className="text-primary cursor-pointer"
										onClick={() => showImage(img.photo)}
									>
										{img.type.match(/image.*/i) ? (
											<PhotoIcon className="w-10" />
										) : (
											<DocumentIcon className="w-10" />
										)}
									</div>
									<div className="space-y-1">
										<div className="text-sm font-medium text-gray-400">
											{img.name}
										</div>
										<div className="text-[10px] font-medium text-gray-500">{`${Math.floor(
											img.size / 1024
										)} KB`}</div>
									</div>
								</div>
								<div className="flex-1 flex justify-end">
									<div
										className="text-gray-500 cursor-pointer"
										onClick={() => onDelete(index)}
									>
										<XMarkIcon className="ml-auto w-8" />
									</div>
								</div>
						</div>
					))}
				</div>
			)}
		</>
	);
}

