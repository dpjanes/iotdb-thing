/*
 *  thing.js
 *
 *  David Janes
 *  IOTDB
 *  2016-02-13
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
const util = require('util');

const iotdb = require("iotdb");
const _ = iotdb._;

const band = require("./band");
const band_meta = require("./band_meta");
const band_model = require("./band_model");
const band_istate = require("./band_istate");
const band_ostate = require("./band_ostate");
const band_connection = require("./band_connection");

const make = (initd) => {
    const self = Object.assign({}, events.EventEmitter.prototype);

    // variables
    const _initd = _.d.compose.shallow(initd, {
        model: {},
        istate: {},
        ostate: {},
        meta: {},
        connection: {},
    });

    const _bandd = {};

    // make a band object for every band in initd
    _.mapObject(_initd, ( bvalue, bkey ) => {
        if (!_.is.Object(bvalue)) {
            return;
        }

        let band_make = band.make;

        switch (bkey) {
        case "meta": band_make = band_meta.make; break;
        case "model": band_make = band_model.make; break;
        case "istate": band_make = band_istate.make; break;
        case "ostate": band_make = band_ostate.make; break;
        case "connection": band_make = band_connection.make; break;
        }

        _bandd[bkey] = band_make(self, bvalue, bkey);

    });
    
    // interface
    self.band = (band_name) => {
        return _bandd[band_name] || null;
    };

    self.model_id = () => {
        return self.band("meta").get("iot:model-id");
    };

    self.thing_id = () => {
        return self.band("meta").get("iot:thing-id");
    };

    self.set = (key, value) => {
        return self.band("ostate").set(key, value);
    };

    return self;
}

/**
 *  API
 */
exports.make = make;

/*

const thing_1 = make()
thing_1.on("meta", (thing, changed) => {
    console.log("+", "thing/meta changed", changed);
});
const meta_1 = thing_1.band("meta"); 
meta_1.set("schema:name", "David");
meta_1.set("schema:age", "51");

console.log(meta_1.state());
*/
