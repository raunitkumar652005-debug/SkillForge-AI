# Module 20: React Hooks — useState & useEffect

---

## 1. Overview

Is module me React ke **do sabse important Hooks** cover kiye gaye: **`useState`** (component ki "state"/current-data ko manage karna, aur UI ko us data ke change hone par automatically update karna) aur **`useEffect`** (side-effects handle karna, jaise timers ya future me backend data fetching). Instructor ne pehle **Hooks ka concept** aur history (Class Components ke "Lifecycle Methods" se Function Components ke "Hooks" tak ka transition) samjhaya, phir ek **Counter App** banate hue practically dikhaya ki normal JavaScript variables React me UI update karne ke liye **kaam kyun nahi karte**, aur `useState` isko kaise solve karta hai. Phir ek **Timer** example se `useEffect` aur uski **dependency array** samjhayi gayi.

## 2. Prerequisites

- Module 16-19 (React Fundamentals, Components/Props, Conditional Rendering, Project Structure) completed.
- Module 7 (Functions), Module 15 (Async concepts, callback functions) ka basic exposure.

## 3. Learning Objectives

- **Hooks** kya hote hain, samajhna — aur inka history (Class-based Lifecycle Methods se Function-based Hooks tak).
- Kyun **normal JavaScript variables** React component ki UI ko automatically update nahi kar paate — "State Access" ki problem samajhna.
- **`useState`** hook use karna — state variable aur uska updater function.
- Convention: `const [value, setValue] = useState(initialValue)`.
- State ko update karne ka sahi tareeka (updater function ke through, **kabhi directly nahi**).
- **`useEffect`** hook ka purpose samajhna — side effects handle karna (jaise timers, future me API calls).
- **Dependency Array** ka concept — `useEffect` kab-kab re-run hota hai, control karna.

## 4. Cleaned Transcript (Hinglish)

**What are Hooks? — A Bit of History**

Pehle jab React me **Class-Based Components** hote the, developers unki **Lifecycle** samajhte the — component **mount** hua (page pe aaya), usme kuch **changes** hue (update), ye sab specific **Lifecycle Methods** (jaise `componentDidMount`, `componentDidUpdate`) se track hota tha.

Aaj hum **Function-Based Components** use karte hain — inme wahi functionality **Hooks** ke through milti hai. **Hook** basically React ki ek **special property/function** hai jo tumhe **State manage karne**, **Side Effects manage karne**, aur bhi bahut kuch karne allow karti hai.

**Common Hooks:** `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback` — inme se `useState` aur `useEffect` sabse zyada frequently use hote hain.

**The Problem — Why Regular Variables Don't Work**

Ek **Counter App** banaya gaya — `increment`, `decrement`, `reset` functions ke saath ek normal JavaScript variable use karke:

```jsx
function App() {
  let count = 0; // normal variable

  function increment() {
    count = count + 1;
    console.log(count);
  }

  function decrement() {
    count = count - 1;
  }

  function reset() {
    count = 0;
  }

  return (
    <div>
      <h1>Counter App</h1>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Observation:** Jab "Increment" button pe click kiya gaya, `console.log` me value **badhti hui dikhi** (1, 2, 3...) — matlab function toh sahi chal raha hai. Lekin **UI par (screen pe) `count` ki value change nahi ho rahi** — wahi `0` dikhta reh gaya!

**Why?** — Kyunki component **tabhi khud ko update (re-render)** karta hai jab uski **State** (current value) change hoti hai. Normal JavaScript variables ke paas **"State ka access" nahi hota** — matlab jo value UI pe dikh rahi hai, uska direct access variable ke paas nahi hai. Normal variables sirf **page refresh** hone par hi apni nayi value se load honge — jab tak page refresh nahi hota, UI update nahi hogi (refresh hone par toh sab wapas reset ho jaayega, kyunki `count = 0` phir se chalega).

**The Solution — useState Hook**

Isko solve karne ke liye **`useState` hook** use hota hai — ye **React library se import karna padta hai**:

```jsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1); // NEVER directly do count++ or count = count + 1
    console.log(count);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div>
      <h1>Counter App</h1>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Breaking Down `useState`:**
- `useState(0)` — Ek naya **state variable** banata hai, jiski **initial/default value** `0` hai.
- Ye **do cheezein return** karta hai (isliye **Array Destructuring** — `[count, setCount]` — use hoti hai):
  1. **Pehli value** — Wo current value jo **UI par dikhti hai** (`count`).
  2. **Doosri value** — Wo **function jo is value ko update** karega (`setCount`).
- **Naming Convention:** Convention hai `[value, setValue]` — pehla lowercase, doosra "set" + capitalized version — lekin **naam khud koi bhi rakh sakte ho**.
- **Critical Rule:** State ko **kabhi directly modify nahi kar sakte** (`count = count + 1` ya `count++` **kaam nahi karega**) — **hamesha updater function** (`setCount(...)`) use karna padega.

**Why This Works:** `setCount()` call hote hi React ko pata chal jaata hai ki is component ki **state change hui hai**, aur React automatically us component ko **re-render** kar deta hai — is baar naya `count` UI par turant dikh jaata hai, **bina page refresh kiye**.

**Summary — useState:**
> `useState` se tumhare current element/component ki **state access** ho jaati hai — ye tumhe: (1) current value dekhne, aur (2) us value ko update karne — dono ki capability deta hai.

---

**Introducing useEffect — Handling Side Effects**

**`useEffect`** — Ye **side effects handle karta hai**. Pehle Class Components me jo `componentDidMount` jaisa method hota tha, use replace karta hai `useEffect`.

**Kab use karte hain:** Jab tumhe chahiye ki page **load hote hi kuch automatically ho** — jaise koi data automatically aa jaaye, ya koi timer start ho jaaye. Future me isse **backend se data fetch** (asynchronous operations) karne ke liye extensively use kiya jaayega.

**Example — A Live Timer ("Time Spent on Page")**

```jsx
import { useState, useEffect } from "react";

function App() {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1);
    }, 1000); // runs the callback every 1000ms (1 second)
  }, []); // empty dependency array

  return (
    <div>
      <h1>Time Spent on Page: {timeSpent}</h1>
    </div>
  );
}
```

**Breaking Down `useEffect`:**
- **`useEffect` do arguments leta hai:**
  1. **Callback function** — Wo logic jo run karni hai (yahan `setInterval` waala logic).
  2. **Dependency Array** — Ek array jo control karta hai `useEffect` **kab-kab re-run** hoga.
- **Dependency Array ka behavior:**
  - `useEffect` **pehli baar hamesha chalta hai** jab component page pe load hota hai.
  - Uske baad, ye **tabhi dobara chalega jab dependency array me kisi value me change ho** — jitni baar array ki koi value change hogi, utni baar `useEffect` re-run hoga.
  - **Empty array (`[]`)** — Iska matlab hai "koi dependency nahi", isliye `useEffect` **sirf ek baar** (component ke load hote hi) chalega, phir kabhi nahi.
- **`setInterval(callback, delay)`** — Ek **built-in JavaScript method** jo diye gaye `callback` function ko **har `delay` milliseconds baad baar-baar** run karta hai. Yahan `1000ms = 1 second`.

**Note on Future Use:** Instructor ne mention kiya ki `useEffect` ka **real, practical importance** tab samajh aayega jab **Local Storage** aur **Backend API calls** (Async operations, Module 15 se connect) padhte waqt use kiya jaayega — abhi ka timer example sirf syntax samjhane ke liye tha.

## 5. Beginner Explanation

Socho tumhare paas ek **scoreboard** hai jo actually kisi digital screen pe display ho raha hai — agar tum sirf apni notebook me score badhate raho (normal variable), screen pe kuch nahi dikhega jab tak koi manually screen ko refresh na kare. **`useState`** ek "smart scoreboard system" hai — jab bhi tum `setCount()` bolte ho, poora scoreboard **automatically khud ko update** kar leta hai, bina kisi manual refresh ke. **`useEffect`** ek "automatic assistant" hai jo page khulte hi apna kaam (jaise ek timer chalu karna) khud-ba-khud shuru kar deta hai, bina kisi button-click ka wait kiye.

## 6. Technical Explanation

**`useState`** React ke **reconciliation/render cycle** se directly connected hai — jab bhi `setCount()` (ya koi bhi state-updater function) call hoti hai, React us component ko **"dirty" mark** kar deta hai aur ek naya render cycle trigger karta hai — Component function **dobara execute** hota hai, is baar naye state value ke saath, aur naya JSX Virtual DOM me compare hokar (Module 16 — diffing) Real DOM par update hota hai.

- **Normal JS variables**, function ke **local scope** me hote hain — har render pe function **fresh se execute** hota hai, isliye local variables **reset** ho jaate hain agle render pe — inme "persist" karne ki capability nahi hoti render-to-render.
- **State variables** (`useState` se), React internally **component ke bahar, ek persistent memory location** me store karta hai — isliye renders ke beech **persist** karte hain, aur unki change **automatically re-render trigger** karti hai.

**`useEffect`** React ke **"side effect" management system** ka part hai — ye function/callback ko component ke **render cycle ke baad** run karta hai (asynchronously, taaki UI blocking na ho). **Dependency array** decide karta hai kab re-run karna hai:
- **No array diya** — Har render ke baad chalega (rarely desired).
- **Empty array (`[]`)** — Sirf **mount** (pehli render) ke baad ek baar chalega.
- **Array with values (`[value1, value2]`)** — Mount ke baad ek baar, phir jab bhi in specific values me se koi change ho, tab dobara chalega.

**`setInterval` cleanup (important nuance, not covered live but critical in production):** Agar `useEffect` ke andar `setInterval` set kiya jaata hai, use ek **cleanup function** (`useEffect` ke return statement se) ke saath `clearInterval()` karna best practice hai — warna component unmount hone ke baad bhi interval chalte rehne se **memory leaks** ho sakte hain (advanced topic, self-explore recommended).

## 7. Examples & Code

**Example 1 — Basic Counter with useState**
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**Example 2 — useState with a String**
```jsx
function NameInput() {
  const [name, setName] = useState("Guest");

  return (
    <div>
      <p>Hello, {name}!</p>
      <button onClick={() => setName("Karan")}>Set Name</button>
    </div>
  );
}
```

**Example 3 — useEffect that Runs Once (Empty Dependency Array)**
```jsx
import { useState, useEffect } from "react";

function WelcomeMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("Welcome! This ran once when the page loaded.");
  }, []);

  return <h2>{message}</h2>;
}
```

**Example 4 — useEffect with a Dependency (Re-runs on Change)**
```jsx
function Logger({ userId }) {
  useEffect(() => {
    console.log(`User ID changed to: ${userId}`);
  }, [userId]); // re-runs every time 'userId' changes

  return <p>Watching User ID: {userId}</p>;
}
```

## 8. Line-by-Line Explanation

Using **Example 1**:
1. `import { useState } from "react";` — `useState` hook ko React library se import kiya (named import, curly braces ke saath).
2. `const [count, setCount] = useState(0);` — Ek state variable `count` banaya, initial value `0` ke saath; `setCount` uska updater function hai; Array Destructuring se dono ek saath nikale.
3. `<p>Count: {count}</p>` — `count` ki current value JSX me display ki, curly braces se.
4. `<button onClick={() => setCount(count + 1)}>+</button>` — Click hone par `setCount()` call hota hai naye value (`count + 1`) ke saath — React ko pata chal jaata hai state change hui, component re-render hota hai, naya count screen pe turant dikhta hai.
5. `<button onClick={() => setCount(count - 1)}>-</button>` — Similarly, value ek se ghatati hai.
6. `<button onClick={() => setCount(0)}>Reset</button>` — Value ko directly `0` pe reset karta hai.

## 9. Common Mistakes

- State ko **directly modify** karne ki koshish karna (`count = count + 1` ya `count++`) — ye **kaam nahi karega**, UI update nahi hogi; hamesha updater function (`setCount(...)`) use karo.
- `useState`/`useEffect` ko **React se import karna bhool jaana** — ye directly globally available nahi hain, explicit import zaroori hai.
- `useEffect` me **dependency array dena bhool jaana** — isse har single render ke baad `useEffect` chalta rahega, jo performance issues aur infinite loops create kar sakta hai (especially agar `useEffect` ke andar khud state update ho rahi ho).
- Empty dependency array (`[]`) aur **array na dena at all** — dono confuse karna; dono ka behavior fundamentally different hai.
- Normal variables ko state ki tarah use karne ki koshish karna aur confuse hona ki "UI update kyun nahi ho raha" — is module ka core lesson yahi tha.
- `setInterval` ke saath cleanup na karna production apps me — memory leaks ka source ban sakta hai.

## 10. Best Practices

- Jab bhi koi value **UI par dikhni** hai aur **change hoti rahegi**, use hamesha `useState` me rakho — plain variables kabhi nahi.
- State updater functions ko **descriptive naming convention** (`[value, setValue]`) ke saath likho — readability ke liye.
- `useEffect` me **hamesha dependency array explicitly do** — apni intent clear rakho (kab re-run hona chahiye).
- Side-effects (timers, API calls, subscriptions) ko **hamesha `useEffect` ke andar** rakho, seedha component body me nahi (warna har render pe uncontrolled tarike se chalenge).
- Production code me `setInterval`/subscriptions jaise side-effects ke liye **cleanup function** return karo `useEffect` se.

## 11. Performance Tips

- Dependency array **sahi se define** karna crucial hai — agar zaroorat se zyada broad ho (ya missing ho), `useEffect` unnecessarily baar-baar chal sakta hai, performance degrade kar sakta hai.
- Bahut saari alag-alag `useState` calls (bahut saare chhote state pieces) vs ek bada combined state object — trade-offs hote hain; simple components ke liye multiple `useState` calls generally zyada readable hote hain.

## 12. Security Notes

- State me sensitive data (jaise passwords, tokens) store karte waqt savdhaan raho — React DevTools se koi bhi component ki state inspect kar sakta hai browser me; sensitive data ko client-side state me unnecessarily store karne se bacho.

## 13. Interview Questions

1. Hook kya hota hai React me?
2. Normal JavaScript variables React component ki UI ko automatically update kyun nahi kar paate?
3. `useState` kya return karta hai, aur ye do values kya represent karti hain?
4. State ko update karne ka sahi tareeka kya hai? Directly modify karne se kya hota hai?
5. `useEffect` kis liye use hota hai?
6. Dependency Array kya hai, aur `[]` (empty array) dene se `useEffect` ka behavior kaise decide hota hai?
7. Class-Based Components ke "Lifecycle Methods" aur Function-Based Components ke "Hooks" me kya conceptual similarity hai?

## 14. Practice Questions

1. Ek `useState` variable banao jo ek boolean ho (`isVisible`), aur ek button se toggle karo.
2. Ek `useEffect` likho jo empty dependency array ke saath sirf ek baar console me "Component Loaded" print kare.
3. Explain karo (bina code ke) ki agar `useEffect` ki dependency array me `[count]` diya jaaye, ye kab-kab re-run hoga.

## 15. Coding Exercises

**Exercise 1:** Full Counter App
- Increment, Decrement, aur Reset — teeno buttons ke saath ek poora counter app banao `useState` use karke.

**Exercise 2:** Live Clock
- `useState` aur `useEffect` (with `setInterval`) use karke ek live-updating seconds-counter banao, jaisa transcript me dikhaya gaya.

**Exercise 3:** Dependency Array Experiment
- Ek component banao jisme do state variables hon; `useEffect` ki dependency array me sirf ek variable do, aur test karo ki doosre variable ke change hone par `useEffect` chalta hai ya nahi.

## 16. Mini Projects

**Mini Project: Interactive Counter with Live Timer**
- Ek React app banao jisme:
  - Ek Counter (`useState`) ho with Increment/Decrement/Reset.
  - Ek "Time Spent on Page" live timer ho (`useState` + `useEffect` + `setInterval`).
  - Dono independently kaam karein — counter ka reset timer ko affect na kare.

## 17. Summary

Is module me humne React ke **do most-used Hooks** seekhe. **`useState`** se humne samjha ki normal JavaScript variables ke paas UI-triggering "state access" nahi hota — isliye `const [value, setValue] = useState(initial)` pattern use karke state manage ki jaati hai, aur update **hamesha `setValue()` ke through** hota hai, kabhi directly nahi. **`useEffect`** se humne "side effects" (jaise timers) handle karna seekha — iska **callback function** aur **dependency array** (`[]` for "run once", `[dep]` for "run on dependency change") React development ka daily-use pattern hai, jo aage backend data-fetching ke liye extensively use hoga.

## 18. Keywords

Hooks, useState, useEffect, State, State Variable, Updater Function, Array Destructuring, Class Components, Lifecycle Methods, componentDidMount, Side Effects, Dependency Array, setInterval, Re-render.

## 19. Tags
`#react` `#hooks` `#usestate` `#useeffect` `#state-management` `#side-effects` `#frontend` `#core-concept`

## 20. Suggested Next Topics
- Local Storage & Session Storage (mentioned as future useEffect use-case)
- React Router — Navigation Between Pages

## 21. Related Topics
- Module 15: Asynchronous JavaScript (useEffect will be used for API calls, directly connects here)
- Module 17: Components & Props (state complements props for full component data-flow)
- Module 18: Conditional Rendering (state is commonly the driver behind conditions)

---
*End of Module 20. Continuing sequentially to Module 21: Local Storage, Session Storage & React Router in the next part.*
