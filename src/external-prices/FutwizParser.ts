export class FutwizParser {
    static fromHtml(html: string) {
        console.log("täällä", html);
        const cheapestByRating: Record<number, number> = {};

        const domParser = new DOMParser();
        const doc = domParser.parseFromString(html, "text/html");

        const ratingColumns = doc.querySelectorAll(
            ".col-4[style='padding-right:0px;']"
        );
        console.log({ ratingColumns });
        ratingColumns.forEach((column) => {
            const rating = parseInt(
                column.querySelector(".title")?.innerHTML.trim() ?? "-1"
            );
            if (isNaN(rating) || rating === -1) {
                return;
            }
            const playersBins = column.querySelectorAll(".bin");
            const playerPrices = Array.from(playersBins).map((bin) =>
                parsePrice(bin.textContent?.trim())
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
