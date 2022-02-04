import ISolution from "./Solution.interface";

export default interface ISolverWorkResult {
	status: "DONE" | "IN_PROGRESS" | "DATA_FETCH";
	solutions: ISolution[];
	percent: number;
	totalSolutionCount: number;
}
