import { getErrorMessage } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";

const URL = "https://www.futwiz.com/en/lowest-price-ratings";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (!req.headers.referer?.includes(req.headers.host!)) {
            res.status(400).send("Bad request");
            return;
        }

        const platform = req.query["platform"];
        if (platform !== "console" && platform !== "pc") {
            res.status(400).send("Bad request");
            return;
        }

        const html = await (
            await fetch(URL, {
                headers: { Cookie: `futwiz_prices=${platform}` }
            })
        ).text();

        res.status(200).send(html);
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
};

export default handler;
