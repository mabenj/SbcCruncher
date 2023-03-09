interface PriceDictionary {
    [dataSource: string]: number;
}

export interface RatingPrice {
    rating: number;
    pricesPc: PriceDictionary;
    pricesConsole: PriceDictionary;
}
