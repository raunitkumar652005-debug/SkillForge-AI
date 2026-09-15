# Module 25: Redux Toolkit — Global State Management

---

## 1. Overview

Is module me **Redux** — ek advanced state management library — cover kiya gaya. Instructor pehle ek simple analogy (mitti lane ke different ways) se samjhate hain ki **`useState`**, **Context API**, aur **Redux** — teeno kab use karne chahiye (scale ke hisaab se). Phir **Redux Toolkit** (modern, simplified Redux setup) ka complete practical setup dikhaya gaya — ek **Counter App** banate hue jo Slice, Store, Provider, `useSelector`, aur `useDispatch` ka use karta hai.

## 2. Prerequisites

- Module 22 (Lifting State Up & Prop Drilling) aur Module 20 (useState) completed.
- React Router (Module 23) aur basic Vite setup (Module 19) ka familiarity.

## 3. Learning Objectives

- **Redux kyun chahiye** samajhna — `useState` vs Context API vs Redux — kab kaunsa.
- **Redux Toolkit** install karna (`@reduxjs/toolkit` + `react-redux`).
- **Slice** (`createSlice`) banana — name, initialState, reducers (action creators).
- **Store** (`configureStore`) setup karna — slices ke reducers ko wahan register karna.
- **Provider** se poori app ko Redux-enabled banana (main.jsx me).
- **`useSelector`** hook se store se current state value padhna.
- **`useDispatch`** hook se actions dispatch karke state update karna.

## 4. Cleaned Transcript (Hinglish)

**The Analogy — Choosing the Right Tool for the Scale**

Ek analogy se state management ka scale samjhaya gaya — "thodi si mitti laani hai":
- **Thodi si mitti** — haath se le aao (**`useState`** — simple, local state).
- **Ek room bhar mitti** — khurpi/tassla use karo (**Context API** — medium-scale projects, shared state without heavy boilerplate).
- **Ek poori road banani hai** — JCB/Bulldozer chahiye (**Redux** — large enterprise-scale apps jaise Amazon/Flipkart, lakhs of users).

**Redux** tab use hota hai jab project **bahut bada** ho aur context API ka shared-wrapper approach performance ya maintainability ke liye zyada complex ho jaaye.

**Installation**

```bash
npm install @reduxjs/toolkit react-redux
```
- **`@reduxjs/toolkit`** — Modern Redux ka simplified package (manually `createStore`, `combineReducers` likhne ki zaroorat nahi) — configuration bahut aasaan ho gayi hai.
- **`react-redux`** — Redux ko React ke saath bridge karne wala package (hooks like `useSelector`, `useDispatch` provide karta hai).

**Step 1 — Create a Slice (counterSlice.js)**

Slice ek specific component/feature ki state aur uski actions ko define karta hai:

```javascript
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",        // slice ka naam
  initialState: { count: 0 }, // default state
  reducers: {             // actions (state ko change karne ke methods)
    increment: (state) => {
      state.count = state.count + 1;
    },
    decrement: (state) => {
      state.count = state.count - 1;
    },
  },
});

// Export actions (to be dispatched from components)
export const { increment, decrement } = counterSlice.actions;

// Export selector (to read the count value from store)
export const selectCount = (state) => state.counter.count;

// Export reducer (to be registered in the store)
export default counterSlice.reducer;
```

**Tin cheezein yaad rakhni hain Slice ke andar:**
1. **`name`** — Slice ka naam (store me is naam se access hogi).
2. **`initialState`** — State ki default/starting value.
3. **`reducers`** — Actions — wo functions jo state ko update karte hain (jaise `increment`, `decrement`). State ko directly modify karna normally wrong hai, lekin Redux Toolkit ke andar **Immer library** internally use hoti hai jo direct mutations ko internally safe immutable updates me convert kar deta hai.

**Teeen cheezon ko export karna padta hai:**
1. **Actions** (named exports) — Components se dispatch karne ke liye.
2. **Selector** — Store se value padhne ke liye (ek arrow function `(state) => state.sliceName.property`).
3. **Reducer** (default export) — Store me register karne ke liye.

**Step 2 — Create the Store (store.js)**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer, // 'counter' naam se register kiya
    // Multiple slices ho sakti hain: user: userReducer, cart: cartReducer
  },
});

export default store;
```
- **`configureStore`** — Modern Redux ka simplified store-creation method. Reducers object me apni saari slices register karo.
- Store ek **single, centralized place** hai poore app ki state ke liye.

**Step 3 — Wrap App with Provider (main.jsx)**

```jsx
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```
- **`Provider`** (`react-redux` se) — Poore app ko Redux store se connect karta hai.
- `store` prop me apna configured store pass karo.
- Yahan se poore app ke kisi bhi component me store access possible ho jaata hai.

**Step 4 — Using Redux in a Component (Counter.jsx)**

```jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, selectCount } from "./counterSlice";

function Counter() {
  const count = useSelector(selectCount); // read from store
  const dispatch = useDispatch();          // get dispatch function

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}
export default Counter;
```

**Two key hooks:**
- **`useSelector(selectorFn)`** — Store se current value padhta hai. `selectCount` (humari slice se) pass karke `count` value milti hai.
- **`useDispatch()`** — Ek `dispatch` function deta hai. Kisi bhi action ko call karne ke liye `dispatch(actionCreator())` ka pattern use hota hai.
- **Kab update hota hai UI?** — Jab bhi `dispatch(increment())` call hota hai, Redux store update hota hai, aur `useSelector` ne jo value read ki hai wo automatically re-render trigger karti hai — bilkul `useState` ki tarah, lekin **globally** (poori app ke kisi bhi component me).

**One-Time Fixed Pattern**

Instructor ne emphasize kiya: Redux ka basic setup (Slice banaana, Store setup, Provider wrap, Selector/Dispatch use) — ye **ek fixed, boilerplate-like pattern** hai jo hamesha same rehta hai. Sirf alag content (counters, user data, cart items) ki slice alag hogi — baaki structure same. Practice karne se ye pattern naturally yaad ho jaata hai.

## 5. Beginner Explanation

Socho ek **bada warehouse** (Store) hai jaha **department-wise compartments** (Slices) hain. Har department apna apna data manage karta hai. Koi bhi employee (Component) warehouse pe jaake **seedha apni zaroorat ka data** dekh sakta hai (`useSelector`) — bina kisi doosre department se "forward" karwaye. Agar kuch change karna hai (jaise counter badhana), employee ek **request form** (`dispatch(increment())`) submit karta hai — warehouse manager (Redux) khud update karta hai, aur sabko naya data automatically dikh jaata hai.

## 6. Technical Explanation

**Redux** ek **predictable state container** hai. Core principles:
1. **Single Source of Truth** — Poora app state ek single **Store** me.
2. **State is Read-Only** — State ko directly modify nahi kar sakte — sirf **Actions dispatch** karke.
3. **Changes via Pure Functions (Reducers)** — Actions ko Reducers handle karte hain jo **current state + action** leke **new state** return karte hain.

**Redux Toolkit** in sab ko simplify karta hai:
- `createSlice` automatically **action creators** aur **action types** generate karta hai.
- Internally **Immer** library use hoti hai jo "direct mutation" jaisi syntax ko immutable updates me convert karta hai — actual state kabhi mutate nahi hoti.
- `configureStore` automatically **Redux DevTools** support aur middleware (thunk) add karta hai.

**`useSelector`** — React component ko Redux store ke specific part se **subscribe** karta hai — jab woh slice change hoti hai, sirf wahi components re-render hote hain jo usse use kar rahe hain (efficient selective re-rendering).

**`useDispatch`** — Store ka `dispatch` method return karta hai — actions ko trigger karne ka mechanism.

## 7. Examples & Code

**Full Counter App with Redux Toolkit:**

```javascript
// counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => { state.count += 1; },
    decrement: (state) => { state.count -= 1; },
    reset: (state) => { state.count = 0; },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export const selectCount = (state) => state.counter.count;
export default counterSlice.reducer;
```

```javascript
// store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export default configureStore({
  reducer: { counter: counterReducer },
});
```

```jsx
// main.jsx
import { Provider } from "react-redux";
import store from "./store";

<Provider store={store}><App /></Provider>
```

```jsx
// Counter.jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset, selectCount } from "./counterSlice";

function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}
```

## 8. Line-by-Line Explanation

1. `createSlice({ name, initialState, reducers })` — Ek slice object banata hai jisme name, starting state, aur state-change functions (reducers) define hote hain.
2. `export const { increment, decrement } = counterSlice.actions;` — Toolkit automatically action creator functions generate karta hai — inhe destructure karke export kiya.
3. `export const selectCount = (state) => state.counter.count;` — Ek selector function — store ke `counter` slice ki `count` value return karta hai.
4. `export default counterSlice.reducer;` — Slice ka reducer export kiya (store me register hoga).
5. `configureStore({ reducer: { counter: counterReducer } })` — Store banaya, `counter` naam se slice ka reducer register kiya.
6. `<Provider store={store}>` — Poori app ko store se connect kiya.
7. `useSelector(selectCount)` — Store se current count value react state ki tarah milti hai, automatic re-render included.
8. `dispatch(increment())` — `increment` action trigger kiya — Redux internally reducer call karta hai, state update hoti hai, UI automatically update hota hai.

## 9. Common Mistakes

- `@reduxjs/toolkit` aur `react-redux` **dono install karna bhool jaana** — sirf ek package se kaam nahi chalega.
- `Provider` me `store` prop lagana bhool jaana — bina iske `useSelector`/`useDispatch` kaam nahi karenge.
- Selector function galat likhna (jaise `state.count` instead of `state.counter.count`) — `state` ka structure store ke `reducer` keys se match karna chahiye.
- `dispatch` ke andar action ko **call** karna bhool jaana — `dispatch(increment)` galat hai, `dispatch(increment())` sahi hai (action creator ko **call** karo).
- Reducer function ke bahar state mutate karne ki koshish karna — sirf Reducers ke andar mutation safe hai (Immer ki wajah se).

## 10. Best Practices

- **Slice files** feature-wise organize karo (`userSlice.js`, `cartSlice.js`) — separation of concerns.
- **Selectors ko slice file me export** karo (jaisa `selectCount`) — component me inline anonymous functions se `useSelector` call karne se better re-usability milti hai.
- Store me sirf **app-wide shared state** rakho — local component-only state ke liye `useState` better choice hai.
- Redux DevTools Extension (browser) install karo — state changes ka full timeline dikhai deta hai, debugging bahut easy ho jaati hai.

## 11. Performance Tips

- `useSelector` se sirf **exactly jo chahiye** wahi select karo (entire state object nahi) — isse unnecessary re-renders avoid hote hain.
- Multiple components wahi slice use karte hon toh, sirf us slice ke change pe hi unka re-render hoga (highly selective) — React's natural memoization benefits milti hain.

## 12. Security Notes

- Redux store me **sensitive data (passwords, tokens)** store karne se bachna chahiye — Redux DevTools se ye publicly readable ho sakta hai debug sessions me.
- Store me sirf wahi state rakho jo genuinely globally shared honi chahiye — unnecessary global exposure security surface badha deta hai.

## 13. Interview Questions

1. Redux kab use karna chahiye? `useState` aur Context API se kaise different hai?
2. Slice kya hai Redux Toolkit me? Slice me kya-kya define hota hai?
3. `createSlice` ke teen mandatory fields kaunse hain?
4. Store kya hai, aur kaise setup karte hain?
5. `Provider` ka kya role hai?
6. `useSelector` aur `useDispatch` me kya-kya kaam hai?
7. Redux me state ko directly mutate kyun nahi kar sakte (isliye Toolkit me karte hain bhi to kaise safe hai)?
8. Action aur Reducer me kya difference hai?

## 14. Practice Questions

1. Ek `counterSlice.js` file likho jisme `increment`, `decrement`, aur `reset` — teen reducers hon.
2. Ek `store.js` banao jo is slice ke reducer ko register kare.
3. `Counter.jsx` component me `useSelector` aur `useDispatch` use karke count display aur buttons banao.

## 15. Coding Exercises

**Exercise 1:** Full Redux Counter
- Upar bataye gaye pure pattern ko scratch se implement karo ek naye Vite project me.

**Exercise 2:** Two Slices
- Ek `userSlice` aur ek `counterSlice` banao — dono ko ek hi store me register karo.

**Exercise 3:** Redux DevTools
- Browser me Redux DevTools extension install karo aur buttons click karte hue state changes ka timeline observe karo.

## 16. Mini Projects

**Mini Project: Shopping Cart Counter**
- Ek Redux-powered app banao:
  - Ek `cartSlice` ho jisme `itemCount` state ho.
  - `addItem` aur `removeItem` reducers hon.
  - `Header` component me `useSelector` se live item count dikhao.
  - `Shop` component me buttons se `dispatch(addItem())` / `dispatch(removeItem())` karo.
  - `Header` aur `Shop` dono automatically sync rehein bina prop drilling ke.

## 17. Summary

Is module me humne **Redux Toolkit** — large-scale React apps ke liye global state management — seekha. **Analogy** se samjha kab `useState`, kab Context API, kab Redux. Practical setup ke 4 steps follow kiye: (1) **Slice banao** (`createSlice` — name, initialState, reducers, actions/selector/reducer export), (2) **Store banao** (`configureStore` — slices register karo), (3) **Provider se App wrap karo** (main.jsx me), (4) **Components me use karo** (`useSelector` for reading, `useDispatch` for updating). Ye pattern ek fixed boilerplate hai jo bade apps me prop drilling eliminate karke clean, global state management deta hai.

## 18. Keywords

Redux, Redux Toolkit, createSlice, configureStore, Provider, useSelector, useDispatch, Slice, Store, Reducer, Action, Action Creator, Selector, Immer, react-redux, Global State Management.

## 19. Tags
`#redux` `#redux-toolkit` `#global-state` `#state-management` `#react` `#advanced` `#useselector` `#usedispatch`

## 20. Suggested Next Topics
- Node.js Fundamentals
- Express.js & REST APIs (Backend arc begins)

## 21. Related Topics
- Module 22: Lifting State Up & Prop Drilling (problem that Redux solves)
- Module 20: React Hooks — useState (simpler, local alternative)
- Node.js (next — backend where the real API/data that Redux fetches comes from)

---
*End of Module 25. Continuing sequentially to Module 26: Node.js Fundamentals in the next part.*
