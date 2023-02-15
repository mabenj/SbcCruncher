export class FutbinParser {
    static fromHtml(html: string) {
        let cheapestByRating: Record<number, number> = {};

        const domParser = new DOMParser();
        const doc = domParser.parseFromString(html, "text/html");

        const ratingGroups = doc.querySelectorAll(".top-stc-players-col");
        ratingGroups.forEach((group) => {
            const rating = parseInt(
                group
                    .querySelector(".top-players-stc-title>span>span")
                    ?.innerHTML.trim() ?? "-1"
            );
            if (isNaN(rating) || rating === -1) {
                return;
            }
            const spans = group.querySelectorAll(".price-holder-row>span");
            const playerPrices = Array.from(spans).map((span) =>
                parsePrice(span.textContent?.trim())
            );
            if (playerPrices.length === 0) {
                return;
            }

            cheapestByRating[rating] = Math.min(...playerPrices);
        });

        return cheapestByRating;
    }
}

function parsePrice(text: string | undefined) {
    if (!text) {
        return 0;
    }
    const isThousand = text.endsWith("K");
    const isMillion = text.endsWith("M");
    const num = parseFloat(text);
    const result = isThousand ? 1000 * num : isMillion ? 1_000_000 * num : num;
    if (
        isNaN(result) ||
        result === Number.POSITIVE_INFINITY ||
        result === Number.NEGATIVE_INFINITY
    ) {
        throw new Error("Error parsing price '" + text + "'");
    }
    return result;
}
