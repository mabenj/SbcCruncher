import { useEventTracker } from "@/hooks/useEventTracker";
import { getErrorMessage } from "@/utilities";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Textarea,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { mdiEmailFastOutline, mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import { useState } from "react";
import ExternalLink from "../ui/ExternalLink";
import HoverTooltip from "../ui/HoverTooltip";
import MutedSmall from "../ui/MutedSmall";

const FORM_URL = "https://formbold.com/s/94NmX";

export default function Footer() {
    const {
        isOpen: isFormOpen,
        onOpen: onFormOpen,
        onClose: onFormClose
    } = useDisclosure();

    const eventTracker = useEventTracker("Footer");

    return (
        <>
            <Flex
                direction="column"
                alignItems="center"
                gap={5}
                fontSize="sm"
                textAlign="center"
                mt={["10rem", null, "20rem"]}
                mb="3rem">
                <Flex
                    direction={["column", null, "row"]}
                    alignItems={["stretch", null, "center"]}
                    columnGap={5}
                    rowGap={5}
                    mb={10}>
                    <Box
                        position="relative"
                        flexGrow={1}
                        minW="10rem"
                        h="2.7rem">
                        <Link
                            href="https://www.buymeacoffee.com/mabenj"
                            isExternal
                            onClick={() => eventTracker("donate_click")}>
                            <HoverTooltip label="Donate">
                                <Image
                                    src="/images/bmc-button.svg"
                                    alt="Buy me a coffee"
                                    fill
                                    style={{ objectFit: "contain" }}
                                />
                            </HoverTooltip>
                        </Link>
                    </Box>

                    <Box
                        position="relative"
                        flexGrow={1}
                        minW="10rem"
                        h="2.7rem">
                        <Link
                            href="https://play.google.com/store/apps/details?id=cc.sbccruncher.twa"
                            isExternal
                            onClick={() => eventTracker("google_play_click")}>
                            <HoverTooltip label="Google Play">
                                <Image
                                    src="/images/google-play.png"
                                    alt="Get it on Google Play"
                                    fill
                                    style={{ objectFit: "contain" }}
                                />
                            </HoverTooltip>
                        </Link>
                    </Box>

                    <Box flexGrow={1}>
                        <HoverTooltip label="Open message form">
                            <Button
                                colorScheme="brand"
                                leftIcon={
                                    <Icon path={mdiEmailFastOutline} size={1} />
                                }
                                onClick={() => {
                                    eventTracker("contact_form_open");
                                    onFormOpen();
                                }}>
                                Contact & Feedback
                            </Button>
                        </HoverTooltip>
                    </Box>
                </Flex>

                <div onClick={() => eventTracker("brute_forcer_click")}>
                    <MutedSmall>
                        The idea for SBC Cruncher was inspired by{" "}
                        <ExternalLink href="https://elmaano.github.io/sbc/">
                            SBC Rating Brute Forcer
                        </ExternalLink>
                    </MutedSmall>
                </div>

                <Flex
                    gap={2}
                    py={2}
                    onClick={() => eventTracker("github_click")}
                    justifyContent="center"
                    alignItems="center">
                    <Box color="gray.500">© {new Date().getFullYear()}</Box>
                    <Icon path={mdiGithub} size={1}></Icon>
                    <ExternalLink href="https://github.com/mabenj/SbcCruncher">
                        mabenj
                    </ExternalLink>
                </Flex>
            </Flex>
            {process.env.NEXT_PUBLIC_COMMIT_REF && (
                <Box
                    position="absolute"
                    left={0}
                    color="gray.500"
                    fontSize="xs"
                    p={2}>
                    Build commit{" "}
                    {process.env.NEXT_PUBLIC_COMMIT_REF.slice(0, 7)}
                </Box>
            )}
            <ContactForm isOpen={isFormOpen} onClose={onFormClose} />
        </>
    );
}

const ContactForm = (props: { isOpen: boolean; onClose: () => any }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const eventTracker = useEventTracker("Contact form");

    const handleSubmit = async (e: React.SyntheticEvent) => {
        setIsSubmitting(true);
        e.preventDefault();
        const target = e.target as typeof e.target & {
            name: { value: string };
            email: { value: string };
            message: { value: string };
        };
        const name = target.name.value;
        const email = target.email.value;
        const message = target.message.value;
        try {
            const response = await fetch(FORM_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({ name, email, message }),
                redirect: "follow"
            });
            if (response.ok) {
                toast({
                    description: "Message sent",
                    status: "success"
                });
                props.onClose();
                eventTracker(
                    "contact_form_submit",
                    JSON.stringify({
                        name,
                        email,
                        message
                    })
                );
            } else {
                throw new Error(await response.json());
            }
        } catch (error) {
            const message = getErrorMessage(error);
            toast({
                title: "Message could not be sent",
                description: message,
                status: "error"
            });
            eventTracker(
                "contact_form_submit_error",
                message || JSON.stringify(error)
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={() => {
                eventTracker("contact_form_close");
                props.onClose();
            }}
            size={["full", null, "lg", "md"]}>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>Contact & Feedback</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Stack spacing={5} mt={3}>
                            <FormControl>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input
                                    type="text"
                                    id="name"
                                    required
                                    placeholder="Mr. Cristiano"
                                    variant="filled"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="email"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}>
                                    Email <MutedSmall>(Optional)</MutedSmall>
                                </FormLabel>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="siuu@gmail.com"
                                    variant="filled"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="message">Message</FormLabel>
                                <Textarea
                                    id="message"
                                    required
                                    placeholder="Hey! 👀"
                                    variant="filled"
                                />
                            </FormControl>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={() => {
                                eventTracker("contact_form_cancel");
                                props.onClose();
                            }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            isLoading={isSubmitting}
                            loadingText="Sending">
                            Send
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};
