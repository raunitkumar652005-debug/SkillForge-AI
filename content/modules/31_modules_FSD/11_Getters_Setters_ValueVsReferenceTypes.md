# Module 11: Getters, Setters & Value vs Reference Types

---

## 1. Overview

Is module me do important, aksar interview me poochhe jaane waale JavaScript concepts cover kiye gaye hain: **Getters aur Setters** (jo object properties ko controlled/encapsulated tarike se access aur update karne ka mechanism dete hain), aur **Value vs Reference Types** — ek foundational concept jo explain karta hai ki primitive values aur objects/arrays memory me kaise alag tarah se store/copy hote hain. Instructor ne isko ek yaadgar **"Fridge vs Refrigerator"** (Raju aur Babu Bhaiya) story se samjhaya.

## 2. Prerequisites

- Module 10 (Objects Fundamentals) completed.
- Module 7 (Functions, especially Arrow Functions) completed.
- `this` keyword ka basic exposure (yahan practically dikhaya gaya hai).

## 3. Learning Objectives

- **Getter (`get`)** method define karna, jo kisi property ki value ko **controlled tarike se return** karta hai.
- **Setter (`set`)** method define karna, jo kisi property ki value ko **controlled tarike se update** karta hai.
- `this` keyword ka role samajhna object ke andar properties refer karne ke liye.
- Getters/Setters se **property ko effectively "private" jaisa** banane ka concept (naming abstraction).
- **Value Types (Primitives)** — assign/copy karne pe **independent copies** banti hain, samajhna.
- **Reference Types (Objects/Arrays)** — assign/copy karne pe **same memory reference** share hoti hai, samajhna.
- Real-world analogy se in dono concepts ke practical implications samajhna.

## 4. Cleaned Transcript (Hinglish)

**Why Getters and Setters?**

Kabhi-kabhi hum chahte hain ki object ki kisi property ka **actual naam** users/other-developers ko na pata chale, sirf ek defined method ke through hi wo value access/update ho — isko achieve karne ke liye **Getter aur Setter methods** use hote hain.

**Defining a Getter**

```javascript
let obj = {
    accountBalance: 10000,

    get balance() {
        return this.accountBalance;
    }
};

console.log(obj.balance); // 10000
```
- `get balance() { return this.accountBalance; }` — Ek **getter method** define kiya jiska naam `balance` hai. Isse call karte waqt **parentheses () nahi lagane padte** — bilkul ek normal property ki tarah access hota hai (`obj.balance`, na ki `obj.balance()`).
- **`this` keyword** yahan crucial hai — `this.accountBalance` object ke andar wali `accountBalance` property ko refer karta hai. **Agar `this` na lagayein, property access hi nahi hogi** — undefined/error aayega.
- User ko sirf `balance` naam pata hai — actual key (`accountBalance`) internally hidden reh sakta hai (agar developer chahe toh naming abstraction maintain kare).

**Defining a Setter**

```javascript
let obj = {
    accountBalance: 10000,

    get balance() {
        return this.accountBalance;
    },

    set updateBalance(value) {
        this.accountBalance = value;
    }
};

obj.updateBalance = 50000;   // Setter is called like a property assignment, not a function call
console.log(obj.balance);    // 50000 (updated!)
```
- `set updateBalance(value) { this.accountBalance = value; }` — Ek **setter method** define kiya jo ek **single parameter** leta hai (yahan `value`).
- Setter ko call karne ka tareeka bhi special hai: **normal assignment jaisa** (`obj.updateBalance = 50000`), function-call jaisa **nahi** (`obj.updateBalance(50000)` galat hai).
- Andar, `this.accountBalance = value;` se actual property update hoti hai — bina kisi ko batae ki original key ka naam `accountBalance` hai.
- Demo me `this` hataane pe update **kaam nahi karta** — confirm karta hai ki `this` object ke andar ki properties ko refer karne ke liye mandatory hai.

**Why This Matters — Encapsulation**

Getter/Setter ka core purpose hai: **kisi property ko directly expose kiye bina, uska access/update controlled rakhna**. Real-world me, jaise bank apna internal account-balance-storage mechanism expose nahi karta — sirf ek "balance check karo" aur "balance update karo" jaisi service deta hai — Getters/Setters isi tarah ka abstraction JavaScript objects me provide karte hain.

---

**Value Types vs Reference Types**

**Story — Raju & Babu Bhaiya (Analogy)**

Do dost the — **Babu Bhaiya** aur **Raju**. Babu Bhaiya ek cold drink laaye aur usse ek **glass** me daal diya. Raju aaya aur **directly us glass se** cold drink pi liya. Baad me Babu Bhaiya ne poocha "meri cold drink kaha hai?" — Raju ne sach bataya "wo toh maine pi li" — kyunki usne **directly actual value** (glass ki drink) access ki thi. Ye **Value Type** jaisa scenario hai.

Doosri baar, Babu Bhaiya ne apni cold drink ek **fridge** me store ki, aur us fridge ko naam diya **"Fridge"**. Raju ne wahi cheez dekhi lekin usse naam diya **"Refrigerator"**. Ab Raju ne "Refrigerator" se drink nikal ke pi li. Jab Babu Bhaiya ne poocha, Raju ne kaha "maine apni Refrigerator se pi" — dono sach bol rahe the, kyunki **dono naam (Fridge, Refrigerator) ek hi actual memory-block/object ko point kar rahe the** — bas alag naam diye gaye the usi cheez ko. Isko kehte hain **Reference Type**.

**Value Type — Code Example**

```javascript
let a = 5;
let b = a; // 'b' gets a COPY of a's value

b = 10;
console.log(a); // 5 (unaffected!)
console.log(b); // 10
```
Yahan `a` aur `b` do **completely independent** values hain — `b` ko change karne se `a` pe koi impact nahi padta. Ye **Primitive/Value Types** ka behavior hai (Number, String, Boolean, etc.) — assign karte waqt **naya, independent copy** banta hai.

**Reference Type — Code Example**

```javascript
let obj = {
    drink: "1 Litre",
    snacks: "Chips"
};

let newObj = obj; // 'newObj' points to the SAME object as 'obj', NOT a copy!

newObj.drink = "500ml"; // changing newObj...

console.log(obj.drink); // "500ml" (changed too!!)
```
Yahan `newObj = obj` karne se **naya object nahi bana** — `newObj` sirf **wahi memory location** point karta hai jo `obj` point kar raha tha (jaise "Fridge" aur "Refrigerator" dono ek hi cheez the). Isliye `newObj` ke through kiya gaya change, **`obj` me bhi reflect** hota hai — kyunki dono ek hi actual data ko refer kar rahe hain. Ye **Objects/Arrays (Reference Types)** ka core, aksar-confusing behavior hai.

## 5. Beginner Explanation

**Getter/Setter** ko socho jaise ek bank ka counter — tum directly bank ke vault me nahi ja sakte, lekin counter-clerk se "mera balance batao" (getter) ya "mera balance update karo" (setter) keh sakte ho — internal vault-mechanism tumhe pata nahi hota, bas ek clean interface milta hai.

**Value vs Reference** ko socho jaise photocopy vs original document ka link share karna. Agar tum kisi ko **photocopy** (value) do, wo usme jo bhi likhega, tumhare original pe kuch nahi hoga. Lekin agar tum kisi ko apne **Google Doc ka link** (reference) do, wo usme jo bhi edit karega, wahi changes tumhe bhi dikhenge — kyunki dono ek hi actual document ko access kar rahe ho.

## 6. Technical Explanation

**Getters/Setters** JavaScript ke **accessor properties** hain (as opposed to normal **data properties**). Ye `Object.defineProperty()` ke through ya object literal me `get`/`set` keywords se define kiye ja sakte hain. Inhe call karte waqt syntax **normal property access/assignment jaisa** hi rehta hai — function call syntax nahi — ye JavaScript engine internally handle karta hai.

**Value Types (Primitives — Number, String, Boolean, Null, Undefined, Symbol, BigInt)** stack memory me **by value** store hote hain — jab assign/copy kiya jaata hai, ek **naya independent memory location** allocate hota hai jisme value ki copy rakhi jaati hai.

**Reference Types (Objects, Arrays, Functions)** heap memory me store hote hain, aur variable actually us memory location ka sirf **ek pointer/reference** hold karta hai. Jab ek reference-type variable ko doosre variable me assign kiya jaata hai, **sirf reference (memory address) copy hota hai**, actual data nahi — dono variables ab **same underlying object** ko point karte hain. Isi wajah se ek variable ke through kiya gaya mutation, doosre variable ke through bhi visible hota hai.

**Practical implication:** Agar genuinely ek **independent copy** chahiye object/array ki (original ko change hone se bachane ke liye), **explicit cloning** karni padti hai — jaise `{...obj}` (Spread Operator) ya `Object.assign({}, obj)` shallow copy ke liye, ya `JSON.parse(JSON.stringify(obj))` deep copy ke liye (future topics).

## 7. Examples & Code

**Example 1 — Getter/Setter for Temperature Conversion**
```javascript
let weather = {
    celsius: 25,

    get fahrenheit() {
        return (this.celsius * 9/5) + 32;
    },

    set fahrenheit(value) {
        this.celsius = (value - 32) * 5/9;
    }
};

console.log(weather.fahrenheit); // 77
weather.fahrenheit = 100;
console.log(weather.celsius);    // 37.77...
```

**Example 2 — Value Type Independence**
```javascript
let score1 = 90;
let score2 = score1;

score2 = 75;
console.log(score1); // 90 (unaffected)
console.log(score2); // 75
```

**Example 3 — Reference Type Shared Mutation**
```javascript
let originalCart = { items: 3, total: 1500 };
let sameCart = originalCart; // reference copied, NOT the object

sameCart.total = 2000;

console.log(originalCart.total); // 2000 (changed, because same object!)
```

**Example 4 — Avoiding Unwanted Reference Sharing (Shallow Copy)**
```javascript
let original = { drink: "Cold Drink", qty: 1 };
let copy = { ...original }; // Spread operator creates a NEW independent object

copy.qty = 5;
console.log(original.qty); // 1 (unaffected now!)
console.log(copy.qty);     // 5
```

## 8. Line-by-Line Explanation

Using **Example 1**:
1. `let weather = { celsius: 25, ... };` — Ek object banaya jisme `celsius` ek normal data property hai (starting value `25`).
2. `get fahrenheit() { return (this.celsius * 9/5) + 32; }` — Ek getter `fahrenheit` define hua, jo `this.celsius` (current celsius value) use karke Fahrenheit calculate aur return karta hai.
3. `set fahrenheit(value) { this.celsius = (value - 32) * 5/9; }` — Ek setter `fahrenheit` define hua, jo diya gaya Fahrenheit `value` leke use wapas Celsius me convert karke `this.celsius` update karta hai.
4. `console.log(weather.fahrenheit);` — Getter **bina parentheses ke** call hota hai, jaise normal property — output `77` (25°C ka Fahrenheit equivalent).
5. `weather.fahrenheit = 100;` — Setter **normal assignment ki tarah** call hota hai — `100`°F ko internally Celsius me convert karke `celsius` property update kar deta hai.
6. `console.log(weather.celsius);` — Ab updated `celsius` value print hoti hai (~`37.77`), jo `100°F` ke barabar hai.

## 9. Common Mistakes

- Getter/Setter ko function ki tarah call karne ki koshish karna (`obj.balance()`, `obj.updateBalance(50000)`) — dono **normal property syntax** se call hote hain, parentheses/arguments-jaisa call nahi.
- Getter/Setter ke andar `this` keyword bhool jaana — isse property access/update fail ho jaata hai.
- Object/Array ko `let newObj = oldObj;` se "copy" samajh lena — actually ye reference copy hai, dono ek hi memory ko point karte hain.
- Reference-type variables ke saath accidental mutation — ek variable modify karne se doosra bhi change ho jaata hai, agar shallow-copy na ki gayi ho.
- Value types ke saath ulta confusion — expect karna ki `let b = a;` ke baad `a` ko change karne se `b` bhi change hoga (nahi hota, primitives independent hote hain).

## 10. Best Practices

- Sensitive/internal object properties ko getters/setters ke through expose karo, direct property access ke bajaye — better encapsulation aur control (jaise validation add karna setter ke andar).
- Jab bhi object/array ki **genuine independent copy** chahiye ho, explicitly clone karo (`{...obj}` ya `[...arr]` Spread Operator se) — kabhi assume mat karo ki `=` copy karega.
- Function me object/array pass karte waqt yaad rakho ki function ke andar kiya gaya mutation, **caller ke original object ko bhi affect karega** (reference pass hoti hai) — agar ye unwanted hai, function ke andar copy banao.
- Getters ko sirf **derived/computed values** ke liye use karo (jaise Fahrenheit celsius se derive ho raha hai) — heavy/side-effect-waala logic getters me avoid karo.

## 11. Performance Tips

- Getters/Setters normal property access jaisi hi performance dete hain generally, lekin agar getter ke andar heavy computation ho, wo **har access pe re-calculate** hoga — agar value frequently access hoti hai aur rarely changes, caching consider karo.
- Shallow copy (`{...obj}`) bade/deeply-nested objects ke liye sirf **top-level** copy karta hai — nested objects still reference-shared rehte hain; deep copy zyada memory/processing lena chahiye tabhi jab genuinely zaroori ho.

## 12. Security Notes

- Reference-sharing ki wajah se, agar kisi **sensitive object** (jaise user session data) ko carelessly multiple jagah pass/share kiya jaaye without cloning, ek jagah ka accidental/malicious mutation **poore system me unexpectedly propagate** ho sakta hai — especially bade applications me bug/vulnerability ka source ban sakta hai.
- Setters me hamesha **input validation** add karo (jaise negative balance na set hone dena) — bina validation ke setters bhi utne hi risky hain jitni direct property assignment.

## 13. Interview Questions

1. Getter aur Setter kya hote hain, aur inhe kaise define karte hain?
2. Getter/Setter ko call karne ka syntax normal function calls se kaise different hai?
3. `this` keyword getters/setters me kyun zaroori hai?
4. Value Type aur Reference Type me kya fundamental difference hai?
5. `let b = a;` (primitive) aur `let newObj = obj;` (object) — dono statements ke behavior me kya farak hai?
6. Agar tumhe kisi object ki independent copy chahiye, tum kya karoge?
7. Reference type sharing se related ek common real-world bug example do.

## 14. Practice Questions

1. Ek object banao jisme ek getter ho jo kisi price pe automatically 18% GST add karke total return kare.
2. Ek setter banao jo age update karta ho, lekin agar negative value di jaaye toh update na kare (validation).
3. Do primitive variables banao, ek ko doosre me assign karo, dusre ko change karo, aur dikhao ki pehla unaffected raha.
4. Do objects banao (ek direct assignment se, ek spread operator se copy karke), dono me change karke unka difference dikhao.

## 15. Coding Exercises

**Exercise 1:** Bank Account Simulator
- Ek object banao jisme `_balance` (internal property) ho, ek getter `balance` jo current balance return kare, aur ek setter `deposit` jo amount add kare (validate karo ki amount positive ho).

**Exercise 2:** Reference Trap Demo
- Ek function likho jo ek object parameter leta ho aur usme ek property change karta ho — call karne ke baad dikhao ki original object bhi affect hua.

**Exercise 3:** Safe Copy Utility
- Ek object banao aur do tareekon se copy karo — ek direct assignment se (galat tareeka), ek spread operator se (sahi tareeka) — dono ke behavior ko compare karo code comments ke saath.

## 16. Mini Projects

**Mini Project: User Profile Manager with Encapsulation**
- Ek `userProfile` object banao jisme internally `_email` aur `_password` properties hon.
- Getter `email` banao jo email return kare.
- Setter `updateEmail` banao jo naya email set kare, but validate kare ki usme `"@"` symbol ho (warna update na kare aur error message print kare).
- Demonstrate karo ki `userProfile` ko kahi aur assign karne pe (bina spread operator ke) reference share hota hai, aur spread operator use karke isse kaise avoid kiya ja sakta hai.

## 17. Summary

Is module me humne **Getters aur Setters** seekhe — object properties ko controlled, encapsulated tarike se access/update karne ka mechanism, jisme `this` keyword crucial role play karta hai. Humne **Value Types vs Reference Types** ka core, aksar-confusing difference samjha — Primitives assign hone pe **independent copies** banate hain, jabki Objects/Arrays assign hone pe **same memory reference share** karte hain — ye concept future me function-parameter-passing, state-management (React), aur bug-debugging sabhi jagah crucial hoga.

## 18. Keywords

Getter, Setter, get keyword, set keyword, this keyword, Encapsulation, Value Type, Reference Type, Primitive, by value, by reference, Shallow Copy, Spread Operator, Memory Reference.

## 19. Tags
`#javascript` `#getters-setters` `#value-vs-reference` `#encapsulation` `#advanced-fundamentals` `#interview-prep`

## 20. Suggested Next Topics
- DOM Manipulation & Events
- Git & GitHub

## 21. Related Topics
- Module 10: JavaScript Objects Fundamentals
- Module 8: JavaScript Arrays (also a Reference Type)
- Spread/Rest Operators (Module 9, used here for shallow copying)

---
*End of Module 11. Continuing sequentially to Module 12: DOM Manipulation & Events in the next part.*
