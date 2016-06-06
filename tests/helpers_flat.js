/*
 *  helper_unroll.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-05
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const assert = require("assert");
const helpers = require("../helpers");

const d = {
    "a": 1,
    "b": {
        "c": "Hello",
        "d": "There",
    },
    "e": [ 1, 2, 3 ],
    "f": [],
    "g": null,
};

describe("helpers", function() {
    describe("flat_get", function() {
        it("number", function() {
            const key = "a";
            const expect = d["a"];
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
        it("dictionary", function() {
            const key = "b";
            const expect = d["b"];
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
        it("array", function() {
            const key = "e";
            const expect = d["e"];
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
        it("array (empty)", function() {
            const key = "f";
            const expect = d["f"];
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
        it("null", function() {
            const key = "g";
            const expect = d["g"];
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
        it("non-existent", function() {
            const key = "h";
            const expect = undefined;
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
        it("non-existent (otherwise)", function() {
            const key = "h";
            const expect = "otherwise";
            const got = helpers.flat_get(d, key, "otherwise");
            assert.deepEqual(expect, got);
        });
        it("non-existent (deep)", function() {
            const key = "b/c";
            const expect = undefined;
            const got = helpers.flat_get(d, key);
            assert.deepEqual(expect, got);
        });
    })
    describe("flat_first", function() {
        it("number", function() {
            const key = "a";
            const expect = d["a"];
            const got = helpers.flat_first(d, key);
            assert.deepEqual(expect, got);
        });
        it("dictionary", function() {
            const key = "b";
            const expect = d["b"];
            const got = helpers.flat_first(d, key);
            assert.deepEqual(expect, got);
        });
        it("array", function() {
            const key = "e";
            const expect = d["e"][0];
            const got = helpers.flat_first(d, key);
            assert.deepEqual(expect, got);
        });
        it("array (empty)", function() {
            const key = "f";
            const expect = "otherwise";
            const got = helpers.flat_first(d, key, "otherwise");
            assert.deepEqual(expect, got);
        });
        it("null", function() {
            const key = "g";
            const expect = d["g"];
            const got = helpers.flat_first(d, key);
            assert.deepEqual(expect, got);
        });
        it("non-existent", function() {
            const key = "h";
            const expect = undefined;
            const got = helpers.flat_first(d, key);
            assert.deepEqual(expect, got);
        });
        it("non-existent (otherwise)", function() {
            const key = "h";
            const expect = "otherwise";
            const got = helpers.flat_first(d, key, "otherwise");
            assert.deepEqual(expect, got);
        });
        it("non-existent (deep)", function() {
            const key = "b/c";
            const expect = undefined;
            const got = helpers.flat_first(d, key);
            assert.deepEqual(expect, got);
        });
    })
    describe("flat_list", function() {
        it("number", function() {
            const key = "a";
            const expect = [ d["a"] ];
            const got = helpers.flat_list(d, key);
            assert.deepEqual(expect, got);
        });
        it("dictionary", function() {
            const key = "b";
            const expect = [ d["b"] ];
            const got = helpers.flat_list(d, key);
            assert.deepEqual(expect, got);
        });
        it("array", function() {
            const key = "e";
            const expect = d["e"];
            const got = helpers.flat_list(d, key);
            assert.deepEqual(expect, got);
        });
        it("array (empty)", function() {
            const key = "f";
            const expect = [];
            const got = helpers.flat_list(d, key, "otherwise");
            assert.deepEqual(expect, got);
        });
        it("null", function() {
            const key = "g";
            const expect = [ d["g"] ];
            const got = helpers.flat_list(d, key);
            assert.deepEqual(expect, got);
        });
        it("non-existent", function() {
            const key = "h";
            const expect = undefined;
            const got = helpers.flat_list(d, key);
            assert.deepEqual(expect, got);
        });
        it("non-existent (otherwise)", function() {
            const key = "h";
            const expect = "otherwise";
            const got = helpers.flat_list(d, key, "otherwise");
            assert.deepEqual(expect, got);
        });
        it("non-existent (deep)", function() {
            const key = "b/c";
            const expect = undefined;
            const got = helpers.flat_list(d, key);
            assert.deepEqual(expect, got);
        });
    })
    describe("flat_put", function() {
    })
});
