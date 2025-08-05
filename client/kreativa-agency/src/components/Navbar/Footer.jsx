import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faBehance } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
	return (
		<div>
			<hr className=" m-0" style={{ borderColor: "#110d27" }} />

			<div className="container">
				<footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4">
					<div className="col-md-4 d-flex align-items-center">
						<a
							href="/"
							className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
							aria-label="Kreativa Agency"
						>
							<img
								src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png"
								alt="Kreativa Agency Logo"
								width="35"
								style={{ objectFit: "contain" }}
							/>
						</a>
						<span className="mb-3 mb-md-0 text-body-secondary">
							© 2025 Kreativa Agency
						</span>
					</div>

					<ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
						<li className="ms-3">
							<a
								className="text-body-secondary"
								href="https://www.instagram.com/kreativa_agency_/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<FontAwesomeIcon
									icon={faInstagram}
									size="lg"
									style={{ color: "#110d27" }}
								/>
							</a>
						</li>
						<li className="ms-3">
							<a
								className="text-body-secondary"
								href="https://www.behance.net/kreativaagency"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Behance"
							>
								<FontAwesomeIcon
									icon={faBehance}
									size="lg"
									style={{ color: "#110d27" }}
								/>
							</a>
						</li>
					</ul>
				</footer>
			</div>
		</div>
	);
}
