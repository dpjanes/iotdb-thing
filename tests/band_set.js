/*
 *  band_set.js
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

const iotdb = require("iotdb");
const _ = iotdb._;

const assert = require("assert");
const thing = require("../thing");

describe("band", function() {
    describe("set", function() {
        it("empty at creation", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.state(), {});
        });
        it("set once", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("name", "David");

            assert.deepEqual(scratch_1.state(), {
                "name": "David",
            });
        });
        it("set twice", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("name", "John");
            scratch_1.set("name", "Freddy");

            assert.deepEqual(scratch_1.state(), {
                "name": "Freddy",
            });
        });
        it("set two things", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("name", "Julie");
            scratch_1.set("age", 24);

            assert.deepEqual(scratch_1.state(), {
                "name": "Julie",
                "age": 24,
            });
        });
        it("set ignore @ values", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("@name", "David");
            scratch_1.set("name", "John");

            assert.deepEqual(scratch_1.state(), {
                "name": "John",
            });
        });
        it("set /name", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("/name", "David");

            assert.deepEqual(scratch_1.state(), {
                "name": "David",
            });
        });
        it("set /position/latitude", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("/position/latitude", 54.4);

            assert.deepEqual(scratch_1.state(), {
                "position": {
                    "latitude": 54.4,
                }
            });
        });
    });
});
