import { getErrorMessage } from "@/utilities";
import { NextApiRequest, NextApiResponse } from "next";

const URL = "https://www.futwiz.com/en/lowest-price-ratings";

// Realistically, the server running this function should get wiped before
// this cache ever has a chance to become stale
// https://answers.netlify.com/t/how-to-memoize-cache-lambda-function/5079/4
const CACHE_STALE_MS = 60 * 60 * 1000; // 1h

const cache: { [platform: string]: { timestamp: number; html: string } } = {};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Yup, this is quite easy to circumvent
        if (!req.headers.referer?.includes(req.headers.host!)) {
            res.status(403).send("Forbidden");
            return;
        }

        const platform = req.query["platform"];
        if (platform !== "console" && platform !== "pc") {
            res.status(400).send("Missing platform");
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
            if (!html) {
                throw new Error("Invalid Futwiz response");
            }
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
