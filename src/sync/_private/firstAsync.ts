import { ErrorString, InvalidOperationException } from "../../shared"

/**
 * Returns the first element in a sequence that satisfies a specified condition.
 * @param source An Iterable<T> to return an element from.
 * @param predicate A function to test each element for a condition.
 * @throws {InvalidOperationException} No elements in Iteration matching predicate
 * @returns The first element in the sequence that passes the test in the specified predicate function.
 */
export async function firstAsync<T>(
    source: Iterable<T>, predicate: (x: T) => Promise<boolean>): Promise<T> {
    for (const value of source) {
        if (await predicate(value) === true) {
            return value
        }
    }

    throw new InvalidOperationException(ErrorString.NoMatch)
}
