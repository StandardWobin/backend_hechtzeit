import { expect, test } from 'vitest'

import { fileSysCheck, envCheck, stringify, sleep, strcmp, resultHandler } from "./src/utils/helpers.js";


test('fileSysCheck', () => {
  fileSysCheck([{ link: 'DEMO' }]);
})


test('envCheck', () => {
  expect(()=> {envCheck()}).toThrow('Unsupported Server start! - please launch via "npm run dev" or "npm run build"');
})

test('stringify', () => {
  expect(stringify({ id: "test" })).toBe('{id: test}')
  // recurive
  expect(stringify({ id: "test", id2: { id: "test" } })).toBe('{id: test, id2: {id: test}}')
  expect(stringify({ id: "test", id2: { id: [1, 2, 3, 43, 54] } })).toBe('{id: test, id2: {id: [1, 2, 3, 43, 54]}}')
})


test("sleep", async () => {
  const start = Date.now();
  await sleep(100).then(() => {
    const end = Date.now();
    return expect(end - start).greaterThanOrEqual(100);
  }

  );
  await sleep(500).then(() => {
    const end = Date.now();
    return expect(end - start).greaterThanOrEqual(500);
  }
  );

})


test('strcmp', () => {

  // trivial
  expect(strcmp("hallo", "hallo")).toBe(true);
  expect(strcmp("hall", "hallo")).toBe(false);
  expect(strcmp('hallo', 'hallo')).toBe(true);

  // asterix missmatch
  expect(strcmp('hall', "hallo")).toBe(false);
  expect(strcmp('hallo', "hallo")).toBe(true);

  // special chars
  expect(strcmp('\s\n&/$§)=§(/=!§=(=)8392847932847ß13847äaüaööü', "\s\n&/$§)=§(/=!§=(=)8392847932847ß13847äaüaööü")).toBe(true);

  // string to sting only
  expect(() => {strcmp('5', 5)}).toThrow("a and b must be Strings");
  expect(() => {strcmp('5', ["5"])}).toThrow("a and b must be Strings");

})



test('resultHandler', () => {

  // trivial
  // type, size_mc

  // everthing except 1 2 3 is ignored
  expect(resultHandler({type:0}, undefined)).toStrictEqual([]) 
  expect(resultHandler({type:4}, undefined)).toStrictEqual([]) 
  expect(resultHandler({type:5}, undefined)).toStrictEqual([]) 
  expect(resultHandler({type:6}, undefined)).toStrictEqual([]) 
  expect(resultHandler({type:7}, undefined)).toStrictEqual([]) 
  expect(resultHandler({type:0}, ["somthing uninteresting"])).toStrictEqual([]) 
  expect(resultHandler({type:4}, ["somthing uninteresting"])).toStrictEqual([]) 
  expect(resultHandler({type:5}, ["somthing uninteresting"])).toStrictEqual([]) 
  expect(resultHandler({type:6}, ["somthing uninteresting"])).toStrictEqual([]) 
  expect(resultHandler({type:7}, ["somthing uninteresting"])).toStrictEqual([]) 


  // 1 Multiple Choice 
  expect(() => {resultHandler({type:1})}).toThrow("Scene has no MC size") 
  expect(() => {resultHandler({type:1, size_mc:"12"})}).toThrow("Scene mc size is not a number") 
  expect(() => {resultHandler({type:1, size_mc:4})}).toThrow("For Scenes type 1, there is row data to be defined") 
  expect(() => {resultHandler({type:1, size_mc:4}, "[0,2,3.4]")}).toThrow("For Scenes type 1, row data has to be an array") 


 let data = [
    {"message" : 1},
    {"message" : 2},
    {"message" : 3},
    {"message" : 4},
    {"message" : 1},
    {"message" : 1}
  ];

  expect(resultHandler({type:1, size_mc:4}, data)).toStrictEqual([3,1,1,1]) 

  let data2 = [
    {"message" : 1},
    {"message" : 1},
    {"message" : 1},
    {"message" : 1},
    {"message" : 1},
    {"message" : 1}
  ];

  expect(resultHandler({type:1, size_mc:3}, data2)).toStrictEqual([6,0,0]) 






})

