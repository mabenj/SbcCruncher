import ISolution from "./Solution.interface";

export default interface ISolverWorkResult {
	status: "DONE" | "IN_PROGRESS";
	cheapestSolutions: ISolution[];
	percent: number;
	totalSolutionCount: number;
}
