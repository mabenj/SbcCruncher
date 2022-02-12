import { atomWithHash } from "jotai/utils";
import Config from "../Config";
import { IRatingOption } from "../interfaces";
import { deserializeRatingOption, serializeRatingOption } from "../util/utils";

const KEY = "players";

export const existingRatingsAtom = atomWithHash<number[] | undefined>(
	KEY,
	undefined,
	{
		serialize: serializeRatingOptions,
		deserialize: deserializeRatingOptions,
		replaceState: true
	}
);

function serializeRatingOptions(values: number[] | undefined): string {
	return values?.map((value) => serializeRatingOption(value)).join("-") || "";
}

function deserializeRatingOptions(str: string): number[] | undefined {
	if (!str) {
		return undefined;
	}
	const ratings = str
		.split("-")
		.map(deserializeRatingOption)
		.filter((ro): ro is number => !!ro);
	const validRatings = ratings
		.filter((rating) => Config.allRatings.find((ro) => ro === rating))
		.slice(0, Config.playersInSquad - 1);
	return validRatings;
}
