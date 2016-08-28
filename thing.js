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

const _ = require("iotdb-helpers");

const helpers = require("./helpers");
const as = require("./as");
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
        transient: {},
    });

    const _bandd = {};

    // make a band object for every band in initd
    _.mapObject(_initd, (bvalue, bkey) => {
        if (!_.is.Object(bvalue)) {
            return;
        }

        let band_make = band.make;

        switch (bkey) {
        case "meta":
            band_make = band_meta.make;
            break;
        case "model":
            band_make = band_model.make;
            break;
        case "istate":
            band_make = band_state.make;
            break;
        case "ostate":
            band_make = band_state.make;
            break;
        case "connection":
            band_make = band_connection.make;
            break;
        case "transient":
            band_make = band.make;
            break;
        }

        _bandd[bkey] = band_make(self, bvalue, bkey);

    });

    const _set_get = (band_name, key, value, how) => {
        const band = self.band(band_name);
        if (value !== undefined) {
            band.set(key, value);
        } else {
            return band[how](key);
        }
    }

    self._isThing = true;

    // interface
    self.band = band_name => _bandd[band_name] || null;
    self.bands = () => _.keys(_bandd);
    self.model_id = () => self.band("model").first("iot:model-id");
    self.thing_id = () => self.band("meta").first("iot:thing-id");
    self.reachable = () => _.coerce.value(self.band("connection").first("iot:reachable", as.boolean()), false);
    self.set = (key, value, as_type) => self.band("ostate").set(key, value, as_type);
    self.get = (key, as_type) => self.band("istate").get(key, as_type);
    self.update = (band, d, paramd) => self.band(band).update(d, paramd);
    self.state = band => self.band(band).state();

    self.name = value => _set_get("meta", "schema:name", value, "first");
    self.zones = value => _set_get("meta", "iot:zone", value, "list");
    self.facets = value => _set_get("meta", "iot:facet", value, "list");
    self.tag = value => _set_get("transient", "tag", value, "list");

    self.disconnect = () => self.emit("disconnect");

    self.attributes = () => self.band("model").list("iot:attribute");
    self.attribute = (key, as_type) => {
        const matchd = helpers.make_match_rule(key);

        const ad = _.find(self.attributes(), ad => _.d.is.superset(ad, matchd));
        if (ad && as_type) {
            return _.d.compose.shallow(as_type, ad);
        } else {
            return ad;
        }
    }

    return self;
}

/**
 *  API
 */
exports.make = make;
exports.as = as;
