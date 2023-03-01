import { Box } from "@chakra-ui/react";
import React from "react";

export default function MutedSmall(props: { children: React.ReactNode }) {
    return (
        <Box position="relative" fontSize="sm" color={"gray.500"}>
            {props.children}
        </Box>
    );
}
