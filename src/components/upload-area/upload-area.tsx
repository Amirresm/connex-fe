"use client";
import { useState } from "react";
import { CustomDragDrop as DNDContainer } from "./dnd-container";

export default function UploadArea() {
	const [files, setFiles] = useState([]);

	function uploadFiles(f) {
		setFiles([...files, ...f]);
	}

	function deleteFile(indexImg: number) {
		const updatedList = files.filter((ele, index) => index !== indexImg);
		setFiles(updatedList);
	}

	return (
		<div className="bg-base-200 shadow rounded-lg w-full px-5 pt-3 pb-5">
			<div className="pb-2 border-b border-base-content">
				<h2 className="text-base-content text-lg font-bold">
					Drag and Drop Container
				</h2>
			</div>
			<DNDContainer
				files={files}
				onUpload={uploadFiles}
				onDelete={deleteFile}
				count={2}
				formats={["jpg", "jpeg", "png"]}
			/>
		</div>
	);
}

