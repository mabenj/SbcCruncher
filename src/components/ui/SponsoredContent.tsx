import { Center } from "@chakra-ui/react";
import React from "react";

export default function SponsoredContent({
    id,
    children
}: {
    id?: string;
    children?: React.ReactNode;
}) {
    return (
        <Center id={id} textAlign="center" position="relative">
            {children}
        </Center>
    );
}
