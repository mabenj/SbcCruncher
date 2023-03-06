import { getErrorMessage } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";
import { Log } from "./log";
import { PriceUpdateService } from "./services/price-update.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        Log.info("Starting price update");
        const updateService = new PriceUpdateService();
        await updateService.updateRatingPrices();
        res.status(204).end();
        Log.info("Success");
    } catch (error) {
        Log.error(`Error updating rating prices: $${getErrorMessage(error)}`);
        res.status(500).end();
    }
};

export default handler;

export const config = {
    type: "experimental-scheduled",
    schedule: "@hourly"
};
