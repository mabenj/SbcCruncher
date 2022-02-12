import { atomWithHash } from "jotai/utils";
import { deserializeRatingOption, serializeRatingOption } from "../util/utils";

const KEY = "target";

export const targetRatingAtom = atomWithHash<number | undefined>(
	KEY,
	undefined,
	{
		serialize: serializeRatingOption,
		deserialize: deserializeRatingOption,
		replaceState: true
	}
);
