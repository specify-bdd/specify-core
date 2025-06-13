import { log } from "node:console";

const foobar: number         = 123;
const barfooasdfasdf: number = 456;
const foobarbar              = 789;

if (foobar === 123) {
    const foobar: number         = 123;
    const barfooasdfasdf: number = 456;
    const foobarbar              = 789;

    log(foobar, barfooasdfasdf, foobarbar);
}

let blablah   = [123];
let blablah22 = [321];
let foo       = {
    "bar": 123,
    "barfooasdfasdf": 456,
    "foobarbar": 789,
};

blablah22 = [1234];
blablah = [3214];
foo = {
    "bar": 123,
    "barfooasdfasdf": 456,
    "foobarbar": 789,
};

const bar = {
    "bar": 123,
    "barfooasdfasdf": 456,
    "foobarbar": 789,
};
const barfoo = 321;

log(foobar, barfooasdfasdf, foobarbar);
log(blablah, foo, bar, barfoo);
log(blablah22);
