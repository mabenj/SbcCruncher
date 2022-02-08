import React from "react";

interface ILinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	openInSameTab?: boolean;
	style?: React.CSSProperties;
}

export function Link({
	href,
	children,
	className,
	openInSameTab = false,
	style
}: ILinkProps) {
	return (
		<a
			href={href}
			target={openInSameTab ? "_self" : "_blank"}
			rel="noreferrer"
			className={className}
			style={style}>
			{children}
		</a>
	);
}
