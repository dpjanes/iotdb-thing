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

// const InputBand = require("./istate").Band;
// const OutputBand = require("./ostate").Band;
// const ModelBand = require("./model").Band;
const meta = require("./meta");
// const ConnectionBand = require("./connection").Band;

const make_thing = (initd) => {
    const self = Object.assign({}, events.EventEmitter.prototype);

    const _initd = _.d.compose.shallow(initd, {
        model: {},
        istate: {},
        ostate: {},
        meta: {},
        connection: {},
    });

    const _bandd = {};
    // _bandd.model = new ModelBand(self, _initd.model);
    _bandd.meta = meta.make(self, _initd.meta);
    // _bandd.connection = new ConnectionBand(self, _initd.connection);
    // _bandd.istate = new InputBand(self, _initd.istate);
    // _bandd.ostate = new OutputBand(self, _initd.ostate);
    
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
exports.make_thing = make_thing;


const thing_1 = make_thing()
thing_1.on("meta", (thing, changed) => {
    console.log("+", "thing/meta changed", changed);
});
const meta_1 = thing_1.band("meta"); 
meta_1.set("schema:name", "David");
meta_1.set("schema:age", "51");

console.log(meta_1.state());
