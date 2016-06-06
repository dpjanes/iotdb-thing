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

describe("helpers", function() {
    describe("unroll_deep", function() {
        it("empty", function() {
            const ind = {};
            const expectds = [];

            const gotd = helpers.unroll_deep(ind);
            assert.deepEqual(expectds, gotd);
        });
        it("one level", function() {
            const ind = {
                "a": 1,
                "b": "2", 
                "c": "hello", 
            };
            const expectds = [
                { key: "a", value: 1, },
                { key: "b", value: "2", },
                { key: "c", value: "hello", },
            ];

            const gotd = helpers.unroll_deep(ind);
            assert.deepEqual(expectds, gotd);
        });
        it("multi level", function() {
            const ind = {
                "a": "hello", 
                "b": {
                    "x": "world",
                    "y": "!",
                },
            };
            const expectds = [
                { key: "a", value: "hello", },
                { key: "b/x", value: "world", },
                { key: "b/y", value: "!", },
            ];

            const gotd = helpers.unroll_deep(ind);
            assert.deepEqual(expectds, gotd);
        });
        it("array", function() {
            const ind = {
                a: [ 1, {}, 3],
            };
            const expectds = [
                { key: "a", value: [ 1, {}, 3], },
            ];

            const gotd = helpers.unroll_deep(ind);
            assert.deepEqual(expectds, gotd);
        });
    })
});
