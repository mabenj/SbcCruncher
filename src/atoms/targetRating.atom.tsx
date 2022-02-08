import { atomWithHash } from "jotai/utils";
import { IRatingOption } from "../interfaces";
import { deserializeRatingOption, serializeRatingOption } from "../util/utils";

const KEY = "target";

export const targetRatingAtom = atomWithHash<IRatingOption | undefined>(
	KEY,
	undefined,
	{
		serialize: serializeRatingOption,
		deserialize: deserializeRatingOption,
		replaceState: true
	}
);
