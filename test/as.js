/*
 *  as.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-09
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

const assert = require("assert")

const _ = require("iotdb-helpers");
const as = require("../as")

describe("as", function() {
    describe("creation", function() {
        describe("fraction", function() {
            it("percent", function() {
                const got = as.percent();
                const expect = {
                    "iot:type": "iot:type.integer",
                    "iot:unit": "iot-unit:math.fraction.percent",
                }

                assert.deepEqual(got, expect);
            });
            it("unit", function() {
                const got = as.unit();
                const expect = {
                    "iot:type": "iot:type.number",
                    "iot:unit": "iot-unit:math.fraction.unit",
                }

                assert.deepEqual(got, expect);
            });
        });
        describe("temperature", function() {
            it("celsius", function() {
                const got = as.celsius();
                const expect = {
                    "iot:type": "iot:type.number",
                    "iot:unit": "iot-unit:temperature.si.celsius",
                }

                assert.deepEqual(got, expect);
            });
            it("fahrenheit", function() {
                const got = as.fahrenheit();
                const expect = {
                    "iot:type": "iot:type.number",
                    "iot:unit": "iot-unit:temperature.imperial.fahrenheit",
                }

                assert.deepEqual(got, expect);
            });
            it("kelvin", function() {
                const got = as.kelvin();
                const expect = {
                    "iot:type": "iot:type.number",
                    "iot:unit": "iot-unit:temperature.si.kelvin",
                }

                assert.deepEqual(got, expect);
            });
        });
        describe("types", function() {
            it("null", function() {
                const got = as.null();
                const expect = { "iot:type": "iot:type.null", };

                assert.deepEqual(got, expect);
            });
            it("boolean", function() {
                const got = as.boolean();
                const expect = { "iot:type": "iot:type.boolean", };

                assert.deepEqual(got, expect);
            });
            it("integer", function() {
                const got = as.integer();
                const expect = { "iot:type": "iot:type.integer", };

                assert.deepEqual(got, expect);
            });
            it("number", function() {
                const got = as.number();
                const expect = { "iot:type": "iot:type.number", };

                assert.deepEqual(got, expect);
            });
            it("string", function() {
                const got = as.string();
                const expect = { "iot:type": "iot:type.string", };

                assert.deepEqual(got, expect);
            });
        });
    });
});
