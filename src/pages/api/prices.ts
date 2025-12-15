import Log from "@/common/log";
import { getErrorMessage, range } from "@/common/utilities";
import { PriceFetchService } from "@/server/services/price-fetch.service";
import { PricesDto } from "@/types/prices-dto.interface";
import { NextApiRequest, NextApiResponse } from "next";

type DataSource = "futbin" | "futwiz";
type Platform = "pc" | "console";

const DATA_SOURCES: DataSource[] = ["futbin", "futwiz"];
const PLATFORMS: Platform[] = ["pc", "console"];
const RATINGS = range(75, 98);

const LOGGER = new Log("api/prices");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  LOGGER.debug(`Received request ${req.method} (${req.headers["user-agent"]})`);
  try {
    // Yup, this is quite easy to circumvent
    if (
      process.env.NODE_ENV !== "development" &&
      !req.headers.referer?.includes(req.headers.host!)
    ) {
      LOGGER.warn("Invalid referer");
      res.status(403).send("Forbidden");
      return;
    }

    const dataSource = req.query["datasource"] as DataSource;
    const platform = req.query["platform"] as Platform;
    if (!DATA_SOURCES.includes(dataSource) || !PLATFORMS.includes(platform)) {
      LOGGER.warn("Invalid datasource or platform");
      res.status(404).end();
      return;
    }

    const priceService = new PriceFetchService(dataSource, platform);
    const prices = await priceService.getPrices(RATINGS);
    const responseObject: PricesDto = { prices, status: "ok" };

    res.setHeader("Cache-Control", "public, s-maxage=3600");
    res.status(200).json(responseObject);
  } catch (error) {
    res.status(500).json({
      prices: [],
      status: "error",
    } as PricesDto);
    LOGGER.error(getErrorMessage(error) || "unknown error", error);
  }
};

export default handler;
