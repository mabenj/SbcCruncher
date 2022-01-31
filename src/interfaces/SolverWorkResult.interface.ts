export default interface ISolverWorkResult {
	status: "DONE" | "COMBINATION";
	combination: number[];
	resultChunk: number[][];
}
