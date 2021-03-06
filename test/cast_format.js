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
    describe("datetime", function() {
        const attributed = {
            "@id": "#when",
            "iot:purpose": "iot-purpose:when",
            "iot:type": "iot:type.string",
            "iot:format": "iot:format.datetime",
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
            it("not a datetime", function() {
                const value = "not a datetime";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad month (low)", function() {
                const value = "2016-00";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad month (high)", function() {
                const value = "2016-13";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad day (low)", function() {
                const value = "2016-01-00";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad day (high)", function() {
                const value = "2016-01-32";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("good", function() {
            it("just YYYY", function() {
                const value = "2016"
                const expect = "2016-01-01T00:00:00.000Z"; 
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("just YYYY-MM", function() {
                const value = "2016-02";
                const expect = "2016-02-01T00:00:00.000Z"; 
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("just YYYY-MM-DD", function() {
                const value = "1983-12-25";
                const expect = "1983-12-25T00:00:00.000Z"; 
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
    });
    describe("date", function() {
        const attributed = {
            "@id": "#when",
            "iot:purpose": "iot-purpose:when",
            "iot:type": "iot:type.string",
            "iot:format": "iot:format.date",
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
            it("not a date", function() {
                const value = "not a date";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad month (low)", function() {
                const value = "2016-00";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad month (high)", function() {
                const value = "2016-13";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad day (low)", function() {
                const value = "2016-01-00";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("bad day (high)", function() {
                const value = "2016-01-32";
                const expect = undefined;
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("good", function() {
            it("just YYYY", function() {
                const value = "2016"
                const expect = "2016-01-01";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("just YYYY-MM", function() {
                const value = "2016-02";
                const expect = "2016-02-01";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("just YYYY-MM-DD", function() {
                const value = "1983-12-25";
                const expect = "1983-12-25";
                const to = attributed;
                const from = {};
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
    });
});
