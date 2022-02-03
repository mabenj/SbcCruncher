import { atomWithHash } from "jotai/utils";
import IPriceInfo from "../interfaces/PriceInfo.interface";

const KEY = "prices";

export const pricesAtom = atomWithHash<IPriceInfo>(
	KEY,
	{},
	{
		serialize: serialize,
		deserialize: deserialize,
		replaceState: true
	}
);

function serialize(val: IPriceInfo): string {
	let result = [];
	for (const [rating, price] of Object.entries(val)) {
		result.push(`${rating}_${price}`);
	}
	return result.join("-");
}

function deserialize(str: string): IPriceInfo {
	let result: IPriceInfo = {};
	const kvpList = str.split("-");
	for (const kvp of kvpList) {
		const [rating, price] = kvp.split("_");
		result[Number(rating)] = Number(price);
	}
	return result;
}
