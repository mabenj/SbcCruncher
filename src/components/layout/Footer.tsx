import { useEventTracker } from "@/hooks/useEventTracker";
import { getErrorMessage } from "@/utilities";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
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
    useToast,
    VStack
} from "@chakra-ui/react";
import { mdiEmailFastOutline, mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import { useState } from "react";
import ExternalLink from "../ui/ExternalLink";
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
            <Flex direction="column" gap={10} px={3} mt={40} mb={10}>
                <Flex
                    direction={["column", null, null, "row"]}
                    justifyContent="space-evenly"
                    fontSize="sm"
                    gap="3rem">
                    <VStack>
                        <Heading as="h3" size="md">
                            Donate
                        </Heading>
                        <Flex gap={2}>
                            <Link
                                href="https://www.buymeacoffee.com/mabenj"
                                isExternal
                                onClick={() => eventTracker("donate_click")}>
                                <Box position="relative" h="2.7rem" w="10rem">
                                    <Image
                                        src="/bmc-button.svg"
                                        alt="Buy me a coffee"
                                        fill
                                        style={{ objectFit: "contain" }}
                                    />
                                </Box>
                            </Link>
                        </Flex>
                    </VStack>

                    <VStack>
                        <Heading as="h3" size="md">
                            Contact & Feedback
                        </Heading>
                        <Flex alignItems="center" gap={2}>
                            <Icon path={mdiEmailFastOutline} size={1}></Icon>

                            <Button
                                variant="ghost"
                                color="brand.400"
                                onClick={() => {
                                    eventTracker("contact_form_open");
                                    onFormOpen();
                                }}
                                fontWeight="700">
                                Send message
                            </Button>
                        </Flex>
                    </VStack>
                </Flex>
                <Flex
                    direction="column"
                    gap={5}
                    fontSize="sm"
                    textAlign="center"
                    mt={20}>
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
            </Flex>
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
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    type="email"
                                    id="email"
                                    required
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
