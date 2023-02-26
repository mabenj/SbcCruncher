import { useEventTracker } from "@/hooks/useEventTracker";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Text
} from "@chakra-ui/react";
import { useRef } from "react";

export default function NoPricesDialog({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: (shouldContinue: boolean) => void;
}) {
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const eventTracker = useEventTracker("Solutions");

    const handleClose = (shouldContinue: boolean = false) => {
        eventTracker("dismiss_no_prices=" + shouldContinue.toString());
        onClose(shouldContinue);
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={handleClose}
            leastDestructiveRef={cancelRef}
            isCentered>
            <AlertDialogOverlay backdropFilter="blur(3px)">
                <AlertDialogContent textAlign={["center", null, "left"]}>
                    <AlertDialogHeader>No Player Prices</AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>
                            You did not specify any prices for player ratings!
                        </Text>
                        <Text py={2} fontWeight="bold">
                            SBC Cruncher will not be able to determine which of
                            the solutions is the cheapest
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter justifyContent="center" gap={2}>
                        <Button
                            ref={cancelRef}
                            onClick={() => handleClose(false)}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => handleClose(true)}>
                            I understand, calculate anyway
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
