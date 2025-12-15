import Log from "@/common/log";
import { NextApiRequest, NextApiResponse } from "next";

const FORM_URL = "https://formbold.com/s/94NmX";

const LOGGER = new Log("api/contact");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  LOGGER.debug(`Received request ${req.method} (${req.headers["user-agent"]})`);
  if (!req.body) {
    LOGGER.debug("Request body is empty");
    res.status(400).send("Invalid request");
    return;
  }
  try {
    const { name, email, message } = JSON.parse(req.body) as {
      name?: string;
      email?: string;
      message?: string;
    };
    if (!name || !message) {
      LOGGER.debug("Missing name or message in request body");
      res.status(400).send("Invalid request");
      return;
    }

    const formResponse = await fetch(FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (formResponse.ok) {
      LOGGER.debug("Form submitted successfully");
      res.status(204).end();
      return;
    }

    throw new Error("Form submission returned a non-200 status code");
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).send("Internal server error");
    return;
  }
};

export default handler;
