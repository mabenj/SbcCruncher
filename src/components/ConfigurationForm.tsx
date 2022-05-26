import { BlockUI } from "primereact/blockui";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import Config from "../Config";
import useLocalStorage from "../hooks/useLocalStorage";
import { IExistingRating } from "../interfaces/ExistingRating.interface";
import { IPriceInfo } from "../interfaces/PriceInfo.interface";
import { range } from "../util/utils";
import { CalculationButtons } from "./CalculationButtons";
import { ExistingRatingsInput } from "./ExistingRatingsInput";
import { Link } from "./Link";
import { PricesInput } from "./PricesInput";
import { TargetRatingInput } from "./TargetRatingInput";
import { TryRatingsRangeInput } from "./TryRatingsRangeInput";

interface IConfigurationFormProps {
    calculate: (
        targetRating: number,
        existingRatings: number[],
        ratingsToTry: number[],
        prices: IPriceInfo
    ) => void;
    stopPressed: () => void;
    configChanged: () => void;
    tryBoundsChanged: (newBounds: [min: number, max: number]) => void;
    isCalculating: boolean;
}

export default function ConfigurationForm({
    calculate,
    stopPressed,
    configChanged,
    tryBoundsChanged,
    isCalculating
}: IConfigurationFormProps) {
    const [targetRating, setTargetRating] = useState<number | undefined>();
    const [existingRatings, setExistingRatings] = useState<IExistingRating[]>(
        []
    );
    const [tryBounds, setTryBounds] = useState<[number, number]>([
        Config.defaultTryMin,
        Config.defaultTryMax
    ]);
    const [prices, setPrices] = useLocalStorage(
        Config.priceDataStorageKey,
        {} as IPriceInfo
    );

    useEffect(() => {
        configChanged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetRating, existingRatings, tryBounds, prices]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetRating) {
            return;
        }
        const existingRatingsFlat: number[] =
            existingRatings?.flatMap(({ rating, quantity }) =>
                new Array(quantity).fill(rating)
            ) || [];
        const ratingsToTry = range(tryBounds[0], tryBounds[1]);
        calculate(targetRating, existingRatingsFlat, ratingsToTry, prices);
    };

    const handleTryBoundsChange = (newBounds: [min: number, max: number]) => {
        setTryBounds(newBounds);
        tryBoundsChanged(newBounds);
    };

    const handlePriceChange = (newPrices: IPriceInfo) => {
        setPrices(newPrices);
    };

    return (
        <form noValidate onSubmit={handleSubmit}>
            <FormPanelWrapper title="Target Rating" id="targetRating">
                <TargetRatingInput
                    value={targetRating}
                    onChange={setTargetRating}
                />
            </FormPanelWrapper>

            <FormPanelWrapper title="Existing Players" blocked={!targetRating}>
                <ExistingRatingsInput
                    value={existingRatings || []}
                    onChange={(nr) => setExistingRatings(nr ? nr : [])}
                />
            </FormPanelWrapper>

            <FormPanelWrapper
                title="Range of Ratings to Try"
                blocked={!targetRating}>
                <TryRatingsRangeInput
                    value={tryBounds}
                    onChange={handleTryBoundsChange}
                />
            </FormPanelWrapper>

            <FormPanelWrapper title="Player Prices" blocked={!targetRating}>
                <PricesInput
                    ratings={range(tryBounds[0], tryBounds[1])}
                    prices={prices}
                    onChange={handlePriceChange}
                />
            </FormPanelWrapper>

            <CalculationButtons
                disabled={!targetRating}
                isCalculating={isCalculating}
                onStopPressed={stopPressed}
                errorMessage={
                    targetRating
                        ? undefined
                        : "Target rating is not specified — It is required"
                }
            />
        </form>
    );
}

const FormPanelWrapper = ({
    children,
    className,
    title,
    blocked,
    id
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
    blocked?: boolean;
    id?: string;
}) => {
    const scrollToTargetRating = () => {
        const elem = document.getElementById("targetRating");
        elem?.scrollIntoView();
    };

    return (
        <section id={id}>
            <BlockUI
                blocked={blocked}
                className="block-mask"
                template={
                    <div className="text-center text-white">
                        <div className="pi pi-ban mb-3 text-4xl"></div>
                        <div>
                            Specify a{" "}
                            <Link
                                href=""
                                onClick={scrollToTargetRating}
                                openInSameTab
                                style={{ textShadow: "" }}>
                                Target Rating
                            </Link>{" "}
                            to Continue
                        </div>
                    </div>
                }>
                <Card className={`mb-5 lg:my-8 lg:px-4 ${className}`}>
                    {title && (
                        <>
                            <h3 className="font-medium text-lg">{title}</h3>
                            <Divider />
                        </>
                    )}

                    {children}
                </Card>
            </BlockUI>
        </section>
    );
};
