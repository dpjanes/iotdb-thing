/*
 *  cast.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-07
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

"use struct";

const _ = require("iotdb-helpers");

const _prepare_value = (self, value) => {
    if (_.is.Dictionary(value)) {
        self.value = value["@value"];
        self.valued = value;
    } else {
        self.value = value;
        self.valued = {};
    }
};

const _prepare_attribute = (self, attribute) => {
    self.attribute = attribute || {};
};

const _coerce_value = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    self.value = _.coerce.coerce(self.value, _.coerce.list(self.attribute["iot:type"]))
};

const _convert_unit = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const unit_of_value = _.d.first(self.valued, "iot:unit");
    if (!unit_of_value) {
        return;
    }

    const unit_of_attribute = _.d.first(self.attribute, "iot:unit");
    if (!unit_of_attribute) {
        return;
    }

    self.value = _.convert.convert({
        from: unit_of_value,
        to: unit_of_attribute,
        value: self.value,
    });
};

const _bound_minumum = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const bound = _.coerce.coerce(self.attribute["iot:minimum"], _.coerce.classify(self.value));
    if (_.is.Undefined(bound)) {
        return;
    }

    if (self.value < bound) {
        self.value = bound;
    }
};

const _bound_maximum = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const bound = _.coerce.coerce(self.attribute["iot:maximum"], _.coerce.classify(self.value));
    if (_.is.Undefined(bound)) {
        return;
    }

    if (self.value > bound) {
        self.value = bound;
    }
};

const _format_value = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

};

const _enumerate_value = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

};

const cast = ( value, attribute ) => {
    const self = {};

    _prepare_value(self, value);
    _prepare_attribute(self, attribute);
    _coerce_value(self);
    _convert_unit(self);
    _bound_minumum(self);
    _bound_maximum(self);
    _format_value(self);
    _enumerate_value(self);

    return self.value;
};

/**
 *  API
 */
exports.cast = cast;
