# Module 18: Conditional Rendering in React

---

## 1. Overview

Is module me **Conditional Rendering** cover kiya gaya — ek core React pattern jisse condition ke basis pe decide kiya jaata hai ki **kaunsa component/content screen pe dikhega, kaunsa nahi**. Ek real-world scenario (Login check, Age-based access) use karke instructor ne **teen tareeke** dikhaye conditional rendering achieve karne ke: **if-else statement**, **Ternary Operator**, aur **Logical AND (`&&`) Operator**.

## 2. Prerequisites

- Module 17 (JSX, Components, Props, Destructuring) completed.
- Module 6 (if-else, Ternary Operator basics) completed.

## 3. Learning Objectives

- **Conditional Rendering** ka concept samajhna — condition ke basis pe UI ka kaunsa part dikhana hai, decide karna.
- **Method 1: if-else** — component ke andar poore alag `return` statements se conditional rendering karna.
- **Method 2: Ternary Operator** — ek single-line, JSX-embeddable conditional expression likhna.
- **Method 3: Logical AND (`&&`) Operator** — jab sirf "condition true hone par kuch dikhana hai" (koi `else` case nahi), tab short-circuit rendering karna.
- Ek component **sirf ek hi value return** kar sakta hai — is rule ko samajhna.

## 4. Cleaned Transcript (Hinglish)

**What is Conditional Rendering?**

**Conditional Rendering** ka matlab hai — conditions ke basis pe main decide kar sakta hoon ki **kaunsa component dikhega, kaunsa nahi dikhega**. Real-world example: agar koi user **login** hai, tab **Home page** dikhana chahiye; agar login nahi hai, tab **Login window** dikhani chahiye.

**Method 1 — if-else Statement**

```jsx
function Hero(props) {
  if (props.login === true) {
    return (
      <>
        <h1>Welcome Home!</h1>
      </>
    );
  } else {
    return (
      <>
        <h2>Login Please to Continue</h2>
      </>
    );
  }
}
```
```jsx
// App.js
let login = false;
<Hero login={login} />
```
- `props.login` — `App.js` se ek boolean prop pass ki gayi hai.
- Agar `login === true`, ek content return hota hai; agar `false`, doosra content return hota hai.
- **Important rule:** Ek component **sirf ek hi value return kar sakta hai** — kabhi bhi ek function se multiple `return` statements ek saath nahi chalenge (jo bhi condition match hui, sirf wahi `return` execute hoga aur function turant khatam ho jaayega) — agar tum aisa likhne ki koshish karo ki multiple returns "ek saath" chalein, ye galat samajh hai aur error ka source ban sakta hai.

**Method 2 — Ternary Operator**

```jsx
function Hero(props) {
  return (
    <>
      {props.age >= 18 ? (
        <p>Login Please to Continue</p>
      ) : (
        <p>You Can't Access the Page Because Your Age is Less Than 18</p>
      )}
    </>
  );
}
```
- Syntax: `condition ? (agar true) : (agar false)`.
- Ye poori expression **JSX ke andar curly braces `{}` me directly likhi ja sakti hai** — bina alag `if-else` blocks/returns ke — isliye ye zyada **compact aur commonly used** approach hai React me.
- Instructor ne demo kiya: `props.age` ki value change karke (18 se upar/neeche), dikhaya ki kaise message dynamically switch hota hai.

**Method 3 — Logical AND (`&&`) Operator**

Jab sirf ek condition ke true hone par **kuch dikhana ho** (aur agar false ho toh **kuch bhi na dikhe**, koi alternate content na ho), tab **Logical AND (`&&`)** sabse simple approach hai:

```jsx
function Hero(props) {
  return (
    <>
      {props.welcome && <h1>Welcome to Hero Page</h1>}
    </>
  );
}
```
```jsx
// App.js
<Hero welcome={true} />
```
- `condition && <JSX>` — **`&&` operator ka core behavior**: jab dono sides "true-ish" (truthy) hon tabhi poori expression true/successful hoti hai — agar `condition` `true` hai, JavaScript **doosri side** (`<h1>...</h1>`) ko evaluate/render karega. Agar `condition` `false` hai, JavaScript turant `false` return kar deta hai aur **doosri side ko evaluate hi nahi karta** (ye **short-circuit evaluation** kehlata hai) — matlab kuch bhi render nahi hoga.
- Ye Custom Button module (Module 17) me bhi already use ho chuka tha (`props.title || "Submit"` jaisi hi family ka logical-operator pattern, lekin `||` ki jagah `&&` yahan).
- Agar `welcome` prop `false` diya jaaye, koi heading render nahi hoga — component "empty" render hoga us jagah.

**Summary — Three Approaches Compared**

| Method | Best For | Syntax Style |
|---|---|---|
| **if-else** | Complex logic, poore alag JSX blocks | Separate `return` statements |
| **Ternary (`? :`)** | Simple "either A or B" cases | Inline, JSX-embeddable |
| **Logical AND (`&&`)** | "Show something only if true" (no alternative) | Inline, shortest |

Instructor ne recommend kiya ki **React ki official documentation** best resource hai deeper learning ke liye.

## 5. Beginner Explanation

Conditional Rendering ek "bouncer at a club" jaisa hai — agar tumhari age 18+ hai (condition true), tumhe **andar jaane diya** jaata hai (ek content dikhta hai); agar nahi hai, tumhe **bahar rok diya** jaata hai (doosra content dikhta hai, jaise "Sorry, you can't enter"). Kabhi-kabhi bouncer sirf ek hi cheez check karta hai — "agar VIP pass hai, ek special banner dikhao" — agar pass nahi hai, kuch bhi extra nahi dikhega (ye `&&` operator jaisa hai).

## 6. Technical Explanation

React me **JSX ke andar** normal `if-else` statements **directly nahi likhe ja sakte** (kyunki JSX expressions hain, statements nahi) — isliye JavaScript ke **expression-based constructs** use karne padte hain:
- **Ternary Operator (`condition ? expr1 : expr2`)** — Ek **expression** hai (value return karta hai), isliye JSX curly braces ke andar directly fit ho jaata hai.
- **Logical AND (`condition && expr`)** — JavaScript me `&&` operator **short-circuit evaluation** follow karta hai: agar left operand **falsy** hai, poori expression turant us falsy value ko return kar deti hai bina right operand ko evaluate kiye. React is falsy value (`false`, `null`, `undefined`) ko **kuch bhi render nahi karta** — isliye ye pattern "conditionally show, otherwise show nothing" ke liye perfect fit hai.
- **if-else (poore blocks ke saath)** — Ye sirf **component function ke top-level** (return statement se pehle) ya **poore alag return statements** ke through use ho sakta hai, JSX ke andar directly nahi — kyunki `if-else` khud ek **statement** hai, expression nahi.

**Ek Component sirf ek hi value return kar sakta hai** — ye JavaScript function ki fundamental nature se aata hai: jaise hi ek `return` statement execute hota hai, function turant terminate ho jaata hai aur baaki code (agle koi bhi `return` statements) skip ho jaate hain.

## 7. Examples & Code

**Example 1 — if-else for Login Status**
```jsx
function Dashboard({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please log in</h1>;
  }
}
```

**Example 2 — Ternary for Age-Based Message**
```jsx
function AccessMessage({ age }) {
  return (
    <div>
      {age >= 18 ? <p>Access Granted</p> : <p>Access Denied — Under 18</p>}
    </div>
  );
}
```

**Example 3 — Logical AND for Optional Banner**
```jsx
function Notification({ hasNewMessage }) {
  return (
    <div>
      {hasNewMessage && <span className="badge">New Message!</span>}
      <p>Inbox</p>
    </div>
  );
}
```

**Example 4 — Combining Multiple Conditions**
```jsx
function UserGreeting({ isLoggedIn, isPremium }) {
  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2>Welcome!</h2>
          {isPremium && <p>Thanks for being a Premium member!</p>}
        </>
      ) : (
        <h2>Please log in to continue</h2>
      )}
    </div>
  );
}
```

## 8. Line-by-Line Explanation

Using **Example 4**:
1. `function UserGreeting({ isLoggedIn, isPremium }) {` — Component do boolean props leta hai, destructured.
2. `{isLoggedIn ? ( ... ) : ( ... )}` — Ternary operator — agar `isLoggedIn` true hai, pehla JSX block render hoga; agar false, `<h2>Please log in to continue</h2>` render hoga.
3. `<h2>Welcome!</h2>` — Ye **hamesha** dikhega jab `isLoggedIn` true ho.
4. `{isPremium && <p>Thanks for being a Premium member!</p>}` — **Nested conditional** — ye sirf tabhi dikhega jab `isPremium` bhi `true` ho (**aur** wo sirf tabhi evaluate hoga jab pehle `isLoggedIn` already true nikal chuka ho, kyunki ye ternary ke `true`-branch ke andar hai).
5. Agar `isLoggedIn` false hai, `isPremium` check hoga hi nahi — sirf "Please log in to continue" dikhega.

## 9. Common Mistakes

- Ek component se **multiple `return` statements ek saath chalane** ki galat expectation rakhna — sirf **ek** `return` kabhi bhi actually execute hota hai (jo pehla condition match kare).
- JSX ke **andar** directly `if-else` statement likhne ki koshish karna (jaise `{if (x) {...}}`) — ye **Syntax Error** deta hai, kyunki JSX ke curly braces sirf **expressions** accept karte hain, statements nahi.
- `&&` operator ka use karte waqt left-side condition ko **non-boolean falsy value** (jaise `0`) rakhna — agar `count && <p>Items: {count}</p>` likha jaaye aur `count` `0` ho, React screen pe literally **`0` render kar dega** (kyunki `0` khud ek falsy-lekin-renderable value hai) — is edge case ko samajhna zaroori hai.
- Ternary operator ko bahut zyada **nest** kar dena (ternary ke andar ternary) — readability bahut kharab ho jaati hai; complex logic ke liye `if-else` ya separate functions better hote hain.

## 10. Best Practices

- Simple "either/or" cases ke liye **Ternary Operator** use karo — sabse readable JSX-embeddable option.
- "Show only if true, nothing otherwise" cases ke liye **Logical AND (`&&`)** use karo — sabse concise.
- Complex, multi-branch logic ke liye **if-else** (component ke top ya separate helper function me) use karo — readability better rehti hai.
- `&&` operator ke saath **hamesha ensure karo ki left-side ek proper boolean ho** (jaise `count > 0 && <p>...</p>`, na ki sirf `count && <p>...</p>`) — accidental `0` rendering se bachne ke liye.
- Bahut zyada nested conditional rendering se bachne ke liye, complex UI logic ko **separate helper components** me todo.

## 11. Performance Tips

- Conditional rendering khud koi significant performance overhead nahi rakhta — React sirf jo actually render hota hai, uske liye hi DOM operations karta hai (Virtual DOM diffing ki wajah se, Module 16).
- Agar ek condition based pe **bahut heavy component** conditionally render ho raha hai, uska data-fetching/computation bhi conditionally hi trigger ho — taaki unnecessary kaam na ho jab component render hi nahi ho raha.

## 12. Security Notes

- Conditional Rendering ko **kabhi bhi actual security/authorization mechanism** ki tarah treat mat karo — client-side pe "if logged in show X" sirf **UI-level display logic** hai; asli security (kya user actually authorized hai kisi data/action ke liye) hamesha **backend** pe enforce honi chahiye (future Auth/JWT modules), kyunki client-side code ko koi bhi inspect/bypass kar sakta hai.

## 13. Interview Questions

1. Conditional Rendering kya hai?
2. JSX ke andar directly `if-else` statement kyun nahi likh sakte?
3. Ternary Operator se conditional rendering kaise karte hain?
4. Logical AND (`&&`) operator conditional rendering me kaise kaam karta hai? "Short-circuit evaluation" ka concept explain karo.
5. Ek component kitni values return kar sakta hai? Agar multiple `return` statements likhe jaayein, kya hoga?
6. `count && <p>{count}</p>` me agar `count` `0` ho, kya render hoga? Ye edge case kyun hota hai?
7. Ternary vs `&&` — kab kaunsa use karna better hai?

## 14. Practice Questions

1. Ek component banao jo `isAdmin` prop ke basis pe "Admin Panel" ya "Access Denied" dikhaye, if-else se.
2. Same logic Ternary Operator se rewrite karo.
3. Ek component banao jo sirf `hasDiscount` true hone par ek "SALE!" badge dikhaye, `&&` operator se.
4. Ek scenario likho jaha `&&` operator ka use accidentally `0` render kar sakta hai, aur usse fix karo.

## 15. Coding Exercises

**Exercise 1:** Login Gate
- `if-else` use karke ek component banao jo `isLoggedIn` prop ke basis pe alag-alag full pages (Home vs Login) dikhaye.

**Exercise 2:** Age Gate with Ternary
- Age-based access message component banao, Ternary Operator se, jaisa transcript me dikhaya gaya.

**Exercise 3:** Conditional Badges
- Ek `ProductCard` component banao jisme `isNew` aur `isOnSale` — dono independent conditions ke basis pe alag-alag badges (`&&` se) conditionally dikhein.

## 16. Mini Projects

**Mini Project: Simple Access Control UI**
- Ek `App.js` banao jisme `login` (boolean) aur `age` (number) — do variables define karo.
- Ek `Hero` component banao jo:
  - `login` false hone par "Login Please" dikhaye (if-else se).
  - `login` true hone par, `age` ke basis pe Ternary se "Access Granted" ya "You must be 18+" dikhaye.
  - Ek separate `welcome` prop (`&&` operator se) ke basis pe optional "Welcome to our Site!" banner dikhaye.
- Values change karke (`login`, `age`, `welcome`) UI ke different states test karo.

## 17. Summary

Is module me humne **Conditional Rendering** ke teen core tareeke seekhe: **if-else** (poore alag return statements ke saath, complex logic ke liye), **Ternary Operator** (`condition ? A : B`, JSX-embeddable, "either/or" cases ke liye), aur **Logical AND (`&&`)** (`condition && JSX`, "show only if true" cases ke liye, short-circuit evaluation ki wajah se). Humne ye bhi confirm kiya ki ek React component **sirf ek hi value return** kar sakta hai — ye conditional rendering ke design ka core reason hai.

## 18. Keywords

Conditional Rendering, if-else, Ternary Operator, Logical AND, `&&` operator, short-circuit evaluation, JSX expression vs statement, single return value.

## 19. Tags
`#react` `#conditional-rendering` `#ternary-operator` `#logical-operators` `#jsx` `#frontend` `#intermediate`

## 20. Suggested Next Topics
- React Hooks — useState (making components interactive/stateful)
- React Hooks — useEffect (side effects, data fetching)

## 21. Related Topics
- Module 17: JSX & Components (Props used here to drive conditions)
- Module 6: JavaScript Control Flow (if-else, ternary — reused directly here)
- React Hooks (where conditions are commonly driven by dynamic state, next module)

---
*End of Module 18. Continuing sequentially to Module 19: React Hooks — useState & useEffect in the next part.*
