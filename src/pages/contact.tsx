import { getErrorMessage } from "@/common/utilities";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HtmlHead from "@/components/layout/HtmlHead";
import AccentedCard from "@/components/ui/AccentedCard";
import AnimatedBg from "@/components/ui/AnimatedBg";
import { useEventTracker } from "@/hooks/useEventTracker";
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Textarea,
    useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import MutedSmall from "../components/ui/MutedSmall";

export default function Contact() {
    return (
        <>
            <HtmlHead title="Contact" description="SBC Cruncher - Contact" />
            <AnimatedBg />
            <Container maxW="4xl">
                <header>
                    <Header showHelpBtn={false} />
                </header>
                <main>
                    <ContactForm />
                </main>
                <footer>
                    <Footer />
                </footer>
            </Container>
        </>
    );
}

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const router = useRouter();

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
            const response = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify({ name, email, message })
            });
            if (response.ok) {
                await router.push("/");
                toast({
                    description: "Message sent",
                    status: "success"
                });
                eventTracker(
                    "contact_form_submit",
                    JSON.stringify({
                        name,
                        email,
                        message
                    })
                );
            } else {
                throw new Error(response.statusText);
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
        <Box pt={20}>
            <AccentedCard header="Contact Form">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={5} mt={3}>
                        <FormControl>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input
                                type="text"
                                id="name"
                                required
                                placeholder="Cristiano"
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
                    <Flex justifyContent="flex-end" pt={10}>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            isLoading={isSubmitting}
                            loadingText="Submitting">
                            Submit
                        </Button>
                    </Flex>
                </form>
            </AccentedCard>
            <Flex as="small" py={5} direction="column" alignItems="center">
                <Box color="gray.500">
                    You can also get in touch directly via email at
                </Box>
                <Box
                    as="a"
                    display="block"
                    fontWeight="semibold"
                    href="mailto:contact@sbccruncher.cc"
                    _hover={{
                        textDecoration: "underline"
                    }}>
                    contact@sbccruncher.cc
                </Box>
            </Flex>
        </Box>
    );
};
