## TOC

## Variables & Assignment

### `const`

LightScript is `const` by default; the keyword is not necessary:

    greeting = 'Hello, World!'

This is also true when destructuring:

    { color, owner } = lightsaber

Because LightScript is a (rough) superset of JavaScript,
the `const` keyword is also valid:

    const greeting = 'Hello, World!'

LightScript uses Facebook's [Flow](flowtype.org) typechecker and type syntax,
so you can optionally annotate types:

    greeting: string = 'Hello, World!'

As a rule of thumb, anywhere you can use Flow syntax in JavaScript,
you can use the same syntax in LightScript.

Integration with the Flow typechecker has **not been built yet**,
so while you can annotate your types, they will not yet be statically checked.
This is blocking on [Flow accepting an AST as input](https://github.com/facebook/flow/issues/1515).
As a stopgap, the `babel-preset-lightscript` may include
[tcomb](https://github.com/gcanti/babel-plugin-tcomb), which provides runtime typechecks.

Note that, unlike in JavaScript, the `:` cannot be followed by a newline.

### `let` and `var`

`let` and `var` are the same as in JavaScript.

    let friendCount = 1

However, to reassign a variable, you must use the keyword `now`:

    let friendCount = 1
    // makes a friend...
    now friendCount = 2

### Updating values

Reassigning or updating a variable requires the `now` keyword.
This makes it more clear when you are reassigning
(which shouldn't be often), and enables the `const`-by-default syntax.

    let isDarkSide = false
    // ... gets stuck in traffic ...
    now isDarkSide = true

Assignments that update a variable also require the `now` keyword:

    let planetsDestroyed = 0
    // the death star is fully operational
    now planetsDestroyed += 1

However, assigning to an object's property allows, but does not require `now`:

    now milleniumFalcon.kesselRun = 'less than 12 parsecs!'

    milleniumFalcon.kesselRun = 'less than 12 parsecs!'

Similarly, non-assignment updates allow but do not currently require `now`:

    now planetsDestroyed++
    planetsDestroyed++

### Shadowing Variables

You cannot shadow a variable using `const` shorthand:

    let myVar = 2
    if (true) {
      myVar = 3
    }

The above is not allowed because it looks ambiguous and confusing;
did you mean to declare a new variable, or were you trying to update
the existing variable, and just forgot to use `now`?

Instead, you must explictly use either `now` or `const`:

    let myVar = 2
    if (true) {
      const myVar = 3
    }
    myVar === 2 // true

    let myOtherVar = 4
    if (true) {
      now myOtherVar = 5
    }
    myOtherVar === 5 // true

## Whitespace

Since (almost) all valid JavaScript is valid LightScript,
you can write loops and conditionals as you always would, complete with parens and curlies.

You can write `if`, `for`, etc without parens, but with curly braces:

    for const x of arr {
      if x > 10 {
        print('wow, so big!')
      } else {
        print('meh')
      }
    }

Or, if you prefer, use significant indentation:

    for const x of arr:
      if x > 10:
        print('wow, so big!')
      else:
        print('meh')

This "curly-or-whitespace" option is also available for class and function bodies.

Whitespace (significant indentation) is often more concise and readable for simple code,
but when blocks get very long or deeply nested, curly braces offer better visibility. Teams have the freedom to choose a style that feels comfortable.

### One-line syntax

Blocks that contain only a single statement can be written on the same line:

    for elem thing in list: print(thing)

    if x < 10: print('x is small')

One-line blocks can be combined:

    for elem x in arr: if x < 10: print(x)

You cannot, however, mix one-line and multiline syntax:

    for x of arr: print(x)
      print('This is broken.')

### What constitutes indentation?

An indent is two spaces, period.

LightScript only allows "normal" (ascii-32) whitespace;
tabs, non-breaking spaces, and other invisible characters raise a SyntaxError.
Similarly, only `\n` and `\r\n` are valid line terminators.

Overindentation is currently allowed, but discouraged. It may be made illegal in the future.

### When does an indent end?

An indented block is parsed until the indent level of a line is less than or equal to
the indent level of the line that started the block.

For example, in this code:

    if treeIsPretty and
      treeIsTall:
        climbTree()

`climbTree()` needs the two indents it has, because the line with the `:` has one indent.
An `else` could have either zero or one indent.

## Conditionals

### `elif`

The same as `else if`, which you can also use:

    if awesome:
      jumpForJoy()
    elif great:
      highFive()
    else if good:
      smileMeekly()
    else:
      cringe()

### `if` expressions

In LightScript, ternaries look like `if`s:

    animal = if canBark: 'dog' else: 'cow'

### Multiline `if` expressions
    animal =
      if canBark:
        'dog'
      elif canMeow:
        print('These ternaries can take multiple expressions')
        'cat'
      else:
        'cow'

Note that if you move the `if` to the first line, the rest of the code
must be dedented so that the `else`s have the same indent level as `animal`.

### `null`-default `if` expressions

If you don't include an `else`, it will be `null`:

    maybeDog = if canBark: 'dog'

## Logic and Equality

### `==`
    1 == 1

Both `==` and `===` compile to `===`, which is almost always what you want.

When you actually want to use a loose-equals (`==`), call the `looseEq()` function
from the [standard library](#standard-library) (eg; `1~looseEq('1')`).

### `!=`
    1 != 0

Similarly, both `!=` and `!==` compile to `!==`.

When you actually want to use a loose-not-equals (`!=`),
call the `looseNotEq()` function from the [standard library](#standard-library).

### `or`
    a or b

### `and`
    a and b

### `not`
    not c

`not` may be removed from the language in the future.


## Functions and Methods

JavaScript has half a dozen ways to define a function;
LightScript unifies that to just one, consistent across contexts.

The basic syntax comes from stripping down the fat arrow:

    const myFunction = (x, y) => x + y

to the more minimal:

    myFunction(x, y) => x + y

Unbound functions use a skinny arrow (`->`),
async functions use a barbed arrow (`-/>` or `=/>`),
and methods look the exact same as top-level functions.

LightScript functions have implicit returns and optional curly braces:

    myFunction(x, y) =>
      print('multiplying is fun!')
      x * y

    myCurlyFunction(x, y) => {
      print('adding is fun!')
      x + y
    }

### Bound

    foo() => this.someProp

Compiles to ES6 fat arrows whenever possible,
and inserts the relevant `.bind()` call otherwise.
See also [bound methods](#bound-methods).

Note that when used in an expression, the name is discarded:

    runCallback(foo() => 1)

### Unbound

Skinny arrows (`->`) are unbound:

    ultimateQuestion() -> 6 * 9

    sillySumPlusTwo(a, b) ->
      now a++
      now b++
      a + b

While you're welcome to use `=>` pretty much everywhere, there are a few advantages
of using skinny arrows:

- `function` declarations are hoisted, meaning you can declare utility methods
  at the bottom of a file, and main methods at the top.
- Fat-arrow methods insert `.bind()` calls, which may be unncessary if the method
  doesn't actually need to be bound.

### Without implicit returns

To disable implicit returns for a method, give it a `void` type annotation.

    foo(): void ->
      1

LightScript does not add implicit returns:

- To functions with a `void` returnType annotation (eg; `fn(): void ->`).
- To setter methods (eg; `{ prop(newValue) -set> this._prop = newValue }`).
- To constructor methods (eg; `constructor() ->`), which generaly should not return.
- When the function ends in a variable assignment (eg; `fn() -> x = 2`).

### Annotated

LightScript uses Facebook's [Flow](flowtype.org) typechecker and type syntax.

    foo(a: string, b: number): number ->
      a.length + b

Polymorphic:

    foo<T>(a: T): T -> a

### Anonymous

    runCallback(() -> 42)
    runCallback(param -> param * 2)
    runCallback(param => param * 2)

### Async

    foo() -/>
      Promise.resolve(42)

    boundFoo() =/>
      Promise.resolve(this.answer + 42)

See also [await](#await).

### Generators

    foo() -*>
      yield 3
      yield 4

Note that JavaScript does not support fat-arrow generator functions;
LightScript compiles them to bound functions:

    boundFoo() =*>
      yield 3
      yield 4

### Note on illegal combinations

You can't combine `*` and `/` into, say, `-*/>` because async functions can't
also be generator functions.

See also [`get` and `set`](#getters-and-setters), below.

### Basic Methods
    obj = {
      foo() -> 'hello'
      bar() ->
        'hi there'
    }

### Bound Methods
    obj = {
      name: 'Jack'
      loudName() => this.name.toUpperCase()
    }

### Getters and Setters
    obj = {
      foo() -get> this._foo
      foo(newValue) -set> this._foo = newValue
    }
    obj.foo = 'hi'
    obj.foo

See also [Classes](#classes).

Note that fat arrows (`=get>` and `=set>`) are not available,
as getters and setters generally do not require binding.

Note also that `-get>` and `-set>` cannot be combined with `-/>` or `-*>` syntax.

## Await
```
getData(url) -/>
  response <- fetch(url)
  <- response.json()
```
### Await and Assign

To assign to a `const`, supply a variable name on the left side of the arrow:
```
getData(url) -/>
  response <- fetch(url)
  response
```
To reassign an existing variable, use `now`:
```
reassignData(data) -/>
  now data <- asyncTransform(data)
  data
```
If you are mutating an object's property, `now` is optional:
```
reassignDataProp(obj) -/>
  now obj.data <- process(obj.data)
  obj.data <- process(obj.data)
  obj
```
Note that in all cases, the `<-` must be on the same line as the variable.

### Await without Assign

A `<-` that begins a line is a "naked await":
```
delayed(action, delay) -/>
  <- waitFor(delay)
  action()
```
It can be implicitly returned like anything else:
```
getData(url) =/>
  response <- fetch(url)
  <- response.json()
```
### Await Array

When an `await` is followed by a `[`, it is wrapped in `Promise.all()`:
```
fetchBoth(firstUrl, secondUrl) -/>
  <- [fetch(firstUrl), fetch(secondUrl)]
```
You do not need to use the `<-` symbol to take advantage of this:
```
fetchBoth(firstUrl, secondUrl) -/>
  return await [fetch(firstUrl), fetch(secondUrl)]
```
You cannot pass a value that happens to be an array; it must be contained in `[]`:
```
awaitAll(promises) -/>
  <- promises
```
doesn't work, but this does:
```
awaitAll(promises) -/>
  <- [...promises]
```
This can alo be combined with Array Comprehensions:
```
fetchAll(urls) -/>
  <- [for elem url in urls: fetch(url)]
```

### Safe Await

The most likely source of errors in any application should occur at I/O boundaries,
which are also typically crossed asynchronously. Any time you `fetch()` across a network,
you should expect it to fail some percentage of the time, and prepare accordingly.

In JavaScript, this can be inconvenient:

    getData(url) -/>
      let response
      try {
        now response = await fetch(url)
      } catch (err) {
        handle(err)
        return
      }
      return await response.json()

The small try/catch blocks are annoying and force you to use unnecessary `let`s.
The alternative is to put all logic using the `await`ed value into the `try` block,
which is also an anti-pattern.

In LightScript, you can easily wrap an await in a try/catch:
```
getData(url) -/>
  response <!- fetch(url)

  if isError(response):
    handle(response)
    return

  <- response.json()
```

This pattern is much closer to the "safely handle errors within normal control-flow"
philosophy of Rust, Haskell, and Go, which use `Result`, `Maybe`, or multiple return values.

Because LightScript uses Flow for static type checking, any code that follows a
`<!-` must handle the error case.

## Property Access

### Null-Safe Property Access

*(also known as safe navigation operator, optional chaining operator, safe call operator, null-conditional operator)*

    lacesOrNull = hikingBoots?.laces

This also works with computed properties:

    treeTrunk?.rings?[age]

Safe chains that contain methods will not be called more than once:

    getDancingQueen()?.feelTheBeat(tambourine)

    getDanceFloor().dancingQueen?.isSeventeen

Note that the default value is `null`, unlike CoffeeScript's `undefined`.

### Numerical Index Access

    firstChance = chances.0
    secondChance = chances.1

This is a minor feature to make chaining more convenient, and may be removed in the future.

There is not a negative index feature (eg; `chances.-1` doesn't work),
but once the standard library is implemented, you will be able to write:

    lastChance = chances~last()

using the [Tilde Call](#tilde-calls) feature. For now, you can do the above
with `import { last } from 'lodash'`.

### Property function definition

You can define properties that are functions using the standard LightScript arrow syntax:

    mammaMia.resistYou() -> false

    mammaMia.hereWeGo() => this.again

    Mamma.prototype.name() -> "Mia!"

## Tilde Calls

This is a headline feature of LightScript, and a slightly unique mix of
Kotlin's Extensions Methods, Ruby's Monkey Patching, and Elixir's Pipelines.

    subject~verb(object)

The underlying goal is to encourage the functional style of separating
immutable typed records from the functions that go with them,
while preserving the human-readability of "subject.verb(object)" syntax
that Object-Oriented methods provide.

It enables slightly more readable code in simple situations:

    if response~isError():
      freakOut()

<!-- -->

    money = querySelectorAll('.money')
    money~map(mustBeFunny)

And makes chaining with functions much more convenient, obviating intermediate variables:

    allTheDucks
      .map(duck => fluffed(duck))
      ~uniq()
      ~sortBy(duck => duck.height)
      .filter(duck => duck.isGosling)

LightScript will soon include a standard library, consisting primarily of lodash methods.


## Objects

See also [Methods](#methods).

### Single-Line Objects

The same as JavaScript (ES7):

    obj = { a: 'a', b, [1 + 1]: 'two' }

For all ES7 features, use `babel-preset-lightscript` instead of `babel-plugin-lightscript`
or include the babel plugins directly.

### Multi-Line Objects

Commas are optional; newlines are preferred.

    obj = {
      a: 'a'
      b
      method() =>
        3
      [1 + 1]: 'two'
    }

## Arrays

### Single-Line Arrays

The same as JavaScript.

    arr = [1, 2, 3]

### Multi-Line Arrays

Again, commas are optional; newlines are preferred.

    arr = [
      1
      2
      2 + 1
      5 - 1
      5
    ]

## Comprehensions

### Array Comprehensions

    doubledItems =
      [ for elem item in array: item * 2 ]
<!-- -->

    filteredItems =
      [ for elem item in array: if item > 3: item ]

Note that you can nest for-loops within an array, and they can take up multiple lines:

    listOfPoints = [
      for elem x in xs:
        for elem y in ys:
          if x and y:
            { x, y }
    ]

You can also nest comprehensions within comprehensions for constructing multidimensional arrays:

    matrix = [ for idx row in Array(n):
      [ for idx col in Array(n): { row, col } ]
    ]

Note that if `else` is not provided, items that do not match an `if` are filtered out; that is,

    [ for idx i in Array(5): if i > 2: i ]

will result in `[3, 4]`, not `[null, null, null, 3, 4]`

### Object Comprehensions

As with Array Comprehensions, but wrapped in `{}` and with comma-separated `key, value`.

    { for elem item in array: (item, f(item)) }

The parens are optional:

    flipped =
      { for key k, val v in obj: v, k }


## Loops

In JavaScript, there's really only one fast option for iteration: `for-;;`.
It's so ugly, though, that most developers avoid it in favor of more ergonomic
(but less performant and powerful) alternatives, like `.forEach()` and `for-of`.

With LightScript, you don't have to compromise.

### Iterating over Arrays

Iterate over indices and elements of an array:

    for idx i, elem x in arr:
      print(i, x)

Only indices:

    for idx i in arr:
      print(i)

Only elements:

    for elem x in arr:
      print(x)

Note that if you are iterating over something more complicated than a variable
(eg; a function call), it will be lifted into its own variable so as not to be called twice:

    for elem x in foo():
      print(x)

### Iterating over Objects

Iterate over keys and values of an object:

    for key k, val v in obj:
      print(k, v)

Only keys:

    for key k in obj:
      print(k)

Only values:

    for val v in obj:
      print(v)

Note the `hasOwnProperty` check.

This implementation is subject to change in the future,
most likely by iterating over `Object.keys(obj)` with a `for-;;`
to eliminate the `hasOwnProperty` check, which incurs a performance hit.

### Iterating over Ranges

There is no builtin support for ranges.
When the object instantiation is acceptable, use of `Array()`
or the lodash `range()` method (provided by [the stdlib](#standard-library))
is recommended:

    for idx i in Array(10):
      print(i)
<!-- -->

    for idx i in range(20, 100, 2):
      print(i)

If you are performing a numerical iteration and the array instantiation is problematic
for performance, `for-;;` is recommended:

    for let i = 0; i < n; i++:
      print(i)

### Traditional `for-in`

If you wish to iterate over all keys of an object without a `hasOwnProperty` check,
use `for-in` with `const`, `let`, `var`, or `now`:

    for const k in obj:
      print(k)
<!-- -->

    var k;
    for now k in {a: 1, b: 2}:
      print()

    print(k)
    // "b"

Unfortunately, the more concise `for x in arr` form would be ambiguous
(is it keys of an object or values of an array?) and is not allowed:

    for x in arr:
      print(x)

### Traditional `for-of`

If you are iterating over `[Symbol.iterator]` (eg; a generator function),
use `for-of` as in JS.

A construct like `for iter x in gen` may be introduced in the future for consistency.

Like `for-in`, `for-of` must include `const`, `let`, `var`, or `now`:

    for const x of gen:
      print(gen)

A naked variable is not allowed:

    for x of gen():
      print(x)

This is to encourage developers iterating over arrays to use the more performant
`for elem x in arr` rather than `for x of arr`, which is [slower](https://jsperf.com/for-of-vs-for-loop/15).
It may be relaxed in the future.

### Single-line `for`

    for elem x in stuff: print(x)

This syntax can be used with all `for` loops.

Note that you can combine this with single-line `if` statements:

    for elem x in stuff: if x > 3: print(x)


### `while` loops

As in JavaScript, with the standard syntax options:

    while true:
      doStuff()

### `do-while`

Curly braces for the `do` block are required; parens for the `while` clause are not.

    do {
      activities()
    } while true


### `switch`

As in JavaScript. Curly braces around the `case`s are required;
parens around the discriminant are not:

    switch val {
      case "x":
        break
      case "y":
        break
    }

This may change in the future. A `guard` or `match` feature may also be added.


## Classes

### Basic Classes

    class Animal {
      talk() -> 'grrr'
    }

    class Person extends Animal:
      talk() -> 'hello!'

### Bound Class Methods

    class Clicker extends Component:

      handleClick(): void =>
        this.setState({ clicked: true })

      render() ->
        <button onClick={this.handleClick}>
          Click me!
        </button>

Use a fat arrow (`=>`) to bind class methods.
This will be added to the constructor after a `super` call, which will be created if it does not exist.

You cannot use bound class methods if you `return super()`,
which is something you typically [shouldn't do anyway](TODO).

### Constructor and Super Insertion

If you define bound class methods with `=>`, a `constructor` method will be inserted
if one did not already exist.

LightScript will also insert `super()` for you if a `constructor` is defined
in a class that `extends` another class, and will pass along your parameters
to the base class.

    class Person extends Animal:
      constructor(foo) ->
        console.log("I forgot to call super!")

To disable `super`-insertion, define the constructor without a LightScript arrow:

    class NaughtyPerson extends Person:
      constructor(foo) {
        console.log("I don't want super called!")
      }

### Bound static methods

    class Animal:
      static kingdom() => this.name

In this example, `kingdom()` will always return `'Animal'`,
regardless of its calling context.

### Class Getters and Setters

    class Animal:
      noise() -get>
        this.sound or 'grrr'

      noise(newValue) -set>
        this.sound = newValue

See also [Object Methods](#object-methods).

### Class properties ("class instance fields")

As in ES7:

    class Animal:
      noise = 'grrr'

### Static properties and methods ("class static fields")

As in ES7:

    class Animal:
      static isVegetable = false
      static canMakeNoise() -> true

### Decorators

As in ES7:

    @classDecorator
    class Animal:

      @methodDecorator
      talk() -> 'grrr'


## Standard Library

By default, LightScript includes all of Lodash, and a few other functions,
to be imported as needed:

    [0.1, 0.3, 0.5, 0.7]~map(round)~uniq()
    // [0, 1]

    looseEq(3, '3')
    // true

    2~looseNotEq('3')
    // true

    bitwiseNot(1)
    // -2


### Contents

- Every method in [Lodash v4](https://lodash.com/docs/4.17.4)
  - Note that LightScript **does not** install lodash for you;
    you must run `npm install --save lodash` if you wish to use these features.
- `looseEq(a, b)`, which uses the JavaScript loose-equality `==` to compare two variables
  (available because in LightScript, `==` compiles to `===`).
- `looseNotEq(a, b)`, which uses the JavaScript loose-inequality `!=` to compare two variables.
- `bitwiseNot(x)`, which returns `~x`, since `~` has been repurposed in LightScript for [Tilde Calls](#tilde-calls).

### Overriding

User-defined identifiers will override a stdlib identifier:

    round(x) -> 100
    [0.1, 0.3, 0.5, 0.7]~map(round)~uniq()
    // [100]

In the future, this will be discouraged with an ESLint rule.

### Disabling

To disable this feature, pass `stdlib: false` to `babel-plugin-lightscript`, eg;

```
// .babelrc
{
  "plugins": [
    ["lightscript", { "stdlib": false }]
  ]
}
```

You may also similarly disable inclusion of lodash:

```
// .babelrc
{
  "plugins": [
    ["lightscript", {
      "stdlib": {
        "lodash": false,
      }
    }]
  ]
}
```

Note that this is unlikely to be necessary;
projects that simply don't call lodash methods won't have any lodash imports,
and if you do the import yourself LightScript won't add an import.

### Using require instead of import

If you are not transpiling `import` to `require()` calls with another plugin
(or with `babel-preset-lightscript`), you may need the `require: true` setting:

```
// .babelrc
{
  "plugins": [
    ["lightscript", {
      "stdlib": {
        "require": true,
      }
    }]
  ]
}
```

## Automatic Semicolon Insertion

*See the [tl;dr](#asi-tldr) for a quick overview*

90% of the time, JavaScript's Automatic Semicolon Insertion feature works every time.
That is, in most JavaScript code, semicolons are unnecessary.

But there are [a handful](http://inimino.org/~inimino/blog/javascript_semicolons)
of cases where a semicolon needs to be inserted, as encoded in
[the eslint `semi: "never"` rule](http://eslint.org/docs/rules/semi#options):

> statements beginning with `[`, `(`, `/`, `+`, or `-`

ES6 and JSX each introduce an additional ambiguity: ``` ` ``` and `<`, which are handled as well.

LightScript solves each issue in a slightly different way,
though each fix is essentially an encoding of stylistic best-practice into the syntax itself.

In practice, if you stick to community-standard code style,
you should not have to worry about any of this; they are documented for completeness.

### `+` and `-`: binary vs. unary

There are two possible interpretations of this code:

    1
    -1

It could either be a `1` statement followed by a `-1` (negative one)
statement, or a single `1 - 1` statement.
JavaScript chooses `1 - 1`, which is typically undesired.

This is because `+` and `-` take two forms in JavaScript:
*binary* (add or subtract two numbers) and *unary*
(make a number positive or negative).

To resolve this ambiguity, LightScript requires that *unary* `+` and `-`
are not separated by a space from their argument.
That is, `-1` is "negative one" while `- 1` is invalid LightScript.

With this restriction in place, it easy to give preference to the unary form
when a `+` or `-` begins a line:

    1
    + 1

    1+1

    1
    +1

Only the last example is a deviation from JavaScript,
which would interpret the two lines as `1 + 1`.

Again, beware that unary `+` and `-` cannot be followed by a space in LightScript:

    - 1

Without this fix, it would be difficult to implicitly return negative numbers:

    negativeThree() ->
      three = 3
      -three

(This would be `const three = 3 - three;` in JavaScript).

Similarly, it would be difficult to have lists with negative numbers:

    numbers = [
      0
      -1
      -2
    ]

(Without this ASI fix, that'd be `const numbers = [0 - 1 - 2];`).

### `/`: division vs. regular expression

In JavaScript, the following code throws a SyntaxError:

    let one = 1
    /\n/.test('1')

This is because it tries to parse the `/` at the start of the second line as division.
As you can see, LightScript does not share this problem.

LightScript makes a slightly crude generalization that draws from the same strategy
as `+` and `-` (above): Regular Expressions can't start with a space character (` `):

    / \w/.test(' broken')

This doesn't happen very often, and when it does, can be trivially fixed
by escaping the space or using a `\s` character:

    /\ \w/.test(' not broken')

    /\s\w/.test(' not broken')

Similary, a division `/` that starts a line cannot be followed by a space:

    1
    /2

This space is not required when the `/` does not start a line:

    1/2

    1
    / 2

### `(`: expressions vs. function calls

This is perhaps the most frequently problematic ASI failure, and the most easily fixed.

In JavaScript, the following code would try to call `one(1 + 1)`, which is not what you want:

    two = one + one
    (1 + 1) / 3

In LightScript, the opening paren of a function call must be on the same line as the function:

    doSomething(
      param)

    doSomething (
      param
    )

    doSomething
      (param) // oops!

### `[`: index-access vs. arrays

In JavaScript, the following code would try to access `one[1, 2, 3]` which isn't what you want:

    two = one + one
    [1, 2, 3].forEach(i => console.log(i))

That's because you often do see code like this:

    firstChild = node
      .children
      [0]

In LightScript, accessing an index or property using `[]` requires an indent:

    node
      .children
      [0]

    node
    .children
    [0] // oops!

The required indent is relative to the line that starts a subscript chain.

Note that this rule also applies to the "numberical index access" feature:

    node
      .children
      .0

    node
    .children
    .0 // oops!

### `<`: less-than vs. JSX

In JavaScript, the following would be parsed as `one < MyJSX` and break:

```
two = one + one
<MyJSX />
```

LightScript solves this in a similar manner to `+`, `-`, and `/`:
a less-than `<` that starts a line must be followed by a space:
```
isMyNumberBig = bigNumber
  <myNumber
```
is broken, but this works:

    isMyNumberBig = bigNumber
      < myNumber

### ``` ` ```: tagged vs. untagged templates

In JavaScript, the following would be parsed as ```hello`world` ```:

    hello
    `world`

As with function calls, a tagged template expression in LightScript must have
the opening ``` ` ``` on the same line as the tag.

### ASI tl;dr

**You never need semicolons in LightScript to separate statements.**

Instead, there are a few restrictions around edge cases:

1. For positive and negative numbers, use `+1` and `-1` instead of `+ 1` and `- 1`.
1. Regular expressions that begin with a space must use `/\ /` or `/\s/`, not `/ /`.
1. When starting a line with binary `+`, `-`, `\`, or `<`, the symbol must be followed by a space:

```
isOver100 = twoHundred
  / four
  + oneHundred
  - fifty
  < myNumber
```

## Known Ambiguities

Unfortunately, there are a few ambiguous corner-cases.
You are unlikely to hit them and there are easy fixes.

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


## Deviations from JavaScript

LightScript is a "rough superset" of JavaScript: *almost* all valid JavaScript
is valid LightScript.

This section aims to comprehensively document the cases where valid JavaScript
compiles differently (or breaks) in LightScript.

Most cases have been covered elsewhere in this documentation,
but are grouped here for convenience.

### Added keywords

`now`, `or`, `and`, `not`, `til`, and `thru` are reserved words in LightScript.

### `==` and `!=`

Perhaps the biggest semantic change, `==` compiles to `===` and `!=` compiles to `!==`.

### `~`

The unary Bitwise NOT `~` is not included in the language, as it has been repurposed
for [Tilde Calls](#tilde-calls).

Instead, you may use the `bitwiseNot()` function provided by the [standard library](#standard-library).

The other bitwise operators (namely `|`, `&`, `^`, `~`, `<<`, `>>`, `>>>`)
and bitwise assignment operators (`|=`, `&=`, `^=`, `<<=`, `>>=`, `>>>=`)
may be removed as well in the future.

### ASI Fixes

See [ASI](#automatic-semicolon-insertion) for a handful of breaking syntax changes,
mainly requiring or disallowing a space after an operator.

### No Invisible Characters

While invisible characters are legal in strings, the only ones allowed in code
are ` ` (ascii-32), `\n` and `\r\n`. Tabs, non-breaking spaces, and exotic unicode
such as `\u8232` raise `SyntaxError`s.


### Blocks vs. Objects

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
