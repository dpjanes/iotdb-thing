/*
 *  band_getters.js
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

const scratchd = {
    "name": "David",
    "position": {
        "latitude": 43.6532,
        "longitude": -79.3832,
    },
    "roles": [ "Boss", "CEO", "Dad" ],
};

describe("band", function() {
    describe("get", function() {
        it("initialize", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.state(), scratchd);
        });
        it("get name", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("name"), "David");
        });
        it("get /name", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("/name"), "David");
        });
        it("get /position", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("/position"), scratchd.position);
        });
        it("get /position/latitude", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("/position/latitude"), scratchd.position.latitude);
        });
        it("get /roles", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("/roles"), scratchd.roles);
        });
        it("get /xxx - no otherwise", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("/xxx"), undefined);
        });
        it("get /xxx - otherwise", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.get("/xxx", null, "expected"), "expected");
        });
    });
    describe("first", function() {
        it("first name", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("name"), "David");
        });
        it("first /name", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("/name"), "David");
        });
        it("first /position", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("/position"), scratchd.position);
        });
        it("first /position/latitude", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("/position/latitude"), scratchd.position.latitude);
        });
        it("first /roles", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("/roles"), scratchd.roles[0]);
        });
        it("first /xxx - no otherwise", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("/xxx"), undefined);
        });
        it("first /xxx - otherwise", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.first("/xxx", null, "expected"), "expected");
        });
    });
    describe("list", function() {
        it("list name", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("name"), [ "David" ]);
        });
        it("list /name", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("/name"), [ "David" ]);
        });
        it("list /position", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("/position"), [ scratchd.position ]);
        });
        it("list /position/latitude", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("/position/latitude"), [ scratchd.position.latitude ]);
        });
        it("list /roles", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("/roles"), scratchd.roles);
        });
        it("list /xxx - no otherwise", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("/xxx"), undefined);
        });
        it("list /xxx - otherwise", function() {
            const thing_1 = thing.make({ scratch: scratchd })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.list("/xxx", null, "expected"), "expected");
        });
    });
});
