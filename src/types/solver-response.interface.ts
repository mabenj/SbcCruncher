import { Solution } from "./solution.interface";

export interface SolverResponse{
    progress: number;
    solutions: Solution[],
    solutionsFound: number;
    done: boolean;
}