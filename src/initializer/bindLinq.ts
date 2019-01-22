import { IEnumerable, IEqualityComparer, IPrototype } from "../types"

import { aggregate } from "./../sync/_private/aggregate"
import { all } from "./../sync/_private/all"
import { allAsync } from "./../sync/_private/allAsync"
import { any } from "./../sync/_private/any"
import { anyAsync } from "./../sync/_private/anyAsync"
import { asAsync } from "./../sync/_private/asAsync"
import { asParallel } from "./../sync/_private/asParallel"
import { average } from "./../sync/_private/average"
import { averageAsync } from "./../sync/_private/averageAsync"
import { concat } from "./../sync/_private/concat"
import { contains } from "./../sync/_private/contains"
import { containsAsync } from "./../sync/_private/containsAsync"
import { count } from "./../sync/_private/count"
import { countAsync } from "./../sync/_private/countAsync"
import { distinct } from "./../sync/_private/distinct"
import { distinctAsync } from "./../sync/_private/distinctAsync"
import { each } from "./../sync/_private/each"
import { eachAsync } from "./../sync/_private/eachAsync"
import { elementAt } from "./../sync/_private/elementAt"
import { elementAtOrDefault } from "./../sync/_private/elementAtOrDefault"
import { except } from "./../sync/_private/except"
import { exceptAsync } from "./../sync/_private/exceptAsync"
import { first } from "./../sync/_private/first"
import { firstAsync } from "./../sync/_private/firstAsync"
import { firstOrDefault } from "./../sync/_private/firstOrDefault"
import { firstOrDefaultAsync } from "./../sync/_private/firstOrDefaultAsync"
import { groupBy } from "./../sync/_private/groupBy"
import { groupByAsync } from "./../sync/_private/groupByAsync"
import { groupByWithSel } from "./../sync/_private/groupByWithSel"
import { intersect } from "./../sync/_private/intersect"
import { intersectAsync } from "./../sync/_private/intersectAsync"
import { join } from "./../sync/_private/join"
import { last } from "./../sync/_private/last"
import { lastAsync } from "./../sync/_private/lastAsync"
import { lastOrDefault } from "./../sync/_private/lastOrDefault"
import { lastOrDefaultAsync } from "./../sync/_private/lastOrDefaultAsync"
import { max } from "./../sync/_private/max"
import { maxAsync } from "./../sync/_private/maxAsync"
import { min } from "./../sync/_private/min"
import { minAsync } from "./../sync/_private/minAsync"
import { ofType } from "./../sync/_private/ofType"
import { orderBy } from "./../sync/_private/orderBy"
import { orderByAsync } from "./../sync/_private/orderByAsync"
import { orderByDescending } from "./../sync/_private/orderByDescending"
import { orderByDescendingAsync } from "./../sync/_private/orderByDescendingAsync"
import { reverse } from "./../sync/_private/reverse"
import { select } from "./../sync/_private/select"
import { selectAsync } from "./../sync/_private/selectAsync"
import { selectMany } from "./../sync/_private/selectMany"
import { selectManyAsync } from "./../sync/_private/selectManyAsync"
import { sequenceEquals } from "./../sync/_private/sequenceEquals"
import { sequenceEqualsAsync } from "./../sync/_private/sequenceEqualsAsync"
import { single } from "./../sync/_private/single"
import { singleAsync } from "./../sync/_private/singleAsync"
import { singleOrDefault } from "./../sync/_private/singleOrDefault"
import { singleOrDefaultAsync } from "./../sync/_private/singleOrDefaultAsync"
import { skip } from "./../sync/_private/skip"
import { skipWhile } from "./../sync/_private/skipWhile"
import { skipWhileAsync } from "./../sync/_private/skipWhileAsync"
import { sum } from "./../sync/_private/sum"
import { sumAsync } from "./../sync/_private/sumAsync"
import { take } from "./../sync/_private/take"
import { takeWhile } from "./../sync/_private/takeWhile"
import { takeWhileAsync } from "./../sync/_private/takeWhileAsync"
import { toArray } from "./../sync/_private/toArray"
import { toMap } from "./../sync/_private/toMap"
import { toMapAsync } from "./../sync/_private/toMapAsync"
import { toSet } from "./../sync/_private/toSet"
import { union } from "./../sync/_private/union"
import { unionAsync } from "./../sync/_private/unionAsync"
import { where } from "./../sync/_private/where"
import { whereAsync } from "./../sync/_private/whereAsync"
import { zip } from "./../sync/_private/zip"
import { zipAsync } from "./../sync/_private/zipAsync"

/**
 * Binds LINQ methods to an iterable type
 * @param object Iterable Type
 */
export function bindLinq<T, Y extends Iterable<T>>(object: IPrototype<Y>): void {

    const prototype = object.prototype as IEnumerable<T>

    const bind = (func: (x: IEnumerable<T>, ...params: any[]) => any, optKey?: keyof IEnumerable<T>) => {
        const key = optKey || func.name as keyof IEnumerable<T>
        switch (func.length) {
            case 1:
                prototype[key] = function(this: IEnumerable<T>) {
                    return func(this)
                }
                return
            case 2:
                prototype[key] = function(this: IEnumerable<T>, a: any) {
                    return func(this, a)
                }
                return
            case 3:
                prototype[key] = function(this: IEnumerable<T>, a: any, b: any) {
                    return func(this, a, b)
                }
                return
            case 4:
                prototype[key] = function(this: IEnumerable<T>, a: any, b: any, c: any) {
                    return func(this, a, b, c)
                }
                return
            case 5:
                prototype[key] = function(this: IEnumerable<T>, a: any, b: any, c: any, d: any) {
                    return func(this, a, b, c, d)
                }
                return
            default:
                throw new Error("Invalid Function")
        }
    }

    bind(aggregate)
    bind(all)
    bind(allAsync)
    bind(any)
    bind(anyAsync)
    // TODO - Browsers not naming arrow functions properly
    bind(asAsync, "asAsync")
    bind(asParallel)
    bind(average)
    bind(averageAsync)
    bind(concat)
    prototype.contains = function(value: T, comparer?: IEqualityComparer<T>) {
        return contains(this, value, comparer)
    }
    bind(containsAsync)
    bind(count)
    bind(countAsync)
    prototype.distinct = function(comparer?: IEqualityComparer<T>) {
        return distinct(this, comparer)
    }
    bind(distinctAsync)
    bind(each)
    bind(eachAsync)
    bind(elementAt)
    bind(elementAtOrDefault)
    bind(except)
    bind(exceptAsync)
    bind(first)
    bind(firstAsync)
    bind(firstOrDefault)
    bind(firstOrDefaultAsync)
    bind(groupBy)
    bind(groupByAsync)
    bind(groupByWithSel)
    prototype.intersect = function(second: IEnumerable<T>, comparer?: IEqualityComparer<T>) {
        return intersect(this, second, comparer)
    }
    bind(intersectAsync)
    prototype.joinByKey = function<TInner, TKey, TResult>(
        inner: IEnumerable<TInner>,
        outerKeySelector: (x: T) => TKey,
        innerKeySelector: (x: TInner) => TKey,
        resultSelector: (x: T, y: TInner) => TResult,
        comparer?: IEqualityComparer<TKey>) {
        return join(this, inner, outerKeySelector, innerKeySelector, resultSelector, comparer)
    }
    bind(last)
    bind(lastAsync)
    bind(lastOrDefault)
    bind(lastOrDefaultAsync)
    bind(max)
    bind(maxAsync)
    bind(min)
    bind(minAsync)
    bind(ofType)
    bind(orderBy)
    bind(orderByAsync)
    bind(orderByDescending)
    bind(orderByDescendingAsync)
    bind(reverse)
    bind(select)
    bind(selectAsync)
    bind(selectMany)
    bind(selectManyAsync)
    prototype.sequenceEquals = function(second: IEnumerable<T>, comparer?: IEqualityComparer<T>) {
        return sequenceEquals(this, second, comparer)
    }
    bind(sequenceEqualsAsync)
    bind(single)
    bind(singleAsync)
    bind(singleOrDefault)
    bind(singleOrDefaultAsync)
    bind(skip)
    bind(skipWhile)
    bind(skipWhileAsync)
    bind(sum)
    bind(sumAsync)
    bind(take)
    bind(takeWhile)
    bind(takeWhileAsync)
    bind(toArray)
    bind(toMap)
    bind(toMapAsync)
    bind(toSet)
    bind(union)
    bind(unionAsync)
    bind(where)
    bind(whereAsync)
    bind(zip)
    bind(zipAsync)
}