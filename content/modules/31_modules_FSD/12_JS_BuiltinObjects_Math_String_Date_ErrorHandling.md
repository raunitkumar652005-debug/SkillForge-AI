# Module 12: JavaScript Built-in Objects & Methods — Math, String, Date & Error Handling

---

## 1. Overview

Is module me JavaScript ke **Built-in Objects aur Methods** cover kiye gaye — pehle se defined utilities jo common tasks (mathematical calculations, string manipulation, date/time handling, aur runtime errors handle karna) ko aasan banate hain. Char major areas cover hui: **Math object** (max, min, round, ceil, floor, trunc, PI, abs, pow), **String methods** (charAt, slice, substring, case conversion, includes, indexOf), **Date object** (current date/time, custom dates, get/set methods), aur **Error Handling** (`try-catch-finally`, custom errors via `throw`).

## 2. Prerequisites

- Module 5-11 completed (variables, functions, arrays, objects, spread operator).

## 3. Learning Objectives

- **Built-in Objects/Methods** ka concept samajhna — JavaScript me already-defined utilities.
- **Math object** ke common methods use karna: `Math.max()`, `Math.min()`, `Math.round()`, `Math.ceil()`, `Math.floor()`, `Math.trunc()`, `Math.PI`, `Math.abs()`, `Math.pow()`.
- Array ke saath Math methods use karne ke liye **Spread Operator** ka role samajhna.
- **String methods** use karna: `charAt()`, `slice()`, `substring()`, `toLowerCase()`/`toUpperCase()`, `includes()`, `indexOf()`, `startsWith()`/`endsWith()`.
- **Date object** create karna aur `getFullYear()`, `getMonth()`, `getDate()`, `getHours()` jaise methods use karna.
- **Exception/Error Handling** — `try`, `catch`, `finally` blocks ka use, aur `throw new Error()` se custom errors banane.

## 4. Cleaned Transcript (Hinglish)

**What are Built-in Objects & Methods?**

Kuch objects/methods JavaScript me **already defined** hote hain — inhe "Built-in" kehte hain. Example: agar tumse 2 numbers me se bada number nikalne ko kaha jaaye, `if-else` likha ja sakta hai, lekin agar 10-20 numbers ho, ye approach impractical ho jaata hai. Isliye **Math object** ke built-in functions use hote hain.

**Math Object Methods**

```javascript
console.log(Math.max(4, 10, 7, 20, 3)); // 20 - largest of given numbers
console.log(Math.min(4, 10, 7, 20, 3)); // 3 - smallest of given numbers
```
- `Math.max()`/`Math.min()` **directly array pe kaam nahi karte** — comparison ke liye individual elements chahiye hote hain. Agar array hai, **Spread Operator (`...`)** use karke elements ko "unpack" karna padta hai:
```javascript
let arr = [4, 10, 7, 20, 3];
console.log(Math.min(...arr)); // 3 (spread operator se array ke elements individually pass hue)
```
(Bina spread operator ke, `Math.min(arr)` result `NaN` — Not a Number — deta hai.)

**Rounding Methods**
```javascript
let num = 12.56789;

console.log(Math.round(num)); // 13  - Standard rounding rule (≥.5 rounds up)
console.log(Math.ceil(num));  // 13  - Nearest LARGEST integer (rounds up, regardless of decimal)
console.log(Math.floor(num)); // 12  - Nearest SMALLEST integer (rounds down, regardless of decimal)
console.log(Math.trunc(num)); // 12  - Simply removes the decimal part, no rounding rule applied
```
- **`Math.round()`** — Standard mathematical rounding rule follow karta hai: `12.5` → `13` (kyunki `.5` aur usse upar wala part round up hota hai).
- **`Math.ceil()`** ("ceiling" — chhat) — Hamesha **nearest largest integer** deta hai, chahe decimal `.1` ho ya `.9` — `12.1` bhi `13` ban jaayega.
- **`Math.floor()`** ("floor" — zameen) — Hamesha **nearest smallest integer** deta hai — `12.1`, `12.5`, `12.8` sab `12` ban jaate hain.
- **`Math.trunc()`** — Sirf decimal part **hata deta hai**, koi rounding rule nahi lagata — `12.9` bhi `12` ban jaata hai (jaise floor), lekin negative numbers ke case me trunc aur floor ka behavior different hota hai (trunc hamesha zero ki taraf move karta hai).

**Other Math Properties/Methods**
```javascript
console.log(Math.PI);        // 3.14159... (mathematical constant)
console.log(Math.abs(-4));   // 4 (converts negative to positive — Absolute Value)
console.log(Math.pow(5, 2)); // 25 (5 raised to the power of 2)
```
Instructor ne mention kiya ki Math me trigonometric functions (`sin`, `cos`, etc.) bhi available hain — detail MDN Docs se explore karne ki advice di gayi.

**String Methods**

```javascript
let name = "Hariom";

console.log(name.charAt(0));       // "H" - character at given index (0-based, like arrays)
```

**Extracting Parts of a String — slice() vs substring() vs substr()**
```javascript
let subName = name.slice(0, 3);      // "Har" - start index 0, end index 3 (EXCLUDED)
console.log(subName);

console.log(name.slice(-3, -1));     // Negative indexing supported! Counts from the end.

let str1 = name.substring(0, 4);     // "Hari" - similar to slice, but NO negative indexing support
console.log(str1);

let str2 = name.substr(0, 4);        // ⚠️ DEPRECATED - takes (start, length) instead of (start, end)
```
- **`slice(start, end)`** — `end` index **excluded** hai; **negative indexing supported hai** (end se count karta hai).
- **`substring(start, end)`** — Same behavior jaisa slice, lekin **negative indexing support nahi karta**.
- **`substr(start, length)`** — **Deprecated** (future me remove ho jaayega) — use avoid karo, lekin abhi bhi kaam karta hai; ye `length` leta hai, `end index` nahi.
- Koi bhi ye methods **original string ko modify nahi karte** — hamesha ek **naya string return** karte hain (strings **immutable** hote hain JavaScript me).

**Case Conversion**
```javascript
console.log(name.toLowerCase()); // "hariom"
console.log(name.toUpperCase()); // "HARIOM"
```

**Checking/Searching Methods**
```javascript
console.log(name.endsWith("m"));    // true - checks if string ends with given substring
console.log(name.startsWith("Ha")); // true - checks if string starts with given substring
console.log(name.includes("ri"));   // true - checks if substring exists anywhere in the string
console.log(name.indexOf("o"));     // 4 - returns the FIRST index where substring is found
console.log(name.lastIndexOf("o")); // returns the LAST index where substring is found
```

Instructor ne recommend kiya ki `concat()` (do strings ko jodna) jaise aur bhi bahut saare string methods hain — sabko MDN Docs pe explore karna chahiye.

**Date Object**

```javascript
let date = new Date();  // 'new' keyword mandatory to create a Date object
console.log(date);      // prints the current date and time
```
Current date/time **device ki system settings** pe depend karti hai. Default format thoda unusual dikhta hai — usko cleaner banane ke liye:
```javascript
console.log(date.toISOString()); // converts to a standard ISO format string
```

**Current Timestamp**
```javascript
console.log(Date.now()); // milliseconds elapsed since Jan 1, 1970 (Unix Epoch) - NOT using 'new'
```
**Important:** `Date.now()` ek **static method** hai — `new` keyword ke **bina** call hota hai, `new Date()` (instance creation) se different hai.

**Custom Dates**
```javascript
let customDate = new Date(2025, 6, 30); // Year, Month (0-indexed!), Day
console.log(customDate.toUTCString());
```
**Critical rule:** **Month hamesha 0-indexed hota hai** — `0` = January, `11` = December (`12` invalid hai). Isliye `6` yahan **July** represent karta hai (0=Jan, 1=Feb, ... 6=Jul).

**Get/Set Methods on Date**
```javascript
console.log(customDate.getFullYear()); // 2025
console.log(customDate.getMonth());    // 6 (July, but 0-indexed representation)
console.log(customDate.getDate());     // 30 (day of the month)
console.log(customDate.getHours());    // hours (0 if not set explicitly)

customDate.setFullYear(2026);          // updates the year
console.log(customDate.getFullYear()); // 2026
```
Similarly `setMonth()`, `setDate()`, `getMinutes()`, `getSeconds()`, `getMilliseconds()` bhi available hain — pattern same hai (get for reading, set for updating).

**Exception/Error Handling — try, catch, finally**

Kabhi-kabhi code **syntactically correct** hota hai lekin runtime pe kuch problematic ho sakta hai (jaise division by zero) — isko **Exception** kehte hain. Inhe handle karne ke liye **try-catch** use hota hai:

```javascript
let a = 0;
let b = 5;

try {
    console.log(a / b); // technically not an error in JS (returns 0), but conceptually problematic
} catch (error) {
    console.log("Error occurred:", error);
}
```

**Custom Error Throwing**
Agar tum khud decide karna chahte ho ki ek specific condition "error" mananі chahiye:
```javascript
try {
    if (a === 0 || b === 0) {
        throw new Error("Can't use zero and divide!"); // manually trigger an error
    }
    console.log(a / b);
} catch (error) {
    console.log(error.message); // "Can't use zero and divide!"
}
```
- **`throw new Error("message")`** — Manually ek error create aur trigger karta hai, jo turant `catch` block me pakड़ liya jaata hai.

**Why try-catch Matters — Preventing Crashes**

Bina try-catch ke, agar program me kahi bhi error aati hai, **poora program crash ho jaata hai** aur uske baad ka code **execute hi nahi hota**:
```javascript
console.log("Hi");
JSON.parse("{ name: Karan, address Bangalore }"); // Invalid JSON syntax -> throws an error
console.log("This will NEVER print"); // program crashes before reaching here
```
Agar yahi problematic code **try block ke andar** ho, error `catch` me handle ho jaata hai aur **baaki ka program chalta rehta hai** (crash nahi hota):
```javascript
try {
    JSON.parse("{ name: Karan, address Bangalore }"); // invalid JSON
} catch (error) {
    console.log("Handled:", error.message);
}
console.log("Hi, I'm Finally!"); // this WILL print now, program didn't crash
```

**`finally` Block**

`finally` block ka code **hamesha chalta hai** — chahe error aayi ho (`try` fail hua ho) ya na aayi ho (`try` successful raha ho):
```javascript
try {
    console.log(a / b);
} catch (error) {
    console.log("Error:", error.message);
} finally {
    console.log("This always runs, error or no error!");
}
```

Instructor ne note kiya ki ye topics (try-catch, exception handling) **abhi fundamental overview** ke tor pe cover kiye gaye hain — inki full depth aur real importance **React aur Node.js** (backend/advanced frontend) padhte waqt samajh aayegi, jab **Promises, Async/Await, aur API calls** ke saath inka heavy use hoga.

## 5. Beginner Explanation

**Math object** ek calculator jaisa hai jisme pehle se bahut saare buttons (functions) bane hue hain — max nikalna ho, min nikalna ho, round karna ho — bas sahi button dabao. **String methods** ek text-editor ki tarah hain — text ka koi part copy karna ho, uppercase/lowercase karna ho, koi word search karna ho — sab ready-made tools available hain. **Date object** ek calendar+clock hai jisse tum current date/time nikaal sakte ho ya khud ki date bana sakte ho. **try-catch** ek safety net jaisa hai — agar niche gir bhi jao (error aaye), safety net (`catch`) tumhe pakad leta hai, poora ghar (program) girta nahi.

## 6. Technical Explanation

**Math** JavaScript ka ek **built-in global object** hai (constructor nahi hai — kabhi `new Math()` nahi likhte) — iske saare methods **static** hain, directly `Math.methodName()` se call hote hain.

**Strings** JavaScript me **immutable primitives** hain — koi bhi string method (`slice`, `toUpperCase`, etc.) original string ko **kabhi modify nahi karta**, hamesha ek **naya string value return** karta hai.

**Date** ek **constructor function** hai — instance banane ke liye `new Date()` mandatory hai, lekin `Date.now()` jaisa **static method** `new` ke bina call hota hai (class-level utility, instance-level nahi).

**try-catch-finally** JavaScript ka **structured exception handling mechanism** hai:
- `try` block — potentially error-prone code yahan likha jaata hai.
- `catch (error)` — agar `try` block me koi **runtime exception** throw hoti hai, control turant `catch` block me chala jaata hai; `error` object me `.message` aur `.stack` jaisi properties hoti hain.
- `finally` — **hamesha execute hota hai**, `try` succeed kare ya `catch` trigger ho — cleanup code (jaise database connection close karna, loading spinner hataana) ke liye ideal jagah hai.
- `throw` — koi bhi custom value (aksar `Error` object) ko manually as an exception raise karne ke liye use hota hai.

## 7. Examples & Code

**Example 1 — Math Methods with an Array**
```javascript
let temperatures = [22, 28, 19, 31, 25];
console.log("Highest:", Math.max(...temperatures)); // 31
console.log("Lowest:", Math.min(...temperatures));   // 19
```

**Example 2 — Rounding Comparison**
```javascript
let value = 7.4;
console.log(Math.round(value)); // 7
console.log(Math.ceil(value));  // 8
console.log(Math.floor(value)); // 7
console.log(Math.trunc(value)); // 7
```

**Example 3 — String Manipulation**
```javascript
let email = "user@example.com";
console.log(email.includes("@"));       // true
console.log(email.indexOf("@"));        // 4
console.log(email.slice(0, email.indexOf("@"))); // "user"
```

**Example 4 — Custom Error with try-catch-finally**
```javascript
function withdraw(balance, amount) {
    try {
        if (amount > balance) {
            throw new Error("Insufficient balance!");
        }
        console.log(`Withdrawal successful. Remaining: ${balance - amount}`);
    } catch (error) {
        console.log("Transaction failed:", error.message);
    } finally {
        console.log("Transaction attempt complete.");
    }
}

withdraw(1000, 1500);
// Transaction failed: Insufficient balance!
// Transaction attempt complete.
```

## 8. Line-by-Line Explanation

Using **Example 4**:
1. `function withdraw(balance, amount) {` — Function do parameters leta hai: current `balance`, aur withdrawal `amount`.
2. `try {` — Potentially problematic logic (jaha error throw ho sakti hai) is block ke andar likha.
3. `if (amount > balance) { throw new Error("Insufficient balance!"); }` — Agar amount, balance se zyada hai, ek **custom Error manually throw** ki gayi.
4. `console.log(...)` (success case) — Agar koi error throw nahi hui, ye line normally execute hogi.
5. `} catch (error) {` — Agar `try` block me kahi bhi error throw hui, control yahan aa jaata hai; `error` object catch ho jaata hai.
6. `console.log("Transaction failed:", error.message);` — `error.message` se humne custom error ka text nikaala aur print kiya.
7. `} finally { console.log("Transaction attempt complete."); }` — Ye line **hamesha** chalegi, chahe error aayi ho ya na aayi ho.
8. `withdraw(1000, 1500);` — `amount (1500) > balance (1000)` hai, isliye error throw hui, `catch` execute hua, phir `finally` bhi execute hua.

## 9. Common Mistakes

- `Math.max()`/`Math.min()` ko directly array pe call karna (bina spread operator ke) — `NaN` milega.
- `Math.floor()` aur `Math.trunc()` ko same samajh lena — positive numbers ke liye same result dete hain, lekin negative numbers ke liye different (`Math.floor(-4.5)` = `-5`, `Math.trunc(-4.5)` = `-4`).
- Date object me **month ko 1-indexed** samajh lena — hamesha yaad rakho `0` = January.
- `Date.now()` ke saath galti se `new` keyword lagana — ye ek static method hai, constructor nahi.
- `substr()` (deprecated) ko production code me use karna — `slice()` ya `substring()` prefer karo.
- `try-catch` ke bina risky code likhna (jaise `JSON.parse()` untrusted data pe) — ek single error se **poora program crash** ho sakta hai.
- `finally` block ko "sirf error ke time chalega" samajh lena — actually ye **hamesha** chalta hai.

## 10. Best Practices

- Array se max/min nikalne ke liye hamesha **Spread Operator** use karo Math methods ke saath.
- Rounding ki zaroorat ke hisaab se sahi method choose karo — `round` (standard), `ceil` (always up), `floor` (always down), `trunc` (just remove decimal).
- Deprecated methods (`substr`) avoid karo, `slice`/`substring` use karo.
- Date manipulation me hamesha **month 0-indexed hai** ye yaad rakho — off-by-one bugs se bachne ke liye.
- Koi bhi code jo **fail ho sakta hai** (external data parsing, network calls, user input processing) hamesha `try-catch` me wrap karo.
- `finally` block ka use **cleanup logic** ke liye karo (resources release karna), business logic ke liye nahi.

## 11. Performance Tips

- Math/String/Date methods native, highly-optimized browser/engine implementations hote hain — inhe manually reimplement karna (custom loops se) generally slower hota hai.
- `try-catch` blocks modern JS engines me almost zero overhead rakhte hain jab tak error actually throw nahi hoti — lekin bahut tight loops ke andar excessive try-catch avoid karna chahiye agar performance-critical code hai.

## 12. Security Notes

- `JSON.parse()` untrusted/external input pe **hamesha try-catch me wrap** karo — malformed ya malicious JSON crash ka source ban sakta hai.
- Error messages ko end-users ko directly expose karte waqt savdhaan raho — kabhi-kabhi internal error details (stack traces, DB info) accidentally leak ho sakte hain; production me generic user-facing messages aur detailed logs ko alag rakho.

## 13. Interview Questions

1. `Math.ceil()`, `Math.floor()`, `Math.round()`, `Math.trunc()` — chaaron me kya difference hai?
2. Array se maximum/minimum value nikalne ke liye Math methods ke saath kya zaroori hai?
3. `slice()` aur `substring()` me kya difference hai?
4. Kyun `substr()` avoid karna chahiye?
5. Date object me month kaise index hota hai?
6. `Date.now()` aur `new Date()` me kya difference hai?
7. `try`, `catch`, aur `finally` blocks ka kya-kya role hai?
8. `throw new Error()` kya karta hai?
9. Bina try-catch ke agar program me error aaye toh kya hota hai?

## 14. Practice Questions

1. Ek array of numbers leke uska max, min, aur average nikalo.
2. `12.49` number pe `round`, `ceil`, `floor`, aur `trunc` — chaaron apply karke result compare karo.
3. Apni birthdate ko `new Date()` se custom date object banao, aur `getFullYear()`, `getMonth()`, `getDate()` se values nikalo.
4. Ek function banao jo `try-catch` use karke division perform kare, aur zero se divide hone pe custom error throw kare.

## 15. Coding Exercises

**Exercise 1:** String Toolkit
- Ek email string leke, `@` se pehle ka username part `slice()`/`indexOf()` se extract karo.

**Exercise 2:** Date Formatter
- `new Date()` se current date object banao aur `getDate()`, `getMonth()` (add +1 for display), `getFullYear()` combine karke ek readable "DD/MM/YYYY" format string banao.

**Exercise 3:** Safe JSON Parser
- Ek function banao jo `try-catch` use karke kisi bhi JSON string ko parse kare — agar invalid ho, "Invalid JSON provided" jaisa friendly message return kare crash hone ke bajaye.

## 16. Mini Projects

**Mini Project: Simple Age Calculator with Error Handling**
- User se (simulate karo, e.g. `let birthYear = 1998`) birth year lo.
- Current year `new Date().getFullYear()` se nikalo.
- Age calculate karo.
- `try-catch` use karke validate karo ki birth year current year se bada na ho (agar bada ho, `throw new Error("Invalid birth year!")`).
- `finally` block me "Calculation attempt complete" print karo.

## 17. Summary

Is module me humne JavaScript ke **Built-in Objects/Methods** explore kiye — **Math object** (max, min, round, ceil, floor, trunc, PI, abs, pow) mathematical operations ke liye, **String methods** (charAt, slice, substring, case conversion, includes, indexOf) text manipulation ke liye, **Date object** date/time handling ke liye (with the crucial 0-indexed month rule), aur **Exception Handling** (`try-catch-finally`, `throw new Error()`) runtime errors ko gracefully handle karke program crashes se bachne ke liye. Instructor ne note kiya ki ye vanilla-JS overview complete ho gaya hai — ab agla step hai HTML/CSS/JS teeno ko combine karke **DOM Manipulation** seekhna.

## 18. Keywords

Built-in Objects, Math object, Math.max, Math.min, Math.round, Math.ceil, Math.floor, Math.trunc, Math.PI, Math.abs, Math.pow, String methods, charAt, slice, substring, substr, toLowerCase, toUpperCase, includes, indexOf, startsWith, endsWith, Date object, getFullYear, getMonth, Date.now, Exception Handling, try, catch, finally, throw, Error object.

## 19. Tags
`#javascript` `#math-object` `#string-methods` `#date-object` `#error-handling` `#try-catch` `#built-in-methods`

## 20. Suggested Next Topics
- DOM Manipulation & Selectors
- DOM Events & Event Handling

## 21. Related Topics
- Module 8: JavaScript Arrays (Spread Operator used with Math methods)
- Module 9: Higher-Order Functions (Rest/Spread Operator recap)
- Promises & Async/Await (mentioned as future backend/React topics)

---
*End of Module 12. Continuing sequentially to Module 13: DOM Manipulation — Selectors & Content Changes in the next part.*
