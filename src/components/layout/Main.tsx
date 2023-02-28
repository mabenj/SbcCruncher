import { useConfig } from "@/context/ConfigContext";
import { useEventTracker } from "@/hooks/useEventTracker";
import { Stack } from "@chakra-ui/react";
import ExistingPlayers from "../form/ExistingPlayers";
import PlayerPrices from "../form/PlayerPrices";
import RatingRange from "../form/RatingRange";
import Solutions from "../form/solutions/Solutions";
import TargetRating from "../form/TargetRating";
import AccentedCard from "../ui/AccentedCard";

export default function Main() {
    return (
        <Stack spacing={10} mt="3.7rem">
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
                "If you already have some players you want to use, add them here by pressing the 'Add player' button."
            ]}
            step={step}>
            <ExistingPlayers />
        </AccentedCard>
    );
};

const RatingRangeCard = ({ step }: { step: number }) => {
    return (
        <AccentedCard
            header="Range of Ratings to Use"
            infoParagraphs={[
                "Select the minimum and maximum ratings you want SBC Cruncher to use when calculating solutions."
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
        eventTracker("disable_prices=" + !isChecked);
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
