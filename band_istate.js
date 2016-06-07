/*
 *  istate.js
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

const iotdb = require("iotdb");
const _ = iotdb._;

const band = require("./band");

const make = (_thing, _d, _band) => {
    const self = band.make(_thing, _d, _band);

    self._get = helpers.state_get;
    self._first = helpers.state_first;
    self._list = helpers.state_list;
    self._transform_key = (key) => helpers.state_lookup_key(key, self.thing());

    self._prepare_update = (ud) => {
        const rds = [];
        const thing = self.thing();

        console.log(ud);

        _.mapObject(ud, ( uvalue, ukey ) => {
            const attribute = thing.attribute(ukey);
            console.log("AT", attribute);
            const key = helpers.state_lookup_key(ukey, thing);
            console.log("KEY", attribute);
            if (!attribute || !key) {
                rds.push({
                    key: ukey,
                    value: uvalue,
                    is_validated: false,
                });
                return;
            }

            const rd = _.d.compose.shallow({
                key: key,
                value: uvalue,
            }, attribute);

            rds.push(rd);
        });

        return rds;
    };
    self._prepare_set = self._prepare_update;

    return self;
};

/**
 *  API
 */
exports.make = make;
