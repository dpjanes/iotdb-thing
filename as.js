/*
 *  paramater.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-08
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

const _make_number = (skey, svalue) => {
    const rd = {
        "iot:type": "iot:type.number",
    }

    rd[skey] = svalue;

    return rd;
};

const _make_integer = (skey, svalue) => {
    const rd = {
        "iot:type": "iot:type.integer",
    }

    rd[skey] = svalue;

    return rd;
};

exports.percent = () => _make_integer("iot:unit", "iot-unit:math.fraction.percent");
exports.unit = () => _make_number("iot:unit", "iot-unit:math.fraction.unit");

exports.celsius = () => _make_number("iot:unit", "iot-unit:temperature.si.celsius");
exports.kelvin = () => _make_number("iot:unit", "iot-unit:temperature.si.kelvin");
exports.fahrenheit = () => _make_number("iot:unit", "iot-unit:temperature.imperial.fahrenheit");

exports.null = () => ({
    "iot:type": "iot:type.null"
});
exports.boolean = () => ({
    "iot:type": "iot:type.boolean"
});
exports.integer = () => ({
    "iot:type": "iot:type.integer"
});
exports.number = () => ({
    "iot:type": "iot:type.number"
});
exports.string = () => ({
    "iot:type": "iot:type.string"
});
