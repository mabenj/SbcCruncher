import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Checkbox,
    Text
} from "@chakra-ui/react";
import { useRef, useState } from "react";

export default function NoPricesDialog({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: (shouldContinue: boolean, dontShowAgain: boolean) => void;
}) {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={() => onClose(false, false)}
            leastDestructiveRef={cancelRef}
            isCentered>
            <AlertDialogOverlay backdropFilter="blur(3px)">
                <AlertDialogContent textAlign={["center", null, "left"]}>
                    <AlertDialogHeader>Price data missing</AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>
                            You did not specify any prices for player ratings!{" "}
                            <strong>
                                SBC Cruncher will not be able to determine which
                                of the solutions is the cheapest
                            </strong>
                        </Text>
                        <Checkbox
                            colorScheme="brand"
                            pt={8}
                            checked={dontShowAgain}
                            onChange={(e) =>
                                setDontShowAgain(e.target.checked)
                            }>
                            Don&apos;t show this again
                        </Checkbox>
                    </AlertDialogBody>
                    <AlertDialogFooter justifyContent="center" gap={2}>
                        <Button
                            ref={cancelRef}
                            onClick={() => onClose(false, false)}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => onClose(true, dontShowAgain)}>
                            I understand, calculate anyway
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
