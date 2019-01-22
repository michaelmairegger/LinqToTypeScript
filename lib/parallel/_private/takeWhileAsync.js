"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicParallelEnumerable_1 = require("../BasicParallelEnumerable");
/**
 * Returns elements from a sequence as long as a specified condition is true.
 * The element's index is used in the logic of the predicate function.
 * @param source The sequence to return elements from.
 * @param predicate An async function to test each source element for a condition;
 * the second parameter of the function represents the index of the source element.
 * @return An IParallelEnumerable<T> that contains elements
 * from the input sequence that occur before the element at which the test no longer passes.
 */
function takeWhileAsync(source, predicate) {
    const generator = () => __awaiter(this, void 0, void 0, function* () {
        const values = yield source.toArray();
        const results = new Array();
        if (predicate.length === 1) {
            const sPredicate = predicate;
            for (const value of values) {
                if ((yield sPredicate(value)) === true) {
                    results.push(value);
                }
                else {
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                if ((yield predicate(value, i)) === true) {
                    results.push(value);
                }
                else {
                    break;
                }
            }
        }
        return results;
    });
    return new BasicParallelEnumerable_1.BasicParallelEnumerable({
        generator,
        type: 0 /* PromiseToArray */,
    });
}
exports.takeWhileAsync = takeWhileAsync;