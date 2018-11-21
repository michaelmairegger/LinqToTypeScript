"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicEnumerable_1 = require("../BasicEnumerable");
function takeWhile(source, predicate) {
    if (predicate.length === 1) {
        return takeWhile_1(source, predicate);
    }
    else {
        return takeWhile_2(source, predicate);
    }
}
exports.takeWhile = takeWhile;
function takeWhile_1(source, predicate) {
    function* iterator() {
        for (const item of source) {
            if (predicate(item)) {
                yield item;
            }
            else {
                break;
            }
        }
    }
    return new BasicEnumerable_1.BasicEnumerable(iterator);
}
function takeWhile_2(source, predicate) {
    function* iterator() {
        let index = 0;
        for (const item of source) {
            if (predicate(item, index++)) {
                yield item;
            }
            else {
                break;
            }
        }
    }
    return new BasicEnumerable_1.BasicEnumerable(iterator);
}