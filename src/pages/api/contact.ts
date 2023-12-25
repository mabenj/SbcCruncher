import { NextApiRequest, NextApiResponse } from "next";

const FORM_URL = "https://formbold.com/s/94NmX";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body) {
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
            res.status(400).send("Invalid request");
            return;
        }

        const formResponse = await fetch(FORM_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        if (formResponse.ok) {
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
