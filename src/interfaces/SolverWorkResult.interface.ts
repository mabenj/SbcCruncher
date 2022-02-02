import ISolution from "./Solution.interface";

export default interface ISolverWorkResult {
	status: "DONE" | "IN_PROGRESS";
	resultChunk: ISolution[];
}
