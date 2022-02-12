import { atomWithHash } from "jotai/utils";
import Config from "../Config";
import { deserializeRatingOption, serializeRatingOption } from "../util/utils";

const KEY_MIN = "min";
const KEY_MAX = "max";

export const tryRatingMinAtom = atomWithHash<number>(
	KEY_MIN,
	Config.defaultTryMin,
	{
		serialize: serializeRatingOption,
		deserialize: (str) => deserializeRatingOption(str) || Config.defaultTryMin,
		replaceState: true
	}
);

export const tryRatingMaxAtom = atomWithHash<number>(
	KEY_MAX,
	Config.defaultTryMax,
	{
		serialize: serializeRatingOption,
		deserialize: (str) => deserializeRatingOption(str) || Config.defaultTryMax,
		replaceState: true
	}
);
