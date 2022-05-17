import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="main-container">
            <div className="children">{children}</div>
        </main>
    );
};
