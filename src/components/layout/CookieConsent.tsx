import { useEventTracker } from "@/hooks/useEventTracker";
import {
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "cookieConsent";

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const eventTracker = useEventTracker("CookieConsent");

    useEffect(() => {
        setShowBanner(localStorage.getItem(CONSENT_KEY) !== "true");
    }, []);

    const onAccept = () => {
        setShowBanner(false);
        localStorage.setItem(CONSENT_KEY, "true");
        eventTracker("accept", "accept");
    };

    if (!showBanner) {
        return null;
    }

    return (
        <Box
            position="fixed"
            bottom={[0, null, "20px"]}
            right={[0, null, "20px"]}
            width={["100%", null, "20rem"]}
            zIndex={9999}>
            <Card
                variant="elevated"
                rounded={[null, null, "2xl"]}
                border="1px solid"
                borderColor={borderColor}>
                <CardBody>
                    <Flex direction="column" gap={3} fontSize="sm">
                        <Box>
                            SBC Cruncher uses cookies to improve user
                            experience. By using SBC Cruncher, you agree to the
                            use of cookies.
                        </Box>
                        <Flex
                            gap={4}
                            alignItems="center"
                            justifyContent="center">
                            <Button
                                size="sm"
                                variant="link"
                                as={NextLink}
                                href="/cookies"
                                colorScheme="brand">
                                Learn more
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={onAccept}>
                                I understand
                            </Button>
                        </Flex>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    );
}
