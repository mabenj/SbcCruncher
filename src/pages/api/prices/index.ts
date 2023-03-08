import { PricesDto } from "@/types/prices-dto.interface";
import { getErrorMessage, range } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";
import { Log } from "../log";
import { PriceFetchService } from "../services/price-fetch.service";

type DataSource = "futbin" | "futwiz";
type Platform = "pc" | "console";

const DATASOURCES: DataSource[] = ["futbin", "futwiz"];
const PLATFORMS: Platform[] = ["pc", "console"];
const RATINGS = range(75, 98);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Yup, this is quite easy to circumvent
        if (
            process.env.NODE_ENV !== "development" &&
            !req.headers.referer?.includes(req.headers.host!)
        ) {
            res.status(403).send("Forbidden");
            return;
        }

        const datasource = req.query["datasource"] as DataSource;
        const platform = req.query["platform"] as Platform;
        if (
            !DATASOURCES.includes(datasource) ||
            !PLATFORMS.includes(platform)
        ) {
            res.status(404).end();
            return;
        }

        const priceService = new PriceFetchService(datasource, platform);
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
