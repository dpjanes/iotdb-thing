/*
 *  coerce.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-08
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
const coerce = require("../coerce")

const assert = require("assert");

const attribute_temperature = {
    "@id": "#temperature",
    "iot:purpose": "iot-purpose:temperature",
    "iot:type": "iot:type.integer",
    "iot:unit": "iot-unit:temperature.si.celsius",
    "iot:minimum": 0,
    "iot:maximum": 50,
};

const gotd = {
    "@value": "168",
    "iot:unit": "iot-unit:temperature.imperial.fahrenheit"
}

describe("coerce", function() {
    describe("simple basics", function() {
        it("undefined value", function() {
            const value = undefined;
            const expect = value;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("undefined attribute", function() {
            const value = 10;
            const expect = value;
            const attribute = undefined;
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("dictionary value", function() {
            const value = { "@value": 50 };
            const expect = 50;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
    });
    describe("empty attribute", function() {
        it("null", function() {
            const value = null;
            const expect = value;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("boolean", function() {
            const value = false;
            const expect = value;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("integer", function() {
            const value = 10;
            const expect = value;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("number", function() {
            const value = 100.1;
            const expect = value;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("string", function() {
            const value = "hello world";
            const expect = value;
            const attribute = {};
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
    });
    describe("type conversion", function() {
        describe("to null", function() {
            const attribute = {
                "iot:type": "iot:type.null",
            };

            it("null", function() {
                const value = null;
                const expect = null;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = null;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = null;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = null;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = null;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
        describe("to boolean", function() {
            const attribute = {
                "iot:type": "iot:type.boolean",
            };

            it("null", function() {
                const value = null;
                const expect = false;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = false;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = true;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = true;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = true;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("falsey string", function() {
                const value = "false";
                const expect = false;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
        describe("to integer", function() {
            const attribute = {
                "iot:type": "iot:type.integer",
            };

            it("null", function() {
                const value = null;
                const expect = 0;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = 0;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = 10;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = 100;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = undefined;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number string", function() {
                const value = "123.3";
                const expect = 123;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
        describe("to number", function() {
            const attribute = {
                "iot:type": "iot:type.number",
            };

            it("null", function() {
                const value = null;
                const expect = 0;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = 0;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = 10;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = 100.1;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = undefined;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number string", function() {
                const value = "123.3";
                const expect = 123.3;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
        describe("to string", function() {
            const attribute = {
                "iot:type": "iot:type.string",
            };

            it("null", function() {
                const value = null;
                const expect = "";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = "0";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = "10";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = "100.1";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = "hello world";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("number string", function() {
                const value = "123.3";
                const expect = "123.3";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
    });
    describe("unit conversion", function() {
        it("no input unit", function() {
            const value = {
                "@value": 50,
            }
            const attribute = {
                "iot:unit": "iot-unit:temperature.si.celsius",
            };
            const expect = 50;
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("no output unit", function() {
            const value = {
                "@value": 40,
                "iot:unit": "iot-unit:temperature.si.celsius",
            }
            const attribute = {
            };
            const expect = 40;
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
        it("input and output unit", function() {
            const value = {
                "@value": 212,
                "iot:unit": "iot-unit:temperature.imperial.fahrenheit",
            }
            const attribute = {
                "iot:unit": "iot-unit:temperature.si.celsius",
            };
            const expect = 100;
            const got = coerce.cast(value, attribute);

            assert.strictEqual(got, expect);
        });
    });
    describe("minumum", function() {
        describe("integer", function() {
            it("above minimum", function() {
                const value = {
                    "@value": 50,
                }
                const attribute = {
                    "iot:minimum": 10,
                };
                const expect = 50;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("at minimum", function() {
                const value = {
                    "@value": 10,
                }
                const attribute = {
                    "iot:minimum": 10,
                };
                const expect = 10;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("below minimum", function() {
                const value = {
                    "@value": -50,
                }
                const attribute = {
                    "iot:minimum": 10,
                };
                const expect = 10;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
        describe("string", function() {
            it("above minimum", function() {
                const value = {
                    "@value": "t",
                }
                const attribute = {
                    "iot:minimum": "h",
                };
                const expect = "t";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("at minimum", function() {
                const value = {
                    "@value": "h",
                }
                const attribute = {
                    "iot:minimum": "h",
                };
                const expect = "h";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("below minimum", function() {
                const value = {
                    "@value": "a",
                }
                const attribute = {
                    "iot:minimum": "h",
                };
                const expect = "h";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
    });
    describe("minumum", function() {
        describe("integer", function() {
            it("above maximum", function() {
                const value = {
                    "@value": 50,
                }
                const attribute = {
                    "iot:maximum": 10,
                };
                const expect = 10;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("at maximum", function() {
                const value = {
                    "@value": 10,
                }
                const attribute = {
                    "iot:maximum": 10,
                };
                const expect = 10;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("below maximum", function() {
                const value = {
                    "@value": -50,
                }
                const attribute = {
                    "iot:maximum": 10,
                };
                const expect = -50;
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
        describe("string", function() {
            it("above maximum", function() {
                const value = {
                    "@value": "t",
                }
                const attribute = {
                    "iot:maximum": "h",
                };
                const expect = "h";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("at maximum", function() {
                const value = {
                    "@value": "h",
                }
                const attribute = {
                    "iot:maximum": "h",
                };
                const expect = "h";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
            it("below maximum", function() {
                const value = {
                    "@value": "a",
                }
                const attribute = {
                    "iot:maximum": "h",
                };
                const expect = "a";
                const got = coerce.cast(value, attribute);

                assert.strictEqual(got, expect);
            });
        });
    });
});
