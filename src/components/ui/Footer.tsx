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
import ExternalLink from "./ExternalLink";
import MutedSmall from "./MutedSmall";

const FORM_URL = "https://formbold.com/s/94NmX";

export default function Footer() {
    const {
        isOpen: isFormOpen,
        onOpen: onFormOpen,
        onClose: onFormClose
    } = useDisclosure();

    return (
        <>
            <Flex direction="column" gap={10} px={3} mt={40} mb={10}>
                <Flex
                    direction={["column", null, null, "row"]}
                    justifyContent="space-evenly"
                    fontSize="sm"
                    gap={8}>
                    <VStack>
                        <Heading as="h3" size="md">
                            Donate
                        </Heading>
                        <Flex gap={2}>
                            <Link
                                href="https://www.buymeacoffee.com/mabenj"
                                isExternal>
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
                            Source Code
                        </Heading>
                        <Flex gap={2} py={2}>
                            <Icon path={mdiGithub} size={1}></Icon>
                            <ExternalLink
                                href="https://github.com/mabenj/SbcCruncher"
                                useIcon>
                                github.com/mabenj/SbcCruncher
                            </ExternalLink>
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
                                onClick={onFormOpen}
                                fontWeight="700">
                                Send message
                            </Button>
                        </Flex>
                    </VStack>
                </Flex>
                <Flex
                    direction="column"
                    gap={2}
                    fontSize="sm"
                    textAlign="center">
                    <MutedSmall>
                        The idea for SBC Cruncher was inspired by{" "}
                        <ExternalLink
                            href="https://elmaano.github.io/sbc/"
                            useIcon>
                            SBC Rating Brute Forcer
                        </ExternalLink>
                    </MutedSmall>
                    <MutedSmall>
                        The squad ratings are calculated based on{" "}
                        <ExternalLink
                            href="https://www.reddit.com/r/FIFA/comments/5osq7k/new_overall_rating_figured_out/"
                            useIcon>
                            u_ChairmanMeowwww&apos;s formula
                        </ExternalLink>
                    </MutedSmall>
                </Flex>
            </Flex>
            <ContactForm isOpen={isFormOpen} onClose={onFormClose} />
        </>
    );
}

const ContactForm = (props: { isOpen: boolean; onClose: () => any }) => {
    const toast = useToast();

    const handleSubmit = async (e: React.SyntheticEvent) => {
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
                    description: "Submission successful",
                    status: "success"
                });
                props.onClose();
            } else {
                throw new Error(await response.json());
            }
        } catch (error) {
            toast({
                description: "Submission not successful",
                status: "error"
            });
        }
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
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
                                    placeholder="Mr. Cristiano CR7"
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
                        <Button variant="ghost" mr={3} onClick={props.onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" colorScheme="brand">
                            Submit
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};
