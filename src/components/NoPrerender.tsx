import React from "react";

export default function NoPrerender({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{navigator.userAgent === "ReactSnap" ? null : children}</>;
}
