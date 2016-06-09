/*
 *  band_state.js
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

const helpers = require("./helpers");

const _ = require("iotdb-helpers");

const band = require("./band");
const cast = require("./cast");

const make = (_thing, _d, _band) => {
    const self = band.make(_thing, _d, _band);

    self._get = helpers.state_get;
    self._first = helpers.state_first;
    self._list = helpers.state_list;
    self._transform_key = (key) => helpers.state_lookup_key(key, self.thing());
    self._cast = (key, as_type, value) => cast.cast(value, self.thing().attribute(key), as_type);

    self._prepare_update = (ud) => {
        const rds = [];
        const thing = self.thing();

        _.mapObject(ud, ( uvalue, ukey ) => {
            const key = helpers.state_lookup_key(ukey, thing);
            if (!key) {
                rds.push({
                    key: ukey,
                    value: uvalue,
                    is_validated: false,
                });
            } else {
                rds.push({
                    key: key,
                    value: uvalue,
                });
            }
        });

        return rds;
    };

    self._prepare_set = ( ukey, uvalue, as_type ) => {
        const rds = [];
        const thing = self.thing();

        const key = helpers.state_lookup_key(ukey, thing);
        if (!key) {
            rds.push({
                key: ukey,
                value: uvalue,
                is_validated: false,
            });
        } else if (as_type) {
            const attribute = thing.attribute(ukey);
            const value = cast.cast(uvalue, as_type, attribute);
            if (_.is.Undefined(value)) {
                rds.push({
                    key: key,
                    value: uvalue,
                    is_validated: false,
                });
            } else {
                rds.push({
                    key: key,
                    value: value,
                });
            }
        } else {
            rds.push({
                key: key,
                value: uvalue,
            });
        }

        return rds;
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
