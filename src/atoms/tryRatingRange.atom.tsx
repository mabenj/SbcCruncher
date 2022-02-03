import { atomWithHash } from "jotai/utils";
import Config from "../Config";
import IRatingOption from "../interfaces/RatingOption.interface";
import { deserializeRatingOption, serializeRatingOption } from "../util/utils";

const KEY_MIN = "tryMin";
const KEY_MAX = "tryMax";

export const tryRatingMinAtom = atomWithHash<IRatingOption>(
	KEY_MIN,
	Config.defaultTryMin,
	{
		serialize: serializeRatingOption,
		deserialize: (str) => deserializeRatingOption(str) || Config.defaultTryMin,
		replaceState: true
	}
);

export const tryRatingMaxAtom = atomWithHash<IRatingOption>(
	KEY_MAX,
	Config.defaultTryMax,
	{
		serialize: serializeRatingOption,
		deserialize: (str) => deserializeRatingOption(str) || Config.defaultTryMax,
		replaceState: true
	}
);
