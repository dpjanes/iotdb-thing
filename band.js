/*
 *  band.js
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

const errors = require("iotdb-errors");
const helpers = require("./helpers");

const make = (_thing, d, _band_name) => {
    const self = Object.assign({});

    let _d = _.d.clone.deep(d);
    let _timestamp = _.timestamp.epoch();
    let _pending = {};
    let _emitter = new events.EventEmitter();

    const _update = (uds, paramd) => {
        return new Promise(( resolve, reject ) => {
            paramd = _.d.compose.shallow(paramd, {
                add_timestamp: true,
                check_timestamp: true,
                notify: true,
                validate: true,
            });

            var utimestamp = paramd.timestamp || _.timestamp.make();

            if (paramd.check_timestamp && !_.timestamp.check.values(_timestamp, utimestamp)) {
                return reject(new errors.Timestamp());
            }

            if (paramd.validate) {
                const invalids = _.map(_.filter(uds, (ud) => ud.is_validated === false), (ud) => ud.key);
                if (invalids.length) {
                    return reject(new errors.Invalid("invalid updates"));
                }
            }

            const changed = {};

            uds.map(function(ud) {
                if (ud.key.match(/^@/)) {
                    return;
                }

                var ovalue = _d[ud.key];

                if (_.is.Equal(ud.value, ovalue)) {
                    return;
                }

                self._put(_d, ud.key, ud.value);
                self._put(changed, ud.key, ud.value);

                if (paramd.notify) {
                    process.nextTick(function() {
                        _emitter.emit(ud.key, _thing, self, ud.value);
                    });
                }
            });

            if (_.is.Empty(changed)) {
                return resolve(changed);
            }
            
            if (paramd.notify) {
                // thing-level notifications are batched on ticks
                _pending = _.d.compose.shallow(_pending, changed);

                process.nextTick(function() {
                    const updated_keys = _.keys(_pending);
                    _pending = {};

                    _thing.emit(_band_name, _thing, self, updated_keys);
                });
            }

            if (paramd.add_timestamp) {
                _timestamp = utimestamp;
            }

            return resolve(changed);
        });
    };

    self.thing = () => _thing;
    self.band_name = () => _band_name;
    self.timestamp = () => _timestamp;

    self.set = (key, value) => _update(self._prepare_set(key, value));
    self.update = (updated, paramd) => _update(
        self._prepare_update(updated), 
        _.d.compose.shallow({ timestamp: updated["@timestamp"] }, paramd)
    );

    self.state = () => _.d.clone.deep(_d);
    self.get = (key, parameter, otherwise) => self._cast(key, parameter, self._get(_d, self._transform_key(key), otherwise));
    self.list = (key, parameter, otherwise) => self._cast(key, parameter, self._list(_d, self._transform_key(key), otherwise));
    self.first = (key, parameter, otherwise) => self._cast(key, parameter, self._first(_d, self._transform_key(key), otherwise));

    // emitter section
    self.emitter = () => _emitter;
    self.on = (key, listener) => _emitter.on(self._transform_key(key), listener);

    // dictionary manipulation - only for internal and descendents
    self._cast = (key, parameter, value) => value;
    self._get = (d, key, otherwise) => _.d.get(d, key, otherwise);
    self._first = (d, key, otherwise) => _.d.first(d, key, otherwise);
    self._list = (d, key, otherwise) => _.d.list(d, key, otherwise);
    self._put = (d, key, value) => _.d.set(d, key, value);
    self._transform_key = (key) => key;
    self._prepare_update = helpers.unroll_deep;
    self._prepare_set = (key, value) => {
        const updated = {};
        updated[key] = value;

        return helpers.unroll_deep(updated);
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
