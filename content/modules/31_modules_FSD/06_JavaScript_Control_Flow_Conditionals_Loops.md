# Module 6: JavaScript Control Flow — Conditionals & Loops

---

## 1. Overview

Is module me **Control Flow Statements** cover kiye gaye hain — wo statements jo decide karte hain ki program **kaise execute** hoga (kis order me, kaunse conditions me kya chalega). Do broad categories cover hui: **Conditional Statements** (`if`, `if-else`, `if-else-if` ladder, `switch`) aur **Iterative Statements/Loops** (`for`, `while`, `do-while`), saath hi `break` aur `continue` keywords.

## 2. Prerequisites

- Module 5 completed (variables, data types, `console.log`).
- Basic samajh ki comparison operators (`>`, `<`, `>=`, `<=`, `==`) values compare karte hain (detail Operators module me).

## 3. Learning Objectives

- **Normal flow of execution** (line-by-line, top-to-bottom) samajhna aur ise **control** karna seekhna.
- `if`, `if-else`, aur `if-else-if` ladder ka syntax aur use-case samajhna.
- `switch-case` statement ka syntax aur use-case samajhna, including `default` case.
- `switch` me `break` na lagane pe hone waale **fall-through** behavior ko samajhna.
- **`for` loop** — jab exact number of iterations pata ho.
- **`while` loop** — jab condition-based repetition chahiye ho, exact count pata na ho.
- **`do-while` loop** — jab code **kam se kam ek baar** zaroor chalna chahiye, condition check hone se pehle.
- `break` aur `continue` keywords ka loops ke andar use.

## 4. Cleaned Transcript (Hinglish)

**Normal Flow of Execution**

Default me JavaScript code **line-by-line, top-to-bottom** execute hota hai — isko **Normal Flow of Execution** kehte hain (kyunki JS ek interpreted language hai). Agar hume is default order ko change karna ho (jaise kisi condition ke basis pe kuch lines skip karni ho ya different order me chalani ho), tab hum **Control Flow Statements** use karte hain.

**if / else**

```javascript
let a = 5;
let b = 6;

if (a > b) {
    console.log("A is greater");
} else {
    console.log("B is greater");
}
```
Agar `a` `b` se bada hai, "A is greater" print hoga; warna `else` block run hoga aur "B is greater" print hoga. Ye humara program **execution ko control** kar raha hai — normally toh dono lines chalni chahiye thi, lekin hum decide kar rahe hain ki **sirf ek** chale.

**if-else-if Ladder**

Jab multiple conditions ek saath check karni ho (ek se zyada possible outcomes), tab **if-else-if ladder** use hota hai. Grading system example:
```javascript
let marks = 90;

if (marks >= 90) {
    console.log("Grade A");
} else if (marks >= 70) {
    console.log("Grade B");
} else if (marks >= 45) {
    console.log("Grade C");
} else {
    console.log("Grade F"); // Fail
}
```
Is ladder me sirf **ek hi block** execute hoga — jaise hi koi condition `true` mil jaati hai, uske neeche ki saari `else-if`/`else` conditions **skip** ho jaati hain (unko check hi nahi kiya jaata).

**switch-case**

Jab ek hi variable ki **specific choices/values** ke against alag-alag action lena ho, tab `switch-case` use hota hai (jaise ek menu se choice select karna):
```javascript
let fruit = "Apple";

switch (fruit) {
    case "Apple":
        console.log("₹50");
        break;
    case "Mango":
        console.log("₹80");
        break;
    case "Banana":
        console.log("₹40");
        break;
    default:
        console.log("Invalid input");
}
```
- `switch(fruit)` — jis variable ki value check karni hai.
- `case "Apple":` — agar `fruit === "Apple"`, ye block chalega.
- `break;` — **bahut important**: is keyword ke bina, JS agla case bhi (matched case ke baad) automatically check kiye bina chala deta hai — isko **fall-through** kehte hain. Instructor ne live demo kiya: `break` hataane pe "Banana" case match hone ke baad bhi `default` block **bhi** chal gaya, jo galat/unexpected behavior hai.
- `default:` — agar koi bhi case match na ho, ye block chalta hai (jaise `else` conditional statements me).

**for Loop**

Jab **exactly pata ho ki kitni baar repeat karna hai**, `for` loop use hota hai:
```javascript
for (let i = 0; i < 10; i++) {
    console.log(i);
}
```
Syntax ke 3 parts:
1. **Initializer** — `let i = 0` — loop variable ko starting value deta hai.
2. **Condition** — `i < 10` — jab tak ye `true` hai, loop chalega.
3. **Increment/Decrement** — `i++` — har iteration ke baad `i` ki value update hoti hai.

**Execution flow:** `i = 0` → condition check (`0 < 10`? haan) → print `0` → `i++` (`i = 1`) → condition check (`1 < 10`? haan) → print `1` → ... → jab `i = 10` ho jaaye, condition (`10 < 10`) **false** hoti hai, loop **stop** ho jaata hai. Isliye output `0` se `9` tak aata hai (10 exclusive).

**while Loop**

Jab **exact number of iterations pata na ho**, lekin ek **condition** pata ho jab tak repeat karna hai, `while` loop use hota hai. Real example — "25 ko 5 se kitni baar divide kar sakte hain?":
```javascript
let num = 25;
let count = 0;

while (num % 5 === 0) {
    count++;
    num = num / 5;
}

console.log(count); // 2
```
- `num % 5 === 0` — **modulus operator** (`%`) remainder nikalta hai. Agar remainder `0` hai, matlab `num`, `5` se completely divisible hai.
- Jab tak ye condition `true` rahegi, loop chalta rahega: `count` increment hota hai, aur `num` ko `5` se divide karke update kiya jaata hai.
- Trace: `num=25` → divisible by 5 → `count=1`, `num=5` → divisible by 5 → `count=2`, `num=1` → `1 % 5 !== 0` → loop **stop**. Final `count = 2`.

**do-while Loop**

Jab code **kam se kam ek baar zaroor chalna chahiye**, condition check hone se pehle bhi — tab `do-while` use hota hai (example: ek service jaha user ko **pehli baar free access** milta hai, uske baad payment check hota hai):
```javascript
let a = 5;
let b = 10;

do {
    console.log(a);
    a++;
} while (a < b);
```
- Pehle `do { }` block **ek baar zaroor chalta hai**, uske **baad** `while` condition check hoti hai.
- Demo: agar `a` ko directly `15` set kar diya jaaye (jo already `b=10` se bada hai), phir bhi `do` block **ek baar** chalega (print karega `15`) — condition sirf **uske baad** check hogi aur loop turant stop ho jaayega. Ye `while` loop se key difference hai (jaha condition **pehle** check hoti, aur agar false hoti, ek baar bhi na chalta).

**Summary Comparison:**
| Loop | Kab use karein |
|---|---|
| `for` | Jab exact number of iterations pata ho |
| `while` | Jab condition-based repetition chahiye, count pata na ho |
| `do-while` | Jab code kam se kam ek baar zaroor chalna chahiye |

**break & continue**

- **`break`** — Loop ko **turant rok** deta hai ek certain condition pe.
- **`continue`** — Us particular iteration ke **baad ke code ko skip** karke seedha **next iteration** pe chala jaata hai.

```javascript
for (let i = 5; i < 20; i++) {
    if (i === 5) {
        continue; // is iteration ka aage ka code skip, i=5 print nahi hoga
    }
    console.log(i);
}
```

## 5. Beginner Explanation

Socho tumhara program ek train hai jo default me seedhi line me chalti hai (line by line). **Control flow** us train ko instructions deta hai — "agar signal red hai toh ruk jao" (`if`), "agar ye station hai toh yahan utro" (`switch`), "10 chakkar lagao phir ruk jao" (`for` loop), "jab tak petrol khatam na ho tab tak chalte raho" (`while` loop), "pehle ek chakkar zaroor lagao, phir dekho petrol hai ya nahi" (`do-while` loop).

## 6. Technical Explanation

Control flow JavaScript ki **execution semantics** ko modify karta hai:
- **Conditional statements** (`if`/`else`/`switch`) — **branching logic** create karte hain, jisme condition ke boolean evaluation (`true`/`false`) ke basis pe sirf ek path execute hota hai.
- **`switch`** internally **strict equality (`===`)** se case values compare karta hai. `break` ki absence me JS engine agle case statements bhi sequentially execute karta rehta hai jab tak koi `break` na mile ya switch block khatam na ho jaaye — ye **fall-through** JS ka intentional design hai (kabhi-kabhi deliberately use bhi hota hai for grouped cases).
- **Loops** ek **iteration protocol** follow karte hain: initializer → condition-check → body-execution → update → condition-check (repeat) for `for`/`while`; jabki `do-while` me **body-execution pehle**, phir condition-check hota hai — is wajah se `do-while` **guaranteed at-least-once execution** deta hai.
- **`break`** loop se turant exit kar deta hai (control loop ke baad wali line pe chala jaata hai).
- **`continue`** current iteration ko turant terminate karke agli iteration ke condition-check pe chala jaata hai (loop se bahar nahi jaata).

## 7. Examples & Code

**Example 1 — Grading System (if-else-if)**
```javascript
let marks = 65;

if (marks >= 90) {
    console.log("Grade A");
} else if (marks >= 70) {
    console.log("Grade B");
} else if (marks >= 45) {
    console.log("Grade C");
} else {
    console.log("Fail");
}
// Output: Grade C
```

**Example 2 — Fruit Price switch-case**
```javascript
let fruit = "Mango";

switch (fruit) {
    case "Apple":
        console.log("₹50");
        break;
    case "Mango":
        console.log("₹80");
        break;
    case "Banana":
        console.log("₹40");
        break;
    default:
        console.log("Invalid input");
}
// Output: ₹80
```

**Example 3 — for Loop (1 to 10)**
```javascript
for (let i = 1; i <= 10; i++) {
    console.log(i);
}
// Output: 1 2 3 4 5 6 7 8 9 10
```

**Example 4 — while Loop (Divisibility Count)**
```javascript
let num = 25;
let count = 0;

while (num % 5 === 0) {
    count++;
    num = num / 5;
}
console.log(count); // Output: 2
```

**Example 5 — do-while Loop**
```javascript
let a = 5;
let b = 10;

do {
    console.log(a);
    a++;
} while (a < b);
// Output: 5 6 7 8 9
```

## 8. Line-by-Line Explanation

Using **Example 4 (while loop)**:
1. `let num = 25;` — Original number jiske factors of 5 count karne hain.
2. `let count = 0;` — Counter, kitni baar divide hua tracking karne ke liye, shuru me `0`.
3. `while (num % 5 === 0) {` — Loop tab tak chalega jab tak `num` ko `5` se divide karne pe remainder `0` aaye (matlab pura divisible hai).
4. `count++;` — Har successful division pe counter ek se badhaya.
5. `num = num / 5;` — `num` ko `5` se divide karke update kiya — is update ke bina loop **infinite** chalta rahega (kyunki condition kabhi false nahi hogi)!
6. Iteration 1: `25 % 5 = 0` (true) → `count = 1`, `num = 5`.
7. Iteration 2: `5 % 5 = 0` (true) → `count = 2`, `num = 1`.
8. Iteration 3 (check): `1 % 5 = 1` (not `0`, condition false) → loop **stops**.
9. `console.log(count);` — Final `count` value (`2`) print hoti hai — matlab `25`, `5` se do baar divide ho sakta hai (`25 → 5 → 1`).

## 9. Common Mistakes

- `switch` ke har case ke end me `break` lagana bhool jaana — isse **fall-through** ho jaata hai aur multiple/wrong cases execute ho jaate hain.
- `while` loop ke andar loop variable ko **update karna bhool jaana** — isse **infinite loop** ban jaata hai (program hang/crash ho sakta hai).
- `for` loop ki condition me `<=` ki jagah `<` (ya vice versa) confuse karna — off-by-one errors (ek extra ya ek kam iteration).
- `do-while` ko `while` loop samajh lena — dono ka fundamental difference bhool jaana ki `do-while` **hamesha kam se kam ek baar** chalta hai.
- `break` aur `continue` ko confuse karna — `break` loop **poori tarah rok deta hai**, `continue` sirf **current iteration skip** karta hai aur loop continue rehta hai.
- `if-else-if` ladder me conditions ka **order galat** rakhna (jaise pehle `marks >= 45` check karna, phir `marks >= 90`) — isse higher conditions kabhi reach hi nahi hoti.

## 10. Best Practices

- `switch` statement me **hamesha `break` lagao** har case ke end me, jab tak intentionally fall-through nahi chahiye.
- `switch` me hamesha ek `default` case rakho — unexpected values ko gracefully handle karne ke liye.
- Loops likhte waqt hamesha confirm karo ki **loop variable update ho raha hai** — infinite loops se bachne ke liye.
- Complex nested conditions ko readable rakhne ke liye **early returns** ya **guard clauses** consider karo (advanced pattern, future modules me).
- `do-while` sirf tabhi use karo jab genuinely "at least once execution" chahiye ho — warna `while` ya `for` zyada readable options hain.

## 11. Performance Tips

- Bahut lambi `if-else-if` chains (10+ conditions) ki jagah, agar sab **ek hi variable ki discrete values** check kar rahe ho, `switch` statement thoda better-organized aur (kuch JS engines me) slightly optimized hota hai.
- Loops ke andar heavy computations avoid karo agar wo loop ke bahar ek baar calculate ki ja sakti hain (loop-invariant code motion) — performance-critical code me ye difference matter karta hai.

## 12. Security Notes

- `switch` statements me user input directly case-match karte waqt hamesha `default` case handle karo — andar validate na kiya gaya input unexpected application behavior create kar sakta hai.
- Loops jo user-controlled input pe based ho (jaise "kitni baar loop chalana hai" agar user se aata ho), hamesha upper-bound validation rakho — warna **Denial of Service (DoS)**-jaisa resource exhaustion ho sakta hai (bahut bada loop count deke server ko hang karna).

## 13. Interview Questions

1. "Normal Flow of Execution" kya hai aur "Control Flow" ise kaise modify karta hai?
2. `if-else` aur `if-else-if` ladder me kya difference hai?
3. `switch` statement me `break` na lagane pe kya hota hai? Isko kya kehte hain?
4. `for`, `while`, aur `do-while` loops me kab kaunsa use karna chahiye?
5. `do-while` loop `while` loop se kaise fundamentally different hai?
6. `break` aur `continue` me kya difference hai?
7. Ek infinite loop kaise accidentally create ho sakta hai?
8. Modulus operator (`%`) kya karta hai? Ek real use-case do.

## 14. Practice Questions

1. Ek `if-else-if` ladder banao jo kisi number ko positive/negative/zero classify kare.
2. Ek `switch-case` banao jo weekday number (1-7) leke uska naam print kare, invalid input ke liye `default` case ke saath.
3. `for` loop se 1 se 100 tak saari **even numbers** print karo.
4. `while` loop se kisi number ke saare digits ka sum nikalo.
5. `do-while` loop use karke ek program banao jo user se number leta rahe jab tak wo `0` na enter kare (concept-level, actual input future modules me).

## 15. Coding Exercises

**Exercise 1:** FizzBuzz
- 1 se 50 tak loop karo — agar number 3 se divisible hai "Fizz" print karo, 5 se divisible hai "Buzz", dono se divisible hai "FizzBuzz", warna number khud print karo.

**Exercise 2:** Factor Counter
- `while` loop use karke koi bhi number `n` aur divisor `d` leke count karo ki `n` ko `d` se kitni baar divide kiya ja sakta hai (jaisa transcript example me tha).

**Exercise 3:** Grade Calculator
- `if-else-if` ladder se ek grading system banao (A/B/C/D/F) jisme kam se kam 4 grade boundaries ho.

**Exercise 4:** Skip & Stop
- `for` loop (1-20) me `continue` use karke saare multiples of 3 skip karo, aur `break` use karke jaise hi number `15` aaye loop stop kar do.

## 16. Mini Projects

**Mini Project: Simple Menu-Based Calculator (Console)**
- `switch-case` use karke ek menu banao: "1. Add, 2. Subtract, 3. Multiply, 4. Divide".
- Do fixed numbers define karo (`let a = 10, b = 5`).
- User ke choice (variable se simulate karo, e.g. `let choice = 1`) ke basis pe `switch` se appropriate operation perform karo aur result print karo.
- Ek `default` case rakho jo "Invalid choice" print kare.

## 17. Summary

Is module me humne **Control Flow** seekha — kaise program ki **default line-by-line execution** ko conditions aur loops se control kiya ja sakta hai. **Conditional statements** (`if`, `if-else`, `if-else-if`, `switch`) se decisions liye, aur **loops** (`for`, `while`, `do-while`) se repetition handle ki. Har loop ka apna specific use-case hai: `for` jab count pata ho, `while` jab condition-based ho, `do-while` jab kam se kam ek execution guaranteed chahiye. `break` aur `continue` se loop flow ko further fine-tune kiya ja sakta hai.

## 18. Keywords

Control Flow, Normal Flow of Execution, if, else, else-if, if-else-if ladder, switch, case, default, break, continue, fall-through, for loop, while loop, do-while loop, initializer, condition, increment, modulus operator, infinite loop.

## 19. Tags
`#javascript` `#control-flow` `#conditionals` `#loops` `#for-loop` `#while-loop` `#switch-case` `#beginner`

## 20. Suggested Next Topics
- JavaScript Operators (Arithmetic, Comparison, Logical, Assignment)
- JavaScript Functions

## 21. Related Topics
- Module 5: JavaScript Fundamentals (Variables, Data Types)
- JavaScript Functions (loops/conditionals used inside functions extensively)
- JavaScript Arrays (loops commonly used to iterate arrays)

---
*End of Module 6. Continuing sequentially to Module 7: JavaScript Operators & Functions in the next part.*
