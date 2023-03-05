import { PricesDto } from "@/types/prices-dto.interface";
import { getErrorMessage, range } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";
import { Log } from "../log";
import PriceService from "../services/price-fetch.service";

const RATINGS = range(78, 93);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Yup, this is quite easy to circumvent
        if (!req.headers.referer?.includes(req.headers.host!)) {
            res.status(403).send("Forbidden");
            return;
        }

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

        const priceService = new PriceService(datasource, platform);
        const prices = await priceService.getPrices(RATINGS);
        const responseObject: PricesDto = {
            prices,
            status: "ok"
        };

        res.setHeader("Cache-Control", "public, s-maxage=3600");
        res.status(200).json(responseObject);
    } catch (error) {
        res.status(500).json({
            prices: [],
            status: "error"
        } as PricesDto);
        Log.error(getErrorMessage(error) || "unknown error", error);
    }
};

export default handler;
