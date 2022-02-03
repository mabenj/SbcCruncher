import { atomWithHash } from "jotai/utils";
import Config from "../Config";
import IRatingOption from "../interfaces/RatingOption.interface";
import { deserializeRatingOption, serializeRatingOption } from "../util/utils";

const KEY = "existingPlayers";

export const existingRatingsAtom = atomWithHash<IRatingOption[] | undefined>(
	KEY,
	undefined,
	{
		serialize: serializeRatingOptions,
		deserialize: deserializeRatingOptions,
		replaceState: true
	}
);

function serializeRatingOptions(values: IRatingOption[] | undefined): string {
	return values?.map((value) => serializeRatingOption(value)).join("-") || "";
}

function deserializeRatingOptions(str: string): IRatingOption[] | undefined {
	if (!str) {
		return undefined;
	}
	const ratings = str
		.split("-")
		.map(deserializeRatingOption)
		.filter((ro): ro is IRatingOption => !!ro);
	const validRatings = ratings
		.filter((rating) =>
			Config.ratingOptions.find((ro) => ro.ratingValue === rating?.ratingValue)
		)
		.slice(0, Config.playersInSquad - 1);
	return validRatings;
}
