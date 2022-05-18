import { Badge } from "primereact/badge";
import { Message } from "primereact/message";
import { Skeleton } from "primereact/skeleton";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ISolution } from "../interfaces";
import Spinner from "./Spinner";

interface ISolutionsProps {
    displaySolutions: ISolution[];
    targetRating: number | undefined;
    columnDefinitions: number[];
    totalSolutionsCount: number | null; // null means that calculation has not started yet
    isCalculating: boolean;
    fetchMoreSolutions: (fromIndex: number) => void;
}

export function Solutions({
    displaySolutions,
    targetRating,
    columnDefinitions,
    totalSolutionsCount,
    isCalculating,
    fetchMoreSolutions
}: ISolutionsProps) {
    return (
        <div className="solutions">
            <h2>
                Solutions{" "}
                {(totalSolutionsCount || 0) > 0 && (
                    <Badge value={totalSolutionsCount} size="large" />
                )}
            </h2>
            <small>
                Each row in this table represents a group of player ratings you
                must acquire in order to achieve the target rating
                {targetRating && (
                    <>
                        {" "}
                        of <strong>{targetRating}</strong>
                    </>
                )}
            </small>

            <InfiniteScroll
                dataLength={displaySolutions.length}
                next={
                    isCalculating
                        ? () => -1
                        : () => fetchMoreSolutions(displaySolutions.length)
                }
                hasMore={
                    !isCalculating &&
                    (totalSolutionsCount || 0) > displaySolutions.length
                }
                loader={isCalculating ? <></> : <Loading />}
                className="infinite-scroll">
                <table className="mt-3 solutions-table">
                    <thead className="sticky-header">
                        <tr>
                            {columnDefinitions.map((cd, index) => (
                                <RatingCell key={index} isHeader value={cd} />
                            ))}
                            <PriceCell value="Price" isHeader />
                        </tr>
                    </thead>
                    <tbody>
                        {displaySolutions.map((solution) => (
                            <tr key={solution.id}>
                                {columnDefinitions.map(
                                    (columnDefinition, columnIndex) => (
                                        <RatingCell
                                            key={`row${solution.id}col${columnIndex}`}
                                            value={
                                                solution.ratings.filter(
                                                    (rating) =>
                                                        rating ===
                                                        columnDefinition
                                                ).length
                                            }
                                        />
                                    )
                                )}
                                <PriceCell value={solution.price} />
                            </tr>
                        ))}
                        {displaySolutions.length === 0 && (
                            <tr>
                                {columnDefinitions.map((_, index) =>
                                    isCalculating ? (
                                        <SkeletonCell key={index} />
                                    ) : (
                                        <RatingCell key={index} value={0} />
                                    )
                                )}
                                {isCalculating ? (
                                    <SkeletonCell />
                                ) : (
                                    <PriceCell value={0} />
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </InfiniteScroll>

            {totalSolutionsCount !== null && totalSolutionsCount === 0 && (
                <Message
                    severity="error"
                    text="No possible solutions exist — Try again with a different configuration"
                    className="my-5"
                />
            )}

            {isCalculating &&
                (totalSolutionsCount || 0) > displaySolutions.length && (
                    <Message
                        severity="warn"
                        text={`Only the cheapest ${displaySolutions.length} solutions are shown
                    while calculating`}
                        className="my-5"
                    />
                )}
        </div>
    );
}

const Loading = () => {
    return (
        <div className="loader-container">
            <Spinner.Ellipsis />
            <h5>Loading...</h5>
        </div>
    );
};

const SkeletonCell = () => {
    return <Cell type="skeleton" isHeader={false} value="" />;
};

const PriceCell = ({
    isHeader = false,
    value
}: {
    isHeader?: boolean;
    value: number | string;
}) => {
    return <Cell type="price" isHeader={isHeader} value={value} />;
};

const RatingCell = ({
    isHeader = false,
    value
}: {
    isHeader?: boolean;
    value: number | string;
}) => {
    return <Cell type="rating" isHeader={isHeader} value={value} />;
};

const Cell = ({
    type,
    isHeader,
    value
}: {
    type: "rating" | "price" | "skeleton";
    isHeader: boolean;
    value: string | number;
}) => {
    const className = `${type}-cell`;
    const valueComponent =
        type === "skeleton" ? (
            <Skeleton>{value}</Skeleton>
        ) : (
            <span>{value}</span>
        );
    if (isHeader) {
        return <th className={`${className}`}>{valueComponent}</th>;
    } else {
        return (
            <td className={className}>
                <span className={value === 0 ? "text-muted" : ""}>
                    {valueComponent}
                </span>
            </td>
        );
    }
};
