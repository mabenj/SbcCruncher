import styles from "./RatingCard.module.scss";

const SILVER_HIGHEST = 74;
const BRONZE_HIGHEST = 64;

interface RatingCardProps {
    rating: number;
    selected?: boolean;
    altSelected?: boolean;
    actionable?: boolean;
    size?: "sm" | "md" | "lg";
}

export default function RatingCard(props: RatingCardProps) {
    const colorClassKey =
        props.rating > SILVER_HIGHEST
            ? "card-gold"
            : props.rating > BRONZE_HIGHEST
            ? "card-silver"
            : "card-bronze";
    return (
        <div
            className={
                styles["card"] +
                " " +
                styles[props.size ?? "md"] +
                " " +
                styles[colorClassKey] +
                " " +
                (props.selected && styles["card-selected"]) +
                " " +
                (props.altSelected &&
                    !props.selected &&
                    styles["card-alt-selected"]) +
                " " +
                (props.actionable && styles["card-actionable"])
            }>
            <div>{props.rating}</div>
        </div>
    );
}
