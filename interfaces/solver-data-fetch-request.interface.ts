export interface ISolverDataFetchRequest {
    discriminator: "SOLVER-FETCH";
    fromIndex: number;
}

export function instanceOfISolverDataFetchRequest(
    object: any
): object is ISolverDataFetchRequest {
    return object.discriminator === "SOLVER-FETCH";
}
