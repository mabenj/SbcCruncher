import { Solution } from "./solution.interface";

export interface SolverResponse {
    status: "ok" | "error";
    progress: number;
    solutions: Solution[];
    solutionsFound: number;
    done: boolean;
    error?: unknown;
}
