/*
 *  thing_set_get.js
 *
 *  David Janes
 *  IOTDB
 *  2016-07-20
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

const band_meta = {
    "schema:name": "David",
    "iot:zone": "Bedroom",
    "iot:facet": [ "iot-facet:switch", "iot-facet:socket", ],
}

describe("thing", function() {
    describe("name", function() {
        it("set", function() {
            const thing_1 = thing.make({});
            thing_1.name("Hello");

            const meta = thing_1.state("meta");
            assert.deepEqual({ 'schema:name': 'Hello' }, meta);
        });
        it("get", function() {
            const thing_1 = thing.make({ meta: band_meta });
            const name = thing_1.name();
            assert.deepEqual(name, band_meta["schema:name"]);

            const meta = thing_1.state("meta");
            assert.deepEqual(meta, band_meta);
        });
    });
    describe("zones", function() {
        it("set", function() {
            const thing_1 = thing.make({});
            thing_1.zones("Living Room");

            const meta = thing_1.state("meta");
            assert.deepEqual({ 'iot:zone': 'Living Room' }, meta);
        });
        it("get", function() {
            const thing_1 = thing.make({ meta: band_meta });
            const zones = thing_1.zones();
            assert.deepEqual(zones, [ "Bedroom" ]);
        });
    });
    describe("facets", function() {
        it("set (single)", function() {
            const thing_1 = thing.make({});
            thing_1.facets("iot-facet:xxx");

            const meta = thing_1.state("meta");
            assert.deepEqual({ "iot:facet": "iot-facet:xxx", }, meta);

        });
        it("set (list)", function() {
            const thing_1 = thing.make({});
            thing_1.facets([ "iot-facet:xxx", "iot-facet:yyy" ]);

            const meta = thing_1.state("meta");
            assert.deepEqual({ "iot:facet": [ "iot-facet:xxx", "iot-facet:yyy" ], }, meta);

        });
        it("get", function() {
            const thing_1 = thing.make({ meta: band_meta });
            const facets = thing_1.facets();
            assert.deepEqual(facets, [ "iot-facet:switch", "iot-facet:socket", ]);
        });
    });
    describe("tags", function() {
        it("set (single)", function() {
            const thing_1 = thing.make({});
            thing_1.tag("xxx");

            const transient = thing_1.state("transient");
            assert.deepEqual({ "tag": "xxx", }, transient);

        });
        it("set (list)", function() {
            const thing_1 = thing.make({});
            thing_1.tag([ "xxx", "yyy" ]);

            const transient = thing_1.state("transient");
            assert.deepEqual({ "tag": [ "xxx", "yyy" ], }, transient);

        });
        it("get", function() {
            const thing_1 = thing.make({ transient: { "tag": [ "switch", "socket", ] }});
            const tags = thing_1.tag();
            assert.deepEqual(tags, [ "switch", "socket", ]);
        });
    });
});
