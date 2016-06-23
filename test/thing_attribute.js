/*
 *  thing_attribute.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-06
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

const fs = require("fs");
const path = require("path");

const iotdb = require("iotdb");
const _ = iotdb._;

const assert = require("assert");
const thing = require("../thing");
const as = require("../as");

const model_file = path.join(__dirname, './things/thing-basement-heater/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

const a_sensor = {
    "@id": "#temperature",
    "iot:purpose": "iot-purpose:temperature",
    "iot:read": true,
    "iot:sensor": true,
    "iot:actuator": false,
    "iot:type": "iot:type.number",
    "iot:unit": "iot-unit:temperature.si.celsius"
};
const a_actuator = {
    "@id": "#set-point",
    "iot:purpose": "iot-purpose:temperature",
    "iot:read": true,
    "iot:write": true,
    "iot:sensor": false,
    "iot:actuator": true,
    "iot:type": "iot:type.number",
    "iot:unit": "iot-unit:temperature.si.celsius"
};

describe("thing", function() {
    describe("attribute", function() {
        it("bad", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute(null);
            const expect = null;

            assert.deepEqual(got, expect);
        });
        it("temperature", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute("temperature");
            const expect = a_sensor;

            assert.deepEqual(got, expect);
        });
        it("bla", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute("bla");
            const expect = null;

            assert.deepEqual(got, expect);
        });
        it("/temperature", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute("/temperature");
            const expect = a_sensor;

            assert.deepEqual(got, expect);
        });
        it("/temperature cast to fahrenheit", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute("/temperature", as.fahrenheit());
            const expect = {
                "@id": "#temperature",
                "iot:purpose": "iot-purpose:temperature",
                "iot:read": true,
                "iot:sensor": true,
                "iot:actuator": false,
                "iot:type": "iot:type.number",
                "iot:unit": "iot-unit:temperature.imperial.fahrenheit"
            };

            assert.deepEqual(got, expect);
        });
        it("/bla", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute("/bla");
            const expect = null;

            assert.deepEqual(got, expect);
        });
        it(":temperature", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute(":temperature");
            const expect = a_sensor;
        });
        it("iot-purpose:temperature", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute("iot-purpose:temperature");
            const expect = a_sensor;

            assert.deepEqual(got, expect);
        });
        it("{temperature/actuator}", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute({
                "iot:purpose": "iot-purpose:temperature",
                "iot:actuator": true,
            });
            const expect = a_actuator;

            assert.deepEqual(got, expect);
        });
        it("{temperature/sensor}", function() {
            const thing_1 = thing.make({
                model: model_document,
            });

            const got = thing_1.attribute({
                "iot:purpose": "iot-purpose:temperature",
                "iot:sensor": true,
            });
            const expect = a_sensor;

            assert.deepEqual(got, expect);
        });
    })
});
