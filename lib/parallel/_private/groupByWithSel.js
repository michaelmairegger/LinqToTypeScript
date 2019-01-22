"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Grouping_1 = require("../../sync/Grouping");
const BasicParallelEnumerable_1 = require("../BasicParallelEnumerable");
function groupByWithSel(source, keySelector, elementSelector, comparer) {
    if (comparer) {
        return groupBy_1(source, keySelector, elementSelector, comparer);
    }
    else {
        return groupBy_1_Simple(source, keySelector, elementSelector);
    }
}
exports.groupByWithSel = groupByWithSel;
function groupBy_1(source, keySelector, elementSelector, comparer) {
    const generator = () => __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        const keyMap = new Array();
        try {
            for (var source_1 = __asyncValues(source), source_1_1; source_1_1 = yield source_1.next(), !source_1_1.done;) {
                const value = source_1_1.value;
                const key = keySelector(value);
                let found = false;
                for (let i = 0; i < keyMap.length; i++) {
                    const group = keyMap[i];
                    if (comparer(group.key, key)) {
                        group.push(elementSelector(value));
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    const element = elementSelector(value);
                    keyMap.push(new Grouping_1.Grouping(key, element));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (source_1_1 && !source_1_1.done && (_a = source_1.return)) yield _a.call(source_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const results = new Array();
        for (const value of keyMap) {
            results.push(value);
        }
        return results;
    });
    return new BasicParallelEnumerable_1.BasicParallelEnumerable({
        generator,
        type: 0 /* PromiseToArray */,
    });
}
function groupBy_1_Simple(source, keySelector, elementSelector) {
    // generate(): AsyncIterableIterator<IGrouping<string | number, TElement>>
    const generator = () => __awaiter(this, void 0, void 0, function* () {
        const keyMap = {};
        for (const value of yield source.toArray()) {
            const key = keySelector(value);
            const grouping = keyMap[key];
            const element = elementSelector(value);
            if (grouping) {
                grouping.push(element);
            }
            else {
                keyMap[key] = new Grouping_1.Grouping(key, element);
            }
        }
        /* tslint:disable:forin */
        const results = new Array();
        for (const value in keyMap) {
            results.push(keyMap[value]);
        }
        /* tslint:enable:forin */
        return results;
    });
    return new BasicParallelEnumerable_1.BasicParallelEnumerable({
        generator,
        type: 0 /* PromiseToArray */,
    });
}