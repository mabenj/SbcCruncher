import { getErrorMessage } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";
import { Log } from "../log";
import { getPrices } from "../services/price.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Yup, this is quite easy to circumvent
        // if (!req.headers.referer?.includes(req.headers.host!)) {
        //     res.status(403).send("Forbidden");
        //     return;
        // }

        const datasource = req.query["datasource"];
        if (datasource !== "futbin" && datasource !== "futwiz") {
            res.status(400).send("Invalid datasource");
            return;
        }

        const platform = req.query["platform"];
        if (platform !== "console" && platform !== "pc") {
            res.status(400).send("Missing platform");
            return;
        }

        const ratingRange = (req.query["ratings"] as string)
            ?.split(",")
            .map((rating) => parseInt(rating, 10))
            .filter((rating) => !!rating);
        if (!Array.isArray(ratingRange) || ratingRange.length < 1) {
            res.status(400).send("Invalid ratings");
            return;
        }

        const prices = await getPrices(datasource, platform, ratingRange);

        res.setHeader("Cache-Control", "public, s-maxage=3600");
        res.status(200).json({ prices, status: "ok" });
    } catch (error) {
        res.status(500).json({
            prices: [],
            status: "error"
        });
        Log.error(getErrorMessage(error) || "unknown error", error);
    }
};

export default handler;
