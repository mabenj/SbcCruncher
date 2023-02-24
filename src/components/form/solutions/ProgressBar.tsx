import { Box, Progress } from "@chakra-ui/react";

export default function ProgressBar({ percent }: { percent: number }) {
    return (
        <Box position="absolute" top={0} left={0} right={0} p={0} m={0}>
            <Progress
                position="fixed"
                top={0}
                left={0}
                right={0}
                p={0}
                m={0}
                size="sm"
                value={percent}
                colorScheme="brand"
            />
        </Box>
    );
}
