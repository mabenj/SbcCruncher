export default interface ISolverWorkResult {
	status: "DONE" | "IN_PROGRESS";
	resultChunk: number[][];
}
