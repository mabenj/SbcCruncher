import { getErrorMessage } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";

const URL = "https://www.futwiz.com/en/lowest-price-ratings";

// the server running this function should get wiped before 1h elapses
// https://answers.netlify.com/t/how-to-memoize-cache-lambda-function/5079/4
const CACHE_STALE_MS = 3_600_600; // 1h

const cache: { [platform: string]: { timestamp: number; html: string } } = {};

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

        const cacheHit = cache[platform];
        const cacheFresh =
            cacheHit && Date.now() - cache[platform].timestamp < CACHE_STALE_MS;

        let html = "";
        if (cacheHit && cacheFresh) {
            html = cache[platform].html;
            res.setHeader("X-Function-Cache", "HIT");
        } else {
            html = await (
                await fetch(URL, {
                    headers: { Cookie: `futwiz_prices=${platform}` }
                })
            ).text();
            cache[platform] = {
                timestamp: Date.now(),
                html: html
            };
            res.setHeader("X-Function-Cache", cacheHit ? "EXPIRED" : "MISS");
        }

        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "public, s-maxage=3600");
        res.status(200).send(html);
    } catch (error) {
        res.setHeader("Content-Type", "text/json");
        res.status(500).json({ error: getErrorMessage(error) });
    }
};

export default handler;
