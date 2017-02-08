## TOC

## Variables & Assignment

### `const`
    foo := 'hello'

### Annotated `const`
    foo: string = 'hello'
LightScript uses Facebook's [Flow](flowtype.org) typechecker and type syntax.

### `let` and `var`
As in JavaScript.


## Function Definition

### Basic
    foo() -> 1
    foo(a, b) -> a + b

### Without implicit returns
    foo(): void ->
      1

To disable implicit returns for a method, give it a `void` type annotation.

LightScript does not add implicit returns to setter methods or constructor methods.

### Annotated
    foo(a: string, b: number): number ->
      a.length + b

### Anonymous
    runCallback(() -> 42)
    runCallback(param -> param * 2)
    runCallback(param => param * 2)

### Bound
    foo() => this.someProp

Compiles to ES6 fat arrows whenever possible.
See also [bound methods]().

Note that when used in an expression, the name is discarded:
    runCallback(foo() => 1)

### Async
    foo() -/>
      Promise.resolve(42)
    boundFoo() =/>
      Promise.resolve(this.answer + 42)

See also [await]().

### Generators
    foo() -*>
      yield 3
      yield 4


## Methods

### Basic Methods
    obj := {
      foo() -> 'hello'
      bar() ->
        'hi there'
    }

### Bound Methods
    obj := {
      name: 'Jack'
      foo() => this.name.toUpperCase()
    }

### Getters and Setters
    obj := {
      foo() -get> this._foo
      foo(newValue) -set> this._foo = newValue
    }

See also [Classes](#classes).
Note that fat arrows (`=get>` and `=set>`) are not available,
as getters and setters generally do not require binding.


## Conditionals

### Basic `if`
    if a == b:
      console.log('a is b')
      console.log('b is a, too')

### One-line `if`
    if a != b: console.log('a isnt b')

    foo(a) ->
      if a.length === 0: return
      // ...

### `elif`
    if a == 1:
      foo()
    elif a > 2:
      bar()
    else:
      baz()

`else if` also works.

### If-Expressions (Ternaries)
    animal := if canBark: 'dog' else: 'cow'

You can also use `elif` and `else if` within if-expressions.

### `null`-default If-Expressions (Ternaries)
    animal := if canBark: 'dog'

### Multiline If-Expressions (Ternaries)
    animal := if canBark:
      'dog'
    else if canMeow:
      'cat'
    else:
      'cow'

Note that currently, an extra indent for the `else`'s above is not allowed.
Instead, you can do:

    animal :=
      if canBark:
        'dog'
      elif canMeow:
        'cat'
      else:
        'cow'

## Logic and Equality

### `or`
    a or b

### `and`
    a and b

### `not`
    not c

`not` has the same precedence rules as `!`.

### `==`
    1 == 1

Both `==` and `===` compile to `===`, which is almost always what you want.

When you actually want to use a coercing-equals,
call the [`coercingEq()`]() function from the standard library (eg; `1~coercingEq('1')`).

### `!=`
    1 != 0

Similarly, both `!=` and `!==` compile to `!==`.

When you actually want to use a coercing-not-equals,
call the [`coercingNotEq()`]() function from the standard library.


### Example

    if a == b:
      'a === b'

    if b != c:
      'b !== c'

    if d and not e:
      'd is truthy, e is falsy'

    if g or h:
      'either g or h is truthy'


### Bitwise Operators
Bitwise operators (namely `|`, `&`, `^`, `~`, `<<`, `>>`, `>>>`) are not included in the language.
Instead, they are [provided as functions]() in the standard library.

Bitwise assignment operators (namely `|=`, `&=`, `^=`, `<<=`, `>>=`, `>>>=`)
may be repurposed in the future, but have not yet been removed.

## Existentialism (TODO)

NOTE TO SELF: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md#comparing-nulls-to-undefineds

NOTE TO OTHERS:
Work has not yet begun on the Existential features below.

### Existential operator
    if a?:
      1

Note that this does not perform an "undeclared" check, as CoffeeScript does.
If you want to deal with global variables, you must access them from the global object (eg, `window`) directly.
The compiler or linter should catch references to undeclared variables.

Note that disambiguation between the existential `?` and the ternary `?`
(as in `test ? 'its truthy' : 'its falsy'`)
is done on the basis of whether the `?` has a space in front of it.

So `x ?` will be parsed (incorrectly) as the beginning of a ternary,
while `x? 'truthy' : 'falsy'` will be parsed (incorrectly) as an existential `?`.

The use of `? :` ternaries is discouraged in LightScript in favor of [If-Expressions]().

### null-or
    c := a ?? b
---
    const c = (a != null ? a : b);

### or-equals
    obj.prop ?= 42
---
    obj.prop = (obj.prop != null ? obj.prop : 42);

### Elvis operator
    d = a?.b?.c
---
    const d = (a != null
      ? (a.b != null ? a.b.c : null)
      : null
    );
Note that the default value is `null`, unlike CoffeeScript's `undefined`.

### Safe calls
    if foo?():
      1
---
    if (isFunction(foo) ? foo() : null)
      1
See [the standard library]() for `isFunction` (tl;dr, it comes from lodash).


## Objects and Arrays

### Single-Line Objects
    obj := { a: 'a', b, [1 + 1]: 'two', ...anotherObj }
Destructuring, dynamic names, and splats are the same as in JS.

### Multi-Line Objects
    obj := {
      a: 'a'
      b
      [1 + 1]: 'two'
      method() =>
        3
      ...anotherObj
    }
Commas are not necessary. Using commas in a multiline object raises a linting error.

### Destructured Property Transfer (TODO)
    bar := { a: 1 }
    foo := { b: 2, c: 3, d: 4 }
    bar{ b, c } = foo
---
    const bar = { a: 1 }
    const foo = { b: 2, c: 3, d: 4 };
    bar.b = foo.b;
    bar.c = foo.c;

### Single-Line Arrays
    arr := [1, 2, 3]

### Multi-Line Arrays
    arr := [
      1
      2
      2 + 1
      5 - 1
      5
    ]
Again, commas are unnecessary.


## Classes

### Basic Classes
    class Animal:
      talk() -> 'grrr'

    class Person extends Animal:
      talk() -> 'hello!'

### Decorators
    @classDecorator
    class Animal:
      @methodDecorator
      talk() -> 'grrr'
The same as ES7.

### Shorthand for `this.` (TODO)
    class Animal:
      talk() ->
        ^noise
---
    class Animal {
      talk() {
        return this.noise
      }
    }
The pin operator `^` can be used as shorthand for `this.` outside of classes as well.

Note that unlike coffeescript, `^` cannot be used on its own to refer to `this`. So, for example, `return this` must be written instead of `return ^`

### Getters and Setters
    class Animal:
      noise() -get>
        this.sound or 'grrr'
      noise(newValue) -set>
        this.sound = newValue

See also [Object Methods](#object-methods).

### Class properties ("class instance fields")
    class Animal:
      noise = 'grrr'
As in EcmaScript.

### Static properties and methods ("class static fields")
    class Animal:
      static isVegetable = false
      static canMakeNoise() -> true
As in EcmaScript.

### Bound static methods
    class Animal:
      static kingdom() => this.name
In this example, `kingdom()` will always return `'Animal'` regardless of its calling context.

### Pinned constructor params (TODO)
    class Animal:
      constructor(^noise, { limbs: { ^numLimbs } }) ->

### Bound methods
    class MyComponent extends React.Component:
      handleClick() =>
        ^setState({ clicked: true })
      render() ->
        <button onClick={^handleClick}>
          Click me!
        </button>
Use a fat arrow (`=>`) to bind class methods.
This will be added to the constructor after a `super` call, which will be created if it does not exist.

You cannot use bound class methods if you `return super()`,
which is something you usually [shouldn't do anyway](TODO).

### Auto-Super
    class MyComponent extends React.Component:
      constructor(foo) ->
        console.log("I forgot to call super!")
LightScript will insert `super()` for you if you define a `constructor` in a class that `extends` another class,
and will pass along your parameters to the baseclass.

This behavior may be changed in the future.

## Switch
As in JavaScript. You can use without parens or braces, like so:
    switch val:
      case "x":
        break
      case "y":
        break
This may be removed in the future, however.

## Numbers

### Underbars (TODO/TBD)
    oneMillionDollars: Cents = 1_000_000_00
---
    const oneMillionDollars: Cents = 100000000;

### Restrictions (TODO/TBD)
Decimals must be prefixed with a zero (eg, `.9` is not allowed, but `0.9` is).

## `for` loops

EcmaScript has three kinds of `for` loops; `for-in`, `for-of`, and `for (...;...;...)`.
LightScript adds a fourth.

### `for-in`
    for key in obj:
      val := obj[key]
Note that the iterator variable is `const` by default.

PSA: using `in` with an Array is usually [not what you want](TODO); use `for-from` instead.

### `for-in` with value (TODO)
    for key, value in obj:
      console.log(key, value)

As noted above, should not be used with Arrays.

### `for-own-in` (TODO)
    for own key in obj:
      console.log(key)

    for own key, value in obj:
      console.log(key, value)

As noted above, should not be used with Arrays.

### `for-of`
    for elem of array:
      console.log(elem)

    for val of obj:
      console.log(val)

As in JavaScript, with `const` as default.

Note that you can also do this:

    for [ index, elem ] of array.entries():

Which is a feature of modern EcmaScript.

### `for-from`
    for i from array:
      console.log(i)

    for i, thing from array:
      console.log(thing)

Note that this feature is not to be used with Objects, only Arrays;
for Objects, see [`for-own-in` with value]().

### `for-from-til`

    for i from 0 til 10:
      console.log(i)

Without iterator variable:

    for 0 til 10:
      console.log("hello!")

Note that the above is exclusive (it goes up to 9, not 10); for inclusive, use `thru`:

    for i from 0 thru 10:
      console.log(i)

which would start with 0 and end with 10.

### `for init ; test ; update`

When the `for i from array` or `for i from 0 til n` constructs are insufficient, you may use a traditional `;;` for-loop:

    for let i = 10; i >= -10; i--:
      console.log(i)

### Single-line `for`
    for elem of collection: console.log(elem)

This syntax can be used with all for-loops.

Note that you can combine this with single-line `if` statements:

    for elem of collection: if elem > 3: console.log(elem)


## Comprehensions

### Array Comprehensions

    doubledItems := [for item of array: item * 2]
    filteredItems := [for item of array: if item > 3: item]

Note that you can nest for-loops within an array, and they can take up multiple lines:

    listOfPoints := [
      for x of xs:
        for y of ys:
          x + y
    ]

You can also nest comprehensions within comprehensions for constructing multidimensional arrays:

    matrix := [
      for row from 0 til n:
        [ for col from 0 til n: { row, col } ]
    ]

Note that if `else` is not provided, items that do not match an `if` are filtered out; that is,

    [for i from 1 thru 4: if i > 2: i]

will result in `[3, 4]`, not `[null, null, 3, 4]`


### Object Comprehensions (TODO)

    objFromArr := { for i, item from array: "thing_{i}", item }

    objFromObj := { for own key, value in obj: key, value * 2 }
---
    const objFromObj = (() => {
      const returnValue = {};
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        returnValue[key] = value;
      }
      return returnValue;
    });

The syntax for this is not yet settled.


## Incompatibilities with JavaScript

### Blocks
In LightScript, a `{` at the beginning of a line parses as the start of an object, not a block.
For example, the following code would be broken in LightScript:

    if (true)
    {
      // body goes here
      let x = 3
    }

You must instead use the following style when using curly braces:

    if (true) {
      let x = 3
    }

In the rare case that you wish to use an anonymous block, such as

    function foo() {
      // some code up here
      {
        // code in an anonymous block here
        let x = 'private!'
      }
      // more code down here
      let x = 5
    }

you may prefix the anonymous block with a semicolon, as so:

    function foo() {
      // some code up here
      ;{
        // code in an anonymous block here
        let x = 'private!'
      }
      // more code down here
      let x = 5
    }

Similarly, if using blocks with `switch`/`case`, you cannot write

    switch (foo) {
      case bar:
        {
          // contents of block here
          let x = 3
        }
    }

and must instead write

    switch (foo) {
      case bar: {
        // contents of block here
        let x = 3
      }
    }

## Ambiguities

I tried really hard to have no ambiguities.
Shamefully, at least one has snuck up on me that I don't know a way around:

### Colons, Arrows, and Types

If you have an `if` whose test is a function call,
and whose consequent is an arrow function without parentheses or curly braces, eg;

    if fn(): x => 4

it will parse as a function `fn() => 4` with type annotation `x`,
and then throw a SyntaxError: `Unexpected token, expected :`.

This can be corrected by wrapping the param in parens:

    if fn(): (x) => 4

Sorry.
