import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { Stack } from "@chakra-ui/react";
import AccentedCard from "../ui/AccentedCard";
import ExistingPlayers from "./ExistingPlayers";
import PlayerPrices from "./PlayerPrices";
import RatingRange from "./RatingRange";
import TargetRating from "./TargetRating";
import Solutions from "./solutions/Solutions";

export default function Main() {
    return (
        <Stack spacing={10}>
            <TargetRatingCard step={1} />
            <ExistingPlayersCard step={2} />
            <RatingRangeCard step={3} />
            <PricesCard step={4} />
            <Solutions />
        </Stack>
    );
}

const TargetRatingCard = ({ step }: { step: number }) => {
    return (
        <AccentedCard
            header="Target Rating"
            infoParagraphs={[
                "Choose a target rating.",
                "This can be, for example, the required rating of an SBC."
            ]}
            step={step}>
            <TargetRating />
        </AccentedCard>
    );
};

const ExistingPlayersCard = ({ step }: { step: number }) => {
    return (
        <AccentedCard
            header="Existing Players"
            infoParagraphs={[
                "If you already have some players you want to use, add them here by pressing the 'Add player' button.",
                "For best results, try to only add players that are close to the target rating."
            ]}
            step={step}>
            <ExistingPlayers />
        </AccentedCard>
    );
};

const RatingRangeCard = ({ step }: { step: number }) => {
    return (
        <AccentedCard
            header="Ratings to Use"
            infoParagraphs={[
                "Select the minimum and maximum ratings you want SBC Cruncher to use when calculating solutions.",
                "To exclude specific ratings from the calculations, press the 'Exclude rating' button"
            ]}
            step={step}>
            <RatingRange />
        </AccentedCard>
    );
};

const PricesCard = ({ step }: { step: number }) => {
    const [_, setConfig] = useConfig();

    const eventTracker = useEventTracker("Prices");

    const handleSwitchChange = (isChecked: boolean) => {
        setConfig((prev) => ({
            ...prev,
            pricesDisabled: !isChecked
        }));
        eventTracker(
            "prices_enabled",
            `enable=${isChecked}`,
            isChecked ? 1 : -1
        );
    };

    return (
        <AccentedCard
            header="Player Prices"
            infoParagraphs={[
                "Enter the price for each rating so that SBC Cruncher can properly rank the calculated solutions.",
                "You can also fill the prices with Futbin or Futwiz price data by pressing the 'Auto-fill' button."
            ]}
            step={step}
            expandSwitch
            onExpandChange={handleSwitchChange}>
            <PlayerPrices />
        </AccentedCard>
    );
};
