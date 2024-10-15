import React from "react";
import { XIcon } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null;

	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={handleOutsideClick}
		>
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
				<button
					className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
					onClick={onClose}
				>
					<XIcon size={24} />
				</button>
				{children}
			</div>
		</div>
	);
}
