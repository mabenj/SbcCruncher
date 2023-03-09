export interface PricesDto {
    prices: { rating: number; price: number }[];
    status: "ok" | "error";
}
