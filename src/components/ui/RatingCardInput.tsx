import { ALL_RATINGS } from "@/constants";
import {
    Box,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger
} from "@chakra-ui/react";
import RatingCard from "./RatingCard";
import RatingCardCarouselSelect from "./RatingCardCarouselSelect";

interface RatingCardInputProps {
    rating: number;
    onChange: (rating: number) => void;
    customRange?: number[];
    selection?: number[];
    reverseOptions?: boolean;
}

export default function RatingCardInput(props: RatingCardInputProps) {
    const ratingRange = props.customRange ?? ALL_RATINGS;

    return (
        <Popover placement="top-start">
            {({ onClose }) => (
                <>
                    <PopoverTrigger>
                        <Box tabIndex={0} role="button" maxW="max-content">
                            <RatingCard rating={props.rating} actionable />
                        </Box>
                    </PopoverTrigger>
                    <PopoverContent
                        w="min(100vw - 35px, 600px)"
                        p={0}
                        m={0}
                        mx={2}>
                        <PopoverArrow />
                        <PopoverBody w="100%" p={2} m={0}>
                            <RatingCardCarouselSelect
                                ratingRange={ratingRange}
                                value={props.rating}
                                onChange={(newRating) => {
                                    props.onChange(newRating);
                                    onClose();
                                }}
                                selection={props.selection}
                                reverseOptions={props.reverseOptions}
                            />
                        </PopoverBody>
                    </PopoverContent>
                </>
            )}
        </Popover>
    );
}
