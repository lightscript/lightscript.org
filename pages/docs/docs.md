## TOC


- variables & assignment
  - const
  - let and var
  - type annotations
  - now
    - UpdateExpression
    - shadowing
    - MemberExpression
- conditionals
  - paren-free
  - curlies
  - whitespace
  - elif
  - if-expressions
    - beware the indent
    - implicit else-null
- operators
  - ==
  - !=
  - and
  - or
  - not
- functions
  - fat arrows
    - disappearing name
  - skinny arrows
  - methods
  - implicit returns
    - void
    - exceptions
  - async
  - get/set
  - generators
    - fat-arrow compilation
  - illegal combinations
  - type annotations
    - return types
    - params
    - polymoprhism
- await
  - await-equals
    - const, MemberExpression, now
  - naked await, return await
  - safe-await
- property access
  - SafeMemberExpression
    - ?.
    - ?[
  - Array dot access (array.0)
  - function property definition
- tilde-calls
  - basic example
  - chaining example
- for loops
  - (intro on why arrays suck in js)
  - (paren-free stuff)
  - for-in auto-const
  - for-of auto-const
  - for-from array
    - index
    - element
  - for-from range
  - for ;;
- array comprehensions
  - nested-for
  - matrix
- while loops
  - do-while
- switch
- Arrays
  - commaless
- Objects
  - commaless
  - methods
  - bound methods
- Classes
  - support for ES7 features
  - { or :
  - methods
  - bound methods
  - constructors
    - constructor() insertion
    - super() insertion
      - arguments
- Automatic Semicolon Insertion
  - `+` and `-`, binary and unary
  - `/`, division and regular expression
  - `(`, expressions and function calls
  - `<`, less-than and JSX
  - `[`, index-access and arrays
  - number-access... look into this
- Inconsistencies, Ambiguities, and Known Bugs
- Deviations from JavaScript
  - `==`, `!=`
  - `~`
  - keywords
    - `now`, `or`, `and`, `not`, `til`, `thru`, `from`(?)
  - ASI. "broken" things:
    - `[0]` at same indent level
    - unspaced binary `+`, `-`, `/`
    - regex with an opening space
  - typedef no breaks


## Variables & Assignment

### `const`

LightScript is `const` by default; the keyword is not necessary:

    foo = 'hello'
    { steepTime, origin } = tea
    [ first, ...others ] = list

Because LightScript is a rough superset of JavaScript,
the `const` keyword is still valid:

    const foo = 'hello'

#### `const` with type annotations

    foo: string = 'hello'

LightScript uses Facebook's [Flow](flowtype.org) typechecker and type syntax.

As a rule of thumb, anywhere you can use Flow syntax in JavaScript,
you can use the same syntax in LightScript.

Note that, unlike in JavaScript, the type annotation cannot be followed by a newline:

    foo:
      string = 'hello'

is not valid.

### `let` and `var`
    let foo = "first, I am foo!"
    now foo = "hah, I have been reassigned!"

`let` and `var` are the same as in JavaScript. However, to reassign a variable,
you must use the keyword `now`. This makes it more clear when you are reassigning
(which shouldn't be often), and enables the `const`-by-default syntax.

This can be a bit tricky at first:

    let weekend
    if weatherIsGood:
      weekend = 'gone skiing!'
    else:
      weekend = 'couch potato'

doesn't do what you want, since the inner `weekend` variables are redeclared as shadow `const` variables; you need to use `now`:

    let weekend
    if weatherIsGood:
      now weekend = 'gone skiing!'
    else:
      now weekend = 'couch potato'

(Note that the above code would be better written with an [If-Expression](#if-expressions-ternaries)).

### Updating values

Assignments that update a variable also require the `now` keyword:

    now x += 3
    now x *= 2

However, assigning to an object's property does not currently require `now`
(though this may change in the future):

    now object.property = value

    object.property = value

Similarly, non-assignment updates do not currently require `now`:

    now x++
    x++

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
    obj = {
      foo() -> 'hello'
      bar() ->
        'hi there'
    }

### Bound Methods
    obj = {
      name: 'Jack'
      foo() => this.name.toUpperCase()
    }

### Getters and Setters
    obj = {
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
    animal = if canBark: 'dog' else: 'cow'

You can also use `elif` and `else if` within if-expressions.

### `null`-default If-Expressions (Ternaries)
    animal = if canBark: 'dog'

### Multiline If-Expressions (Ternaries)
    animal = if canBark:
      'dog'
    else if canMeow:
      'cat'
    elif canQuack:
      'duck'
    else:
      'cow'

Note that currently, an extra indent for the `else`'s above is not allowed.
Instead, you can do:

    animal =
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


## Null Safety

### Elvis operator
    d = a?.b?.c

Note that the default value is `null`, unlike CoffeeScript's `undefined`.

## Objects and Arrays

### Single-Line Objects
    obj = { a: 'a', b, [1 + 1]: 'two', ...anotherObj }
Destructuring, dynamic names, and splats are the same as in JS.

### Multi-Line Objects
    obj = {
      a: 'a'
      b
      [1 + 1]: 'two'
      method() =>
        3
      ...anotherObj
    }
Commas are optional; newlines are preferred.

### Single-Line Arrays
    arr = [1, 2, 3]

### Multi-Line Arrays
    arr = [
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

## `for` loops

EcmaScript has three kinds of `for` loops; `for-in`, `for-of`, and `for (...;...;...)`.
LightScript adds a fourth.

### `for-in`
    for key in obj:
      val = obj[key]
Note that the iterator variable is `const` by default.

PSA: using `in` with an Array is usually [not what you want](TODO); use `for-from` instead.

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

    doubledItems = [for item of array: item * 2]
    filteredItems = [for item of array: if item > 3: item]

Note that you can nest for-loops within an array, and they can take up multiple lines:

    listOfPoints = [
      for x of xs:
        for y of ys:
          x + y
    ]

You can also nest comprehensions within comprehensions for constructing multidimensional arrays:

    matrix = [
      for row from 0 til n:
        [ for col from 0 til n: { row, col } ]
    ]

Note that if `else` is not provided, items that do not match an `if` are filtered out; that is,

    [for i from 1 thru 4: if i > 2: i]

will result in `[3, 4]`, not `[null, null, 3, 4]`


## Incompatibilities with JavaScript

### Blocks
In LightScript, a `{` at the beginning of a line parses as the start of an object, not a block.
For example, the following code breaks in LightScript:

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

## Syntax Ambiguities

Unfortunately, there are a few ambiguous corner-cases.

### Colons, Arrow, and Types

If you have an `if` whose test is a function call,
and whose consequent is an arrow function without parentheses or curly braces, eg;

    if fn(): x => 4

it will parse as a function `fn() => 4` with type annotation `x`,
and then throw a SyntaxError: `Unexpected token, expected :`.

This can be corrected by wrapping the param in parens:

    if fn(): (x) => 4

### Colons, If, and Types

The following code will raise a syntax error:

    if
      someCondition: obj.prop = value

because `someCondition: obj.prop = value` parses a `const someCondition` declaration
with the type annotation of `obj.prop` and the value of `value`.

This can be fixed by removing the newline between `if` and `someCondition`:

    if someCondition: obj.prop = value

or by moving the consequent to the next line:

    if
      someCondition:
        obj.prop = value

and of course, the dramatically more sane construct works just fine:

    if someCondition:
      obj.prop = value

Note that multiline `if`s that use binary operators are not subject to this issue:

    if someCondition and
      anotherCondition: obj.prop = value

parses as expected.

Note also that since LightScript does not allow variable-declaring type annotations
to contain a newline between the `:` and the type, any `if` or `for`
that has its body on the next line (or which isn't an assignment) is safe.
