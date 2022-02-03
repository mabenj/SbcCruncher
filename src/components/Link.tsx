import React from "react";

interface ILinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	openInSameTab?: boolean;
}

export default function Link({
	href,
	children,
	className,
	openInSameTab = false
}: ILinkProps) {
	return (
		<a
			href={href}
			target={openInSameTab ? "_self" : "_blank"}
			rel="noreferrer"
			className={className}>
			{children}
		</a>
	);
}
