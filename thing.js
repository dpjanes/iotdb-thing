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

const _ = require("iotdb-helpers");

const helpers = require("./helpers");
const band = require("./band");
const band_meta = require("./band_meta");
const band_model = require("./band_model");
const band_state = require("./band_state");
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
        case "istate": band_make = band_state.make; break;
        case "ostate": band_make = band_state.make; break;
        case "connection": band_make = band_connection.make; break;
        }

        _bandd[bkey] = band_make(self, bvalue, bkey);

    });
    
    // interface
    self.band = (band_name) => _bandd[band_name] || null;
    self.model_id = () => self.band("meta").get("iot:model-id", null);
    self.thing_id = () => self.band("meta").get("iot:thing-id", null);
    self.set = (key, value) => self.band("ostate").set(key, value);

    self.attribute = (o) => {
        const matchd = helpers.make_match_rule(o);
        const ads = self.band("model").list("iot:attribute", []);

        return _.find(ads, (ad) => _.d.is.superset(ad, matchd));
    }

    return self;
}

/**
 *  API
 */
exports.make = make;
