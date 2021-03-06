/*
 *  band_create.js
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

const events = require('events');

const iotdb = require("iotdb");
const _ = iotdb._;

const assert = require("assert");
const thing = require("../thing");

describe("band", function() {
    describe("create", function() {
        it("scratch band", function() {
            const thing_1 = thing.make({ scratch: {} })

            assert.ok(thing_1.band("scratch"));
            assert.strictEqual(thing_1.band("scratch").band_name(), "scratch");
            assert.strictEqual(thing_1.band("scratch").thing(), thing_1);
        });
        it("emitter", function() {
            const thing_1 = thing.make();

            assert.ok(thing_1.band("istate").emitter() instanceof events.EventEmitter);
        });
    });
});
