# iotdb-thing
IOTDB Module for Managing Things

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# Introduction 

This is a total / radical rewriting of our Thing manipulation library.
It has no knowledge of Things, per se - it's meant to plug into our
other modules such [iotdb](https://github.com/dpjanes/node-iotdb) and [iotql](https://github.com/dpjanes/iotdb-iotql).

The goals are:

* write around "band" concept
* use ES6 javascript
* use composition rather than classes
* promises where appropriate
* maximal orthogonality in code and interfaces
* test driven development
* 100% code coverage in tests

# Examples

For the most part, Thing objects will be created for you and you just
manipulate them as per below.

## General Use

There are much deeper ways of using these objects, but 
these are the most common you'll want to use

### Creation

    const thing = require("iotdb-thing").thing;
    const thing_1 = thing.make()
    const thing_2 = thing.make({
        "model": …,
        "meta": …,
        "istate": …,
        "ostate": …,
        "connection": …,
    });

### Getting Values

    thing_1.get(":temperature");
    thing_1.get(":temperature", thing.as.fahrenheit());

### Setting Values

    thing_1.set(":on", true);
    thing_1.set(":temperature", 20, thing.as.fahrenheit());

## Bands

### ostate

The **ostate** is used to manipulate a thing - it's the **output state**.

get the ostate

    const ostate_1 = thing_1.band("ostate");

see the current values 

    const d = ostate_1.state();

set a value semantically

    const promise = ostate_1.set(":on", true);

set a value non-semantically

    const promise = ostate_1.set("power", true);

change a whole bunch of values (non-semantic). Note that
`update` is always non-semantic, it's dealing the raw underlying data.

    const promise = ostate_1.update({
        "power": true,
        "level": 50,
    })

### istate

The **istate** is used to current the current readings from a thing - it's the **input state**.

Get the istate object

    const istate_1 = thing_1.band("istate");

See the current values 

    const d = istate_1.state();

Get a particular value semantically. `first` and `list`
guarentee a non-array or an array respectively, `get`
just returns what is there

    const is_on_get = istate_1.get(":on")
    const is_on_first = istate_1.first(":on")
    const is_on_list = istate_1.list(":on")

Get a particular value non-semantically

    const is_on_get = istate_1.get("powered")
    const is_on_first = istate_1.first("powered")
    const is_on_list = istate_1.list("powered")

Listen for a change semantically

    istate_1.on(":on", function(_thing, _band, _new_value) {
    });

Listen for a change non-semantically

    istate_1.on("powered", function(_thing, _band, _new_value) {
    });

## Paramaterized Data

Because we have a strong idea of data types, you can parameterize
values being passed into things; and you can coerce output values.

### Helper functions parametization

    ostate_1.set("level", 50, thing.as.percent());
    ostate_1.set("level", .5, thing.as.unit());
    ostate_1.set("temperature", 22, thing.as.celsius());

### Coercing output value

    istate_1.get("temperature", thing.as.celsius());

### Getting type definitions

This will return a semantic description describing this 
particular **attribute** of the Thing.

    thing_1.attribute("temperature")

or with a coercion

    thing_1.attribute("temperature", thing.as.celsius());

