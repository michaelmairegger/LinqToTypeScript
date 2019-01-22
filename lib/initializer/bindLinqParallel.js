"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aggregate_1 = require("./../parallel/_private/aggregate");
const all_1 = require("./../parallel/_private/all");
const allAsync_1 = require("./../parallel/_private/allAsync");
const any_1 = require("./../parallel/_private/any");
const anyAsync_1 = require("./../parallel/_private/anyAsync");
const asAsync_1 = require("./../parallel/_private/asAsync");
const average_1 = require("./../parallel/_private/average");
const averageAsync_1 = require("./../parallel/_private/averageAsync");
const concat_1 = require("./../parallel/_private/concat");
const contains_1 = require("./../parallel/_private/contains");
const containsAsync_1 = require("./../parallel/_private/containsAsync");
const count_1 = require("./../parallel/_private/count");
const countAsync_1 = require("./../parallel/_private/countAsync");
const distinct_1 = require("./../parallel/_private/distinct");
const distinctAsync_1 = require("./../parallel/_private/distinctAsync");
const each_1 = require("./../parallel/_private/each");
const eachAsync_1 = require("./../parallel/_private/eachAsync");
const elementAt_1 = require("./../parallel/_private/elementAt");
const elementAtOrDefault_1 = require("./../parallel/_private/elementAtOrDefault");
const except_1 = require("./../parallel/_private/except");
const exceptAsync_1 = require("./../parallel/_private/exceptAsync");
const first_1 = require("./../parallel/_private/first");
const firstAsync_1 = require("./../parallel/_private/firstAsync");
const firstOrDefault_1 = require("./../parallel/_private/firstOrDefault");
const firstOrDefaultAsync_1 = require("./../parallel/_private/firstOrDefaultAsync");
const groupBy_1 = require("./../parallel/_private/groupBy");
const groupByAsync_1 = require("./../parallel/_private/groupByAsync");
const groupByWithSel_1 = require("./../parallel/_private/groupByWithSel");
const intersect_1 = require("./../parallel/_private/intersect");
const intersectAsync_1 = require("./../parallel/_private/intersectAsync");
const join_1 = require("./../parallel/_private/join");
const last_1 = require("./../parallel/_private/last");
const lastAsync_1 = require("./../parallel/_private/lastAsync");
const lastOrDefault_1 = require("./../parallel/_private/lastOrDefault");
const lastOrDefaultAsync_1 = require("./../parallel/_private/lastOrDefaultAsync");
const max_1 = require("./../parallel/_private/max");
const maxAsync_1 = require("./../parallel/_private/maxAsync");
const min_1 = require("./../parallel/_private/min");
const minAsync_1 = require("./../parallel/_private/minAsync");
const ofType_1 = require("./../parallel/_private/ofType");
const orderBy_1 = require("./../parallel/_private/orderBy");
const orderByAsync_1 = require("./../parallel/_private/orderByAsync");
const orderByDescending_1 = require("./../parallel/_private/orderByDescending");
const orderByDescendingAsync_1 = require("./../parallel/_private/orderByDescendingAsync");
const reverse_1 = require("./../parallel/_private/reverse");
const select_1 = require("./../parallel/_private/select");
const selectAsync_1 = require("./../parallel/_private/selectAsync");
const selectMany_1 = require("./../parallel/_private/selectMany");
const selectManyAsync_1 = require("./../parallel/_private/selectManyAsync");
const sequenceEquals_1 = require("./../parallel/_private/sequenceEquals");
const sequenceEqualsAsync_1 = require("./../parallel/_private/sequenceEqualsAsync");
const single_1 = require("./../parallel/_private/single");
const singleAsync_1 = require("./../parallel/_private/singleAsync");
const singleOrDefault_1 = require("./../parallel/_private/singleOrDefault");
const singleOrDefaultAsync_1 = require("./../parallel/_private/singleOrDefaultAsync");
const skip_1 = require("./../parallel/_private/skip");
const skipWhile_1 = require("./../parallel/_private/skipWhile");
const skipWhileAsync_1 = require("./../parallel/_private/skipWhileAsync");
const sum_1 = require("./../parallel/_private/sum");
const sumAsync_1 = require("./../parallel/_private/sumAsync");
const take_1 = require("./../parallel/_private/take");
const takeWhile_1 = require("./../parallel/_private/takeWhile");
const takeWhileAsync_1 = require("./../parallel/_private/takeWhileAsync");
const toArray_1 = require("./../parallel/_private/toArray");
const toMap_1 = require("./../parallel/_private/toMap");
const toMapAsync_1 = require("./../parallel/_private/toMapAsync");
const toSet_1 = require("./../parallel/_private/toSet");
const union_1 = require("./../parallel/_private/union");
const unionAsync_1 = require("./../parallel/_private/unionAsync");
const where_1 = require("./../parallel/_private/where");
const whereAsync_1 = require("./../parallel/_private/whereAsync");
const zip_1 = require("./../parallel/_private/zip");
const zipAsync_1 = require("./../parallel/_private/zipAsync");
/**
 * Binds LINQ methods to an iterable type
 * @param object Iterable Type
 */
function bindLinqParallel(object) {
    const wPrototype = object.prototype;
    const prototype = wPrototype;
    const bind = (func, optKey) => {
        const key = optKey || func.name;
        switch (func.length) {
            case 1:
                wPrototype[key] = function () {
                    return func(this);
                };
                return;
            case 2:
                wPrototype[key] = function (a) {
                    return func(this, a);
                };
                return;
            case 3:
                wPrototype[key] = function (a, b) {
                    return func(this, a, b);
                };
                return;
            case 4:
                wPrototype[key] = function (a, b, c) {
                    return func(this, a, b, c);
                };
                return;
            case 5:
                wPrototype[key] = function (a, b, c, d) {
                    return func(this, a, b, c, d);
                };
                return;
            default:
                throw new Error("Invalid Function");
        }
    };
    bind(aggregate_1.aggregate);
    bind(all_1.all);
    bind(allAsync_1.allAsync);
    bind(any_1.any);
    bind(anyAsync_1.anyAsync);
    bind(asAsync_1.asAsync, "asAsync");
    // bind(asParallel)
    bind(average_1.average);
    bind(averageAsync_1.averageAsync);
    bind(concat_1.concat);
    prototype.contains = function (value, comparer) {
        return contains_1.contains(this, value, comparer);
    };
    bind(containsAsync_1.containsAsync);
    bind(count_1.count);
    bind(countAsync_1.countAsync);
    prototype.distinct = function (comparer) {
        return distinct_1.distinct(this, comparer);
    };
    bind(distinctAsync_1.distinctAsync);
    bind(each_1.each);
    bind(eachAsync_1.eachAsync);
    bind(elementAt_1.elementAt);
    bind(elementAtOrDefault_1.elementAtOrDefault);
    bind(except_1.except);
    bind(exceptAsync_1.exceptAsync);
    bind(first_1.first);
    bind(firstAsync_1.firstAsync);
    bind(firstOrDefault_1.firstOrDefault);
    bind(firstOrDefaultAsync_1.firstOrDefaultAsync);
    bind(groupBy_1.groupBy);
    bind(groupByAsync_1.groupByAsync);
    bind(groupByWithSel_1.groupByWithSel);
    prototype.intersect = function (second, comparer) {
        return intersect_1.intersect(this, second, comparer);
    };
    bind(intersectAsync_1.intersectAsync);
    prototype.joinByKey = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        return join_1.join(this, inner, outerKeySelector, innerKeySelector, resultSelector, comparer);
    };
    bind(last_1.last);
    bind(lastAsync_1.lastAsync);
    bind(lastOrDefault_1.lastOrDefault);
    bind(lastOrDefaultAsync_1.lastOrDefaultAsync);
    bind(max_1.max);
    bind(maxAsync_1.maxAsync);
    bind(min_1.min);
    bind(minAsync_1.minAsync);
    bind(ofType_1.ofType);
    bind(orderBy_1.orderBy);
    bind(orderByAsync_1.orderByAsync);
    bind(orderByDescending_1.orderByDescending);
    bind(orderByDescendingAsync_1.orderByDescendingAsync);
    bind(reverse_1.reverse);
    bind(select_1.select);
    bind(selectAsync_1.selectAsync);
    bind(selectMany_1.selectMany);
    bind(selectManyAsync_1.selectManyAsync);
    prototype.sequenceEquals = function (second, comparer) {
        return sequenceEquals_1.sequenceEquals(this, second, comparer);
    };
    bind(sequenceEqualsAsync_1.sequenceEqualsAsync);
    bind(single_1.single);
    bind(singleAsync_1.singleAsync);
    bind(singleOrDefault_1.singleOrDefault);
    bind(singleOrDefaultAsync_1.singleOrDefaultAsync);
    bind(skip_1.skip);
    bind(skipWhile_1.skipWhile);
    bind(skipWhileAsync_1.skipWhileAsync);
    bind(sum_1.sum);
    bind(sumAsync_1.sumAsync);
    bind(take_1.take);
    bind(takeWhile_1.takeWhile);
    bind(takeWhileAsync_1.takeWhileAsync);
    bind(toArray_1.toArray);
    bind(toMap_1.toMap);
    bind(toMapAsync_1.toMapAsync);
    bind(toSet_1.toSet);
    bind(union_1.union);
    bind(unionAsync_1.unionAsync);
    bind(where_1.where);
    bind(whereAsync_1.whereAsync);
    bind(zip_1.zip);
    bind(zipAsync_1.zipAsync);
}
exports.bindLinqParallel = bindLinqParallel;