import React from "react";

interface IInlineTextWarningProps {
    children: React.ReactNode;
    show: boolean;
}

export default function InlineTextWarning({
    children,
    show
}: IInlineTextWarningProps) {
    return (
        <div
            style={{ opacity: show ? 1 : 0 }}
            className="transition-all transition-duration-200">
            <small className="text-yellow-500">
                <em>{children}</em>
            </small>
        </div>
    );
}
