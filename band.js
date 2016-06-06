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

const iotdb = require("iotdb");
const _ = iotdb._;

const errors = require("iotdb-errors");
const helpers = require("./helpers");

const make = (_thing, _d, _band_name) => {
    const self = Object.assign({});

    let _timestamp = _.timestamp.epoch();
    let _last_now = null;
    let _pending = {};
    let _emitter = new events.EventEmitter();

    const _update = function(uds, paramd) {
        return new Promise(( resolve, reject ) => {
            paramd = _.d.compose.shallow(paramd, {
                add_timestamp: true,
                check_timestamp: true,
                notify: true,
            });

            var utimestamp = paramd.timestamp;
            if (!utimestamp) {
                // this allows multiple user actions in the same millisecond … very tricky
                utimestamp =  _.timestamp.make();
                if (_last_now === utimestamp) {
                    utimestamp = _.timestamp.advance(utimestamp);
                }

                _last_now = utimestamp;
            }

            if (paramd.check_timestamp && !_.timestamp.check.values(_timestamp, utimestamp)) {
                return reject(new errors.Timestamp());
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

    self.set = function(key, value) {
        const tkey = self._transform_key(key);
        const tvalue = self._transform_value(tkey, value);

        return _update([ { key: tkey, value: tvalue } ], {
            add_timestamp: true,
        });
    };

    self.update = (updated, paramd) => _update(
        self._unroll(updated), 
        _.d.compose.shallow({ timestamp: updated["@timestamp"] }, paramd)
    );

    self.thing = () => _thing;
    self.band_name = () => _band_name;
    self.timestamp = () => _timestamp;

    self.state = () => _.d.clone.deep(_d);
    self.get = (key, otherwise) => self._get(_d, self._transform_key(key), otherwise);
    self.list = (key, otherwise) => self._list(_d, self._transform_key(key), otherwise);
    self.first = (key, otherwise) => self._first(_d, self._transform_key(key), otherwise);

    // dictionary manipulation - only for internal and descendents
    self._get = (d, key, otherwise) => _.d.get(d, key, otherwise);
    self._first = (d, key, otherwise) => _.d.first(d, key, otherwise);
    self._list = (d, key, otherwise) => _.d.list(d, key, otherwise);
    self._put = (d, key, value) => _.d.set(d, key, value);
    self._transform_key = (key) => key;
    self._transform_value = (key, value) => value;
    self._unroll = helpers.unroll_deep;

    // emitter section
    self.emitter = () => _emitter;
    self.on = (key, listener) => _emitter.on(self._transform_key(key), listener);

    return self;
};

/**
 *  API
 */
exports.make = make;
