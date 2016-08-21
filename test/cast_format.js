/*
 *  cast_format.js
 *
 *  David Janes
 *  IOTDB
 *  2016-08-21
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

"use struct";

const _ = require("iotdb-helpers");
const cast = require("../cast")

const assert = require("assert");


describe("cast_format", function() {
    describe("color", function() {
        const attributed = {
            "@id": "#temperature",
            "iot:purpose": "iot-purpose:color",
            "iot:type": "iot:type.string",
            "iot:format": "iot:format.color",
        };
        describe("bad", function() {
            it("undefined", function() {
                const value = undefined;
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("not a color", function() {
                const value = "not a color";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("rgb no hash", function() {
                const value = "A0B1C3";
                const expect = undefined
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("rgb 3 chars", function() {
                const value = "#A0B";
                const expect = undefined
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("rgb 7 chars", function() {
                const value = "#A0B000A";
                const expect = undefined
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("good", function() {
            it("rgb #lowercase", function() {
                const value = "#ffffff";
                const expect = "#FFFFFF";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("rgb #uppercase", function() {
                const value = "#A0B1C3";
                const expect = "#A0B1C3";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("rgb word", function() {
                const value = "pink";
                const expect = "#FFC0CB";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("rgb WORD", function() {
                const value = "RED";
                const expect = "#FF0000";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
    });
});
