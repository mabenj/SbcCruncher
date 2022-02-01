import React from "react";

interface ILinkProps {
	href: string;
	children: React.ReactNode;
}

export default function Link({ href, children }: ILinkProps) {
	return (
		<a href={href} target="_blank" rel="noreferrer">
			{children}
		</a>
	);
}
