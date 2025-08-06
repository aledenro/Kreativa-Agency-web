import React from "react";
import { BouncyArc } from "ldrs/react";
import "ldrs/react/BouncyArc.css";

const Loading = ({
	size = "70",
	speed = "1.65",
	color = "#ff0072",
	text = "Cargando...",
	showText = true,
	className = "",
	fullScreen = false,
}) => {
	const containerClasses = fullScreen
		? "position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center pt-5"
		: "d-flex flex-column align-items-center justify-content-center p-4 pt-5";

	return (
		<div className={`${containerClasses} ${className}`}>
			<BouncyArc size={size} speed={speed} color={color} />
			{showText && (
				<p
					className="mt-3 text-muted small fw-medium"
					style={{ fontFamily: "Francy, Century, serif", fontSize: "25px" }}
				>
					{text}
				</p>
			)}
		</div>
	);
};

export default Loading;
