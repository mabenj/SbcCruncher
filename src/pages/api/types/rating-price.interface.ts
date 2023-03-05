export interface RatingPrice {
    rating: number;
    platform: "pc" | "console";
    cheapest: number;
    dataSource: "futbin" | "futwiz";
    updatedAt?: Date;
}
