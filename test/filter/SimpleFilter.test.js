import { expect, test } from 'vitest'

import { SimpleFilter } from "./src/filter/SimpleFilter.js";
import { Logger } from "./src/utils/Logger.js";

// dummy logger
let logger = new Logger(-1,-1, "foobar");

test('german', () => {
    let lan = ["de"];
    let sp = new SimpleFilter(logger, lan);
    expect(sp.filter("Cool ist das")).toBe("Cool ist das")
    expect(sp.filter("Arsch")).toBe("*****");
    expect(sp.filter("Arsch")).toBe("*****");
    expect(sp.filter("Du bist ein Arsch")).toBe("Du bist ein *****");
    expect(sp.filter("Du bist ein Arsch")).toBe("Du bist ein *****");
})
  

test('english', () => {
    let lan = ["en"];
    let sp = new SimpleFilter(logger, lan);
    expect(sp.filter("lalaAss")).toBe("lala***");
    expect(sp.filter("lAlaAss")).toBe("lAla***");
})
  

test('multilanguage', () => {
    let lan = ["en", "de"];
    let sp = new SimpleFilter(logger, lan);
    expect(sp.filter("Arsch is a ass")).toBe("***** is a ***");
    expect(sp.filter("im a gently text ''")).toBe("im a gently text ''");
})


test('IDint', () => {
    let lan = ["en", "de"];
    let sp = new SimpleFilter(logger, lan);
    expect(sp.filter(13123)).toStrictEqual(13123);
})


test('ID2dict', () => {
    let lan = ["en", "de"];
    let sp = new SimpleFilter(logger, lan);
    expect(sp.filter({id: "asdasdasd"})).toStrictEqual({id: "asdasdasd"});
})

test('scenefilter', () => {
    let lan = ["en", "de"];
    let sp = new SimpleFilter(logger, lan);
    sp.sceneFilter({username: "Arsch", message:"ich arsch"}, false, (res) => {
        expect(res).toStrictEqual({username: "*****", message:"ich *****"})
    });
})
  