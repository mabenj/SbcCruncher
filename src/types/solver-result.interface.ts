import { Solution } from "./solution.interface";

export interface SolverResult {
    progress: number;
    solutions: Solution[];
    solutionsTotalCount: number;
}
