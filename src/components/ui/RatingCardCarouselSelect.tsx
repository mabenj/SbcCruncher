import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import RatingCard from "./RatingCard";

interface RatingCardCarouselSelectProps {
    ratingRange: number[];
    value: number;
    onChange: (value: number) => void;
    selection?: number[];
    reverseOptions?: boolean;
}

export default function RatingCardCarouselSelect(
    props: RatingCardCarouselSelectProps
) {
    const prevRating = useRef(-1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedCardRef = useRef<HTMLDivElement>(null);

    const order = props.reverseOptions ? 1 : -1;

    useEffect(() => {
        if (props.value === prevRating.current) {
            return;
        }
        prevRating.current = props.value;
        if (!selectedCardRef.current || !scrollContainerRef.current) {
            return;
        }
        const offsetLeft = selectedCardRef.current.offsetLeft;
        const centerPoint = scrollContainerRef.current.clientWidth / 2;
        scrollContainerRef.current.scrollLeft = offsetLeft - centerPoint;
    }, [props]);

    return (
        <Flex
            ref={scrollContainerRef}
            gap={3}
            wrap={["nowrap", null, "wrap"]}
            overflow="auto"
            maxH="400px"
            py={5}
            px={2}
            scrollBehavior="smooth"
            style={scrollShadows}>
            {props.ratingRange.map((rating) => (
                <Box
                    key={rating}
                    ref={rating === props.value ? selectedCardRef : null}
                    onClick={() => props.onChange(rating)}
                    order={[rating * order]}>
                    <RatingCard
                        rating={rating}
                        actionable
                        selected={rating === props.value}
                        altSelected={props.selection?.includes(rating)}
                    />
                </Box>
            ))}
        </Flex>
    );
}

const scrollShadows: React.CSSProperties = {
    // backgroundImage: `
    //     linear-gradient(to right, white, white),
    //     linear-gradient(to right, white, white),
    //     linear-gradient(to right, rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0)),
    //     linear-gradient(to left, rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0))
    // `,
    // backgroundPosition: "left center, right center, left center, right center",
    // backgroundRepeat: "no-repeat",
    // backgroundColor: "white",
    // backgroundSize: "20px 100%, 20px 100%, 10px 100%, 10px 100%",
    // backgroundAttachment: "local, local, scroll, scroll",
    // zIndex: 99
};
