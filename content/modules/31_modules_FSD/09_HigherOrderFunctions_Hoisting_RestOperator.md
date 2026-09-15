# Module 9: Higher-Order Functions (map/filter/reduce), Hoisting & Rest Operator

---

## 1. Overview

Is module me teen important JavaScript concepts cover kiye gaye hain: **Higher-Order Functions** (specifically `map`, `filter`, `reduce` — jo arrays par advanced operations ke liye use hote hain), **Hoisting** (JavaScript ka ek unique behavior jisme variables/functions unki declaration se pehle bhi "accessible" hote hain, kisi na kisi form me), aur **Rest Operator** (`...`) jo function me **variable number of arguments** handle karne ke liye use hota hai.

## 2. Prerequisites

- Module 7 (Functions) aur Module 8 (Arrays) completed hone chahiye.
- `var`/`let`/`const` ka scope-related behavior samajh hona chahiye.

## 3. Learning Objectives

- **Higher-Order Function** ki definition samajhna — function jo doosre function ko parameter ki tarah accept karta hai.
- `.map()` method se array ki har value pe operation perform karke naya/updated array banana.
- `.filter()` method se array ko condition ke basis pe filter karke naya array return karna.
- `.reduce()` method se poore array ko ek single value me convert karna (jaise sum, product).
- **Hoisting** kya hoti hai — `var` "fully hoisted" kyun hota hai jabki `let`/`const` "partially hoisted" (Temporal Dead Zone).
- **Rest Operator (`...`)** se function me undefined number of arguments ko ek array me collect karna.

## 4. Cleaned Transcript (Hinglish)

**Higher-Order Functions — Introduction**

**Higher-Order Function (HOF)** wo function hota hai jo **doosre function ko as a parameter accept** karta hai. Ye specifically **arrays** par kaam karte hain. Sabse common teen HOFs: `map`, `filter`, `reduce`.

**`.map()` — Transform Every Value**

Jab tumhe array ki **har value** pe koi operation perform karke ek **updated array** chahiye ho, `.map()` use hota hai:

```javascript
let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

nums = nums.map((value, index, array) => {
    return value * 5;
});

console.log(nums); // [5, 10, 15, 20, 25, 30, 35, 40, 45]
```

- `map()` ke callback function ko **teen properties** milti hain: `value` (current element), `index` (current position), `array` (poora original array) — teeno ka use optional hai, jitni chahiye utni le sakte ho.
- **Important:** `map()` khud original array ko update **nahi** karta — usse **naya modified array return** karna hota hai, jo variable me wapas assign karna padta hai (jaisa `nums = nums.map(...)` me kiya gaya) agar original ko update karna ho.

**`.filter()` — Select Matching Values**

Jab tumhe array me se sirf **kuch specific condition match karne waali values** chahiye, `.filter()` use hota hai — ye ek **naya array return karta hai**, original array ko modify nahi karta:

```javascript
let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let result = [];

result = nums.filter((value, index, array) => {
    if (value % 2 === 0) {
        return value;
    }
});

console.log(result); // [2, 4, 6, 8] (saari even values)
```
- `filter()` ke callback me condition hoti hai — agar `true` return ho, wo value naye array me include ho jaati hai.
- Callback bhi `value`, `index`, `array` teeno properties accept karta hai, sab pass karna optional hai.

**`.reduce()` — Combine All Values into One**

Jab tumhe poore array ko **ek single value** me convert karna ho (jaise total sum), `.reduce()` use hota hai:

```javascript
let nums = [10, 20, 30, 40, 50, 60, 70, 80, 90];

let sum = nums.reduce((accumulator, value, index, array) => {
    return accumulator + value;
}); // default initial accumulator value: 0

console.log(sum); // 450
```
- `reduce()` do main cheezein leta hai: ek **callback function** aur ek **optional initial value** (jo pehla argument accumulator ka starting point set karta hai).
- Callback me pehla parameter **accumulator** (running total/result) hota hai, doosra current `value`.
- Agar initial value nahi di, accumulator by default `0` se start hota hai — agar `10` diya jaaye (`nums.reduce(callback, 10)`), toh sum us `10` ko bhi add karega (result `10` extra ho jaayega).
- `reduce()` addition ke alawa multiplication ya koi bhi accumulating operation ke liye use ho sakta hai — bas callback ka logic change karna hota hai (jaise `accumulator * value` for product).

Instructor ne ye bhi mention kiya ki `sum`, `every`, `forEach` jaise aur bhi array methods hain — inhe khud explore karne ki practice recommend ki gayi.

**Hoisting**

**Hoisting** ka matlab hai kisi cheez ko uski **declaration se pehle access karna**. JavaScript engine code run karne se pehle ek phase me variables/functions ke references memory me store kar leta hai (isko **Temporal Dead Zone** kehte hain jab tak actual initialization na ho).

```javascript
console.log(a); // ReferenceError: a is not defined
```
Agar `a` kabhi declare hi nahi hui, error aati hai "a is not defined".

```javascript
console.log(a); // undefined (not an error!)
var a = 9;
```
Yahan `a` declare toh baad me hui hai, lekin error nahi aayi — sirf `undefined` print hua. Ye **hoisting** ki wajah se hai — `var` declarations JavaScript engine dwara **fully hoisted** hote hain (memory me pehle se allocate ho jaate hain, initial value `undefined`), isliye declaration line se pehle access karne pe error nahi aati, sirf `undefined` milta hai.

```javascript
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 8;
```
`let` (aur similarly `const`) ke saath, error aati hai — lekin ye error `"a is not defined"` se **different** hai, ye kehti hai "Cannot access 'b' before initialization" — matlab computer ko pata tha ki `b` future me declare hogi, lekin uski **value abhi access nahi ki ja sakti**. Isse pata chalta hai ki `let`/`const` **partially hoisted** hote hain (unka reference "Temporal Dead Zone" me exist karta hai, lekin usable nahi hota jab tak actual declaration line execute na ho).

**Summary:**
- `var` — **Fully Hoisted** (declaration se pehle access karne pe `undefined` milta hai, error nahi).
- `let`/`const` — **Partially Hoisted** (declaration se pehle access karne pe specific "cannot access before initialization" error milti hai).

**Rest Operator (`...`)**

Function me fixed parameters define karne pe, agar call time pe **zyada arguments** pass kiye jaayein, extra values simply **ignore/undefined** ho jaati hain:

```javascript
function add(a, b) {
    console.log(a + b);
}

add(4, 5);       // 9 - works fine
add(4, 5, 6);    // 9 - the extra "6" is simply ignored
```

Is problem ko handle karne ke liye **Rest Operator** (`...`) use hota hai — ye kisi bhi variable name se pehle laga ke us variable ko **bachi hui saari values ka array** bana deta hai:

```javascript
function add(a, ...b) {
    console.log(a); // 4 (first value)
    console.log(b); // [5, 6, 7, 8, ...] (baaki saari values ek array me)

    let sum = a;
    for (let i = 0; i < b.length; i++) {
        sum = sum + b[i];
    }
    console.log(sum); // total sum of all passed values
}

add(4, 5, 6);
```

Key rules:
- Rest operator (`...`) **sirf ek baar** use ho sakta hai function definition me, aur wo **sabse last parameter** hona chahiye (kyunki wo "baaki bachi hui saari values" collect karta hai).
- Rest operator use karne se function **any number of arguments** accept kar sakta hai — jitne bhi diye jaayein, extra values automatically ek array me chali jaati hain.
- Iska use un scenarios me hota hai jaha exact number of arguments **pehle se pata na ho** (jaise ek calculator jisme user 2, 5, ya 20 numbers ka sum le sakta ho).

## 5. Beginner Explanation

**Higher-Order Functions** ko socho jaise ek factory line jaha har item pe ek specific operation apply hoti hai — `map` har item ko transform karti hai, `filter` sirf matching items ko chunti hai, `reduce` sab items ko combine karke ek final result banati hai. **Hoisting** JavaScript ka ek "pehle se pata hona" jaisa behavior hai — jaise koi guest list already ban chuki ho lekin guests abhi tak aaye na hon (`var` unhe "unknown/undefined" declare kar deta hai, `let`/`const` unhe "abhi mat pucho" bol deta hai). **Rest Operator** ek "aur sab kuch yahan daal do" jaisa bag hai — jitni bhi extra cheezein aayein, sab ek array me collect ho jaati hain.

## 6. Technical Explanation

`.map()`, `.filter()`, `.reduce()` — teeno **non-mutating array methods** hain (original array ko change nahi karte, naya value/array **return** karte hain — result ko explicitly capture karna padta hai).

- `.map()` — Ek **naya array** return karta hai jiski length original array ke barabar hoti hai, har element transformed hota hai.
- `.filter()` — Ek **naya array** return karta hai jiski length **≤** original array ki length hoti hai (sirf matching elements).
- `.reduce()` — Ek **single value** return karta hai (koi bhi type ho sakta hai — number, string, object, etc.) — internally ek **accumulator pattern** follow karta hai.

**Hoisting** technically JavaScript engine ke **execution context creation phase** ka part hai (jo actual code run hone se pehle hota hai): JS engine variable aur function declarations ko scan karke memory me pehle se allocate kar deta hai.
- `var` declarations — memory allocate hoti hai **aur** `undefined` se initialize bhi ho jaati hain.
- `let`/`const` declarations — memory allocate hoti hai lekin initialize **nahi** hoti — ye state **Temporal Dead Zone (TDZ)** kehlata hai, jaha variable "exists but inaccessible" hota hai jab tak uski actual declaration line na chal jaaye.
- Function Declarations poori **body ke saath** hoisted hote hain (isliye unhe declaration se pehle call kiya ja sakta hai) — Function Expressions/Arrow Functions sirf variable ki tarah hoisted hote hain (behavior `let`/`const`/`var` jo bhi use kiya ho, uske rules follow karta hai).

**Rest Operator** ES6 (ES2015) feature hai jo function signature me **variadic parameters** (undefined/variable number of arguments) handle karna possible banata hai — internally ye ek real JavaScript **Array** create karta hai (spread/rest ke syntax `...` ka use context ke hisaab se — parameter list me "rest", array/object literal me "spread" kehlata hai — dono syntactically same dikhte hain but opposite direction me kaam karte hain).

## 7. Examples & Code

**Example 1 — map to Double Values**
```javascript
let prices = [100, 200, 300];
let discountedPrices = prices.map((price) => price * 0.9); // 10% discount
console.log(discountedPrices); // [90, 180, 270]
```

**Example 2 — filter for Values Greater Than 50**
```javascript
let scores = [45, 67, 89, 23, 90, 55];
let passing = scores.filter((score) => score >= 50);
console.log(passing); // [67, 89, 90, 55]
```

**Example 3 — reduce to Find Maximum**
```javascript
let nums = [5, 12, 8, 21, 3];
let max = nums.reduce((acc, val) => (val > acc ? val : acc));
console.log(max); // 21
```

**Example 4 — Hoisting Behavior**
```javascript
console.log(x); // undefined
var x = 10;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 20;
```

**Example 5 — Rest Operator for a Flexible Calculator**
```javascript
function multiplyAll(...numbers) {
    let product = 1;
    for (let i = 0; i < numbers.length; i++) {
        product = product * numbers[i];
    }
    return product;
}

console.log(multiplyAll(2, 3, 4));     // 24
console.log(multiplyAll(5, 5, 5, 5));  // 625
```

## 8. Line-by-Line Explanation

Using **Example 5**:
1. `function multiplyAll(...numbers) {` — Function `multiplyAll` define hua ek **single rest parameter** `numbers` ke saath — jitni bhi values pass ki jaayein, sab `numbers` array me chali jaayengi.
2. `let product = 1;` — Multiplication ke liye starting value `1` (kyunki `0` se multiply karne pe hamesha `0` milega).
3. `for (let i = 0; i < numbers.length; i++) {` — `numbers` array ke saare elements pe loop.
4. `product = product * numbers[i];` — Har iteration me current element ko `product` me multiply karte jaate hain.
5. `return product;` — Final multiplied result return hota hai.
6. `multiplyAll(2, 3, 4);` — 3 arguments diye — `numbers = [2, 3, 4]` ban gaya, result `24`.
7. `multiplyAll(5, 5, 5, 5);` — 4 arguments diye — rest operator ne easily handle kar liya without changing function definition, result `625`.

## 9. Common Mistakes

- `.map()`/`.filter()` ka result **assign na karna** aur expect karna ki original array khud update ho gaya — inhe hamesha ek variable me capture karna padta hai.
- `.reduce()` me initial value na dena jab array **empty** ho sakta hai — isse `TypeError` aa sakta hai ("Reduce of empty array with no initial value").
- `var` ko hoisting ki wajah se declaration se pehle use karna aur `undefined` ko "sahi behavior" samajh lena — production code me is confusion se bachne ke liye `let`/`const` use karna best hai.
- Rest operator (`...`) ko **multiple baar** ya **beech me** (last parameter ke alawa) use karne ki koshish karna — Syntax Error deta hai.
- Rest Operator aur Spread Operator (dono `...` syntax use karte hain) ko confuse karna — Rest **collect** karta hai (function parameters me), Spread **expand/unpack** karta hai (arrays/objects me) — inka exact opposite direction hota hai.

## 10. Best Practices

- `.map()`, `.filter()`, `.reduce()` ko traditional `for` loops ke bajaye prefer karo jab possible ho — ye zyada **declarative aur readable** hote hain.
- Chaining use karo jab multiple operations combine karni ho: `array.filter(...).map(...)`.
- `.reduce()` me **hamesha initial value do** (especially production code me) — edge cases (empty arrays) se bachne ke liye.
- `var` avoid karo — hoisting confusion se bachne ke liye `let`/`const` use karo.
- Functions jinme arguments ki count fixed na ho, unme Rest Operator use karo instead of manually handling `arguments` object (legacy approach).

## 11. Performance Tips

- `.map()`/`.filter()`/`.reduce()` internally ek loop hi hote hain — bade arrays (lakhs of elements) ke liye chaining multiple methods (`map().filter().map()`) multiple passes create karti hai; agar performance-critical ho, ek single loop me combine karna zyada efficient ho sakta hai.
- Rest Operator se banaya gaya array normal array hi hai — koi extra performance overhead nahi, lekin bahut zyada arguments (thousands) pass karna generally anti-pattern hai.

## 12. Security Notes

- `.reduce()` ya `.map()` ke callbacks me agar **user-controlled data** directly execute/evaluate ho raha ho (jaise dynamic code construction), wo injection risk create kar sakta hai — hamesha data ko as **data** treat karo, code ki tarah nahi.
- Rest Operator se accept kiye gaye dynamic-length inputs (especially agar ye kisi API request se aa rahe hon) ko hamesha **length/size limits** ke saath validate karo — resource exhaustion se bachne ke liye.

## 13. Interview Questions

1. Higher-Order Function kya hota hai?
2. `.map()` aur `.filter()` me kya difference hai?
3. `.reduce()` kaise kaam karta hai? Accumulator kya role play karta hai?
4. Hoisting kya hai? `var` aur `let`/`const` ki hoisting me kya farak hai?
5. Temporal Dead Zone kya hoti hai?
6. Rest Operator kya hai aur ye kab use hota hai?
7. Rest Operator function parameter list me kaha position hona chahiye, aur kyun?
8. `.map()` ka result agar variable me store na kiya jaaye, toh kya hoga?

## 14. Practice Questions

1. `.map()` use karke ek array ke saare numbers ko unke squares me convert karo.
2. `.filter()` use karke ek array me se saari negative numbers hata do.
3. `.reduce()` use karke ek array ke saare numbers ka product (multiplication) nikalo.
4. Ek code snippet likho jo `var` ki hoisting behavior demonstrate kare, aur ek jo `let` ki demonstrate kare.
5. Rest Operator use karke ek function banao jo koi bhi number of strings leke unhe ek single sentence me join kare.

## 15. Coding Exercises

**Exercise 1:** Data Pipeline
- Ek array of student marks banao. `.filter()` se sirf passing marks (≥40) nikalo, phir `.map()` se unpe 5% grace marks add karo, phir `.reduce()` se average nikalo.

**Exercise 2:** Hoisting Detective
- 4 alag code snippets likho (`var`/`let`/`const` combinations ke saath) jo alag-alag hoisting behaviors demonstrate karein, aur har ek ka expected output predict karo before running.

**Exercise 3:** Flexible Sum Calculator
- Rest Operator use karke ek function banao jo koi bhi number of numeric arguments leke unka sum return kare.

## 16. Mini Projects

**Mini Project: Shopping Cart Calculator**
- Ek array of product objects-jaisa data socho (abhi simple numbers array use karo: prices).
- `.filter()` se sirf products under a budget nikalo.
- `.map()` se un products pe tax (18%) add karo.
- `.reduce()` se final cart total nikalo.
- Ek separate function banao (Rest Operator ke saath) jo checkout ke time koi bhi number of coupon-discount values accept kare aur total discount calculate kare.

## 17. Summary

Is module me humne teen **Higher-Order Functions** — `.map()` (transform), `.filter()` (select), aur `.reduce()` (combine into single value) — seekhe, jo arrays ke saath kaam karne ke sabse powerful, declarative tareeke hain. **Hoisting** samjhi — `var` fully hoisted hota hai (declaration se pehle `undefined`), jabki `let`/`const` partially hoisted hote hain (Temporal Dead Zone — declaration se pehle access karne pe specific error). Aur **Rest Operator** (`...`) seekha jo functions ko flexible bana deta hai — koi bhi number of arguments ek array me collect kar leta hai.

## 18. Keywords

Higher-Order Function, map, filter, reduce, accumulator, callback function, Hoisting, Temporal Dead Zone, fully hoisted, partially hoisted, Rest Operator, variadic parameters, spread vs rest.

## 19. Tags
`#javascript` `#higher-order-functions` `#map-filter-reduce` `#hoisting` `#rest-operator` `#intermediate` `#es6`

## 20. Suggested Next Topics
- JavaScript Objects
- DOM Manipulation & Events

## 21. Related Topics
- Module 8: JavaScript Arrays & Array Methods
- Module 7: JavaScript Functions
- Spread Operator (used with Objects, future module)

---
*End of Module 9. Continuing sequentially to Module 10: JavaScript Objects in the next part.*
