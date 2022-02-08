import { ISolution } from "./";

export interface ISolverWorkResult {
	status: "DONE" | "IN_PROGRESS" | "DATA_FETCH";
	solutions: ISolution[];
	percent: number;
	totalSolutionCount: number;
}
