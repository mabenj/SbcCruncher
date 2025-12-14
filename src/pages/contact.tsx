import { getErrorMessage } from "@/common/utilities";
import Page from "@/components/layout/Page";
import AccentedCard from "@/components/ui/AccentedCard";
import { useEventTracker } from "@/hooks/useEventTracker";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import MutedSmall from "../components/ui/MutedSmall";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOutline } from "@mdi/js";

export default function ContactPage() {
  return (
    <Page
      head={{
        title: "Contact",
        description: "Get in touch with via a contact form or email",
      }}
    >
      <ContactForm />
    </Page>
  );
}

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
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
      hp: { value: string };
    };

    // Honeypot field check: if filled, likely a bot
    if (target.hp.value) {
      setIsSubmitting(false);
      await router.push("/");
      toast({
        description: "Message sent",
        status: "success",
      });
      return;
    }

    const name = target.name.value;
    const email = target.email.value;
    const message = target.message.value;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        await router.push("/");
        toast({
          description: "Message sent",
          status: "success",
        });
        eventTracker(
          "contact_form_submit",
          JSON.stringify({
            name,
            email,
            message,
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
        status: "error",
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
    <Box pt={5}>
      <AccentedCard header="Get in touch">
        <form onSubmit={handleSubmit}>
          <Box display="none">
            <label htmlFor="hp">Leave this field empty</label>
            <input
              type="text"
              id="hp"
              name="hp"
              autoComplete="off"
              tabIndex={-1}
            />
          </Box>
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
                gap={1}
              >
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
              loadingText="Submitting"
            >
              Submit
            </Button>
          </Flex>
        </form>
      </AccentedCard>
      <Flex fontSize="sm" py={5} direction="column" alignItems="center">
        <Box color="gray.500">
          You can also get in touch directly via email at
        </Box>
        {!showEmail && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="brand"
            rightIcon={<Icon path={mdiEyeOutline} size={0.7}></Icon>}
            onClick={() => setShowEmail(true)}
          >
            Click to reveal email
          </Button>
        )}

        <Box display="none">
          <a href="mailto:spamtrap@sbccruncher.cc">spamtrap@sbccruncher.cc</a>
        </Box>
        {showEmail && (
          <Box
            as="a"
            display="block"
            fontWeight="semibold"
            href="mailto:contact@sbccruncher.cc"
            _hover={{
              textDecoration: "underline",
            }}
          >
            <span>contact</span>
            <span>@</span>
            <span>sbccruncher</span>.<span>cc</span>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
