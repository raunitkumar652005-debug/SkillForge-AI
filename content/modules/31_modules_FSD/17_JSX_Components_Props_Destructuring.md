# Module 17: JSX & React Components — Props, Rendering & Destructuring

---

## 1. Overview

Is module me React ke sabse core, day-to-day-use concepts cover kiye gaye: **Components banana**, **Export/Import** (default vs named), **Rendering Elements**, **Props** (properties) se data pass karna, **Default Props values** (using the `||` OR operator), aur **Destructuring** se props ko cleaner tarike se access karna — ek practical **Custom Button** component banate hue.

## 2. Prerequisites

- Module 16 (React Fundamentals — History, Virtual DOM) completed.
- Module 9 (Rest/Spread, Objects) — Destructuring concept yahan heavily reused hota hai.
- Module 6 (Logical/Comparison operators — OR `||`) ka basic exposure.

## 3. Learning Objectives

- Ek naya React **Component** file banana, aur naming convention (**first letter capital**) samajhna.
- **`export default`** aur named `export` (curly braces ke saath) ka difference samajhna.
- **Rendering** ka matlab samajhna — JSX ko screen pe display karna.
- **Props** (Properties) se ek component se doosre component ko data pass karna.
- Props ko JSX ke andar access karne ke liye **curly braces `{}`** ka use samajhna.
- **Default prop values** dena `||` (OR) operator se.
- **Destructuring** se props object ko directly variables me todna, cleaner code ke liye.
- Ek hi component ko **multiple baar, different props ke saath**, reuse karna.

## 4. Cleaned Transcript (Hinglish)

**Creating a Component**

Ek naya component file banane ke liye:
1. Naya file banao — **naam ka pehla letter capital** hona chahiye (jaise `CustomButton.jsx`) — ye React ki naming convention hai.
2. VS Code me `rfc` type karo (ES7 snippet extension ki wajah se) — ye automatically ek **React Functional Component** ka boilerplate generate kar deta hai.

**Export & Import**

React me components ko doosri files me use karne ke liye **export** aur **import** karna padta hai:
```javascript
// In CustomButton.jsx
export default CustomButton;
```
- **`export default`** — Agar ek file me **sirf ek** main component hai jo export karna hai, ye simplest tareeka hai — import karte waqt curly braces ki zaroorat nahi hoti, aur naam bhi kuch bhi rakh sakte ho.
- **Named exports** (curly braces ke saath) — Agar ek file se **multiple** things export karni hon:
```javascript
export { ComponentOne, ComponentTwo };
```
Inhe import karte waqt **exact same naam** aur **curly braces** use karna zaroori hai:
```javascript
import { ComponentOne, ComponentTwo } from "./MyFile";
```

**Rendering Elements**

**Rendering** ka simple matlab hai — **display karna**. Jo bhi JSX tum kisi component ke `return` statement me likhte ho, wo automatically **screen pe render** ho jaata hai. Agar tum ek hi element ko multiple baar likho, wo utni hi baar screen pe dikhega — isse zyada khaas kuch nahi hai.

**Components & Props — The Core Concept**

**Component** — UI ka koi bhi individual part, ya koi bhi file jo ek reusable piece of UI represent karti hai.

**Props (Properties)** — Jab ek component se doosre component ko **data pass** karna ho, tab **props** use hote hain.

```jsx
// In App.js — calling/using the component and passing data
<Hero intro="Coming from Home" />
```
```jsx
// Inside Hero.jsx — receiving the data
function Hero(props) {
  return (
    <div>
      <h2>{props.intro}</h2>
    </div>
  );
}
```
- Jab bhi ek component ko call kiya jaata hai, use jitne bhi attributes/values diye jaate hain (jaise `intro="Coming from Home"`), wo saare ek **single JavaScript Object** ke andar collect ho jaate hain, jise convention se **`props`** naam diya jaata hai (naam mandatory nahi, koi bhi variable naam use ho sakta hai).
- Is object ki keys hoti hain wo naam jo tumne pass kiye (`intro`), aur values wahi hoti hain jo tumne assign ki.
- JSX ke andar kisi JavaScript variable/expression ko access karne ke liye **hamesha curly braces `{}`** lagane padte hain.
- **Important:** `props` khud ek **object** hai — isliye directly `{props}` likhne se React error dega ("Objects are not valid as a React child") — hamesha **specific property** access karo: `{props.intro}`.

**Reusing a Component with Different Props (Custom Button Example)**

Ek `CustomButton` component banaya gaya:
```jsx
// CustomButton.jsx
function CustomButton(props) {
  return (
    <>
      <button>{props.title}</button>
    </>
  );
}
export default CustomButton;
```
```jsx
// App.js — using it TWICE with different data
import CustomButton from "./CustomButton";

function App() {
  return (
    <>
      <CustomButton title="Log In" />
      <CustomButton title="Sign Up" />
    </>
  );
}
```
- Ek hi `CustomButton` component ko **do baar** use kiya gaya, har baar **different `title` prop** ke saath — ek button "Log In" dikhata hai, doosra "Sign Up" — **same code, different output** — ye hi Props ka power hai.

**Passing Multiple/Object Props (Inline Styles Example)**

Props ke through **koi bhi value type** pass ki ja sakti hai — including **objects** (jaise inline CSS styles):
```jsx
// App.js
const btn1 = { backgroundColor: "yellow", padding: "1rem", fontSize: "24px", fontWeight: 600 };
const btn2 = { ...btn1, backgroundColor: "white", border: "2px solid lightblue" }; // spread + override

<CustomButton title="Log In" styles={btn1} />
<CustomButton title="Sign Up" styles={btn2} />
```
```jsx
// CustomButton.jsx
function CustomButton(props) {
  return (
    <button style={props.styles}>{props.title}</button>
  );
}
```
- Yahan **Spread Operator** (`...btn1`) use kiya gaya taaki `btn2` ko `btn1` ki saari properties mile, sirf `backgroundColor` aur `border` override karke — Module 11 ke Value vs Reference concept ka practical application.
- **Note:** JSX me CSS properties **camelCase** me likhi jaati hain (`backgroundColor`, na ki `background-color`), aur `border-radius` jaisi dash-waali properties **`borderRadius`** ban jaati hain.

**Default Prop Values (Using the `||` OR Operator)**

Agar kisi component ko call karte waqt koi prop **nahi diya jaaye**, uski value `undefined` hoti hai. Isko handle karne ke liye **OR operator (`||`)** se ek default value diya ja sakta hai:
```jsx
function CustomButton(props) {
  return (
    <button>{props.title || "Submit"}</button>
  );
}
```
- `props.title || "Submit"` — Agar `props.title` **truthy** hai (koi value hai), wahi use hogi. Agar wo **falsy** hai (`undefined`, empty string, etc.), fallback value `"Submit"` use hogi.
- Isse component "safe" ban jaata hai — bina prop diye bhi ek sensible default content dikhega, error nahi aayegi.

**Destructuring Props (Cleaner Syntax)**

Har jagah `props.title`, `props.styles` likhna repetitive hai — isko cleaner banane ke liye **Destructuring** use hoti hai (Module 10-11 ka concept yahan directly apply hota hai):

```jsx
// Instead of this:
function CustomButton(props) {
  return <button style={props.styles}>{props.title}</button>;
}

// Do this (destructure directly in the function parameter):
function CustomButton({ styles, title }) {
  return <button style={styles}>{title}</button>;
}
```
- Function parameter me hi object ko **destructure** kar liya — ab `props.` likhna zaroori nahi, directly `title`, `styles` variables ki tarah use kiya ja sakta hai.
- Ye **behavior me kuch nahi badalta**, sirf syntax ko **cleaner aur more readable** banata hai — professional React code me ye highly common practice hai.

## 5. Beginner Explanation

Component ko socho jaise ek **cookie-cutter mould** — ek baar mould banaya (component define kiya), phir uss mould se jitni chaho utni cookies (instances) bana sakte ho, aur har cookie me thoda different flavor (props) daal sakte ho. **Props** ek "order-slip" jaisa hai jo tum apne mould ko dete ho — "iss baar chocolate flavor banao", "iss baar vanilla banao" — mould same rehta hai, lekin output props ke through customize hota hai.

## 6. Technical Explanation

React me **Components** essentially JavaScript **functions** hote hain jo **JSX return** karte hain. Jab ek component ko JSX me `<ComponentName prop1="value" />` ki tarah "call" kiya jaata hai, React internally **saare passed attributes ko ek single object** me consolidate karke, us function ka **first (aur sirf) parameter** ki tarah pass karta hai — is object ko convention se `props` kehte hain, lekin ye koi reserved keyword nahi hai, sirf naming convention hai.

**Props ek "read-only" object** hote hain — child component apne props ko directly modify **nahi kar sakta** (ye React ke **Unidirectional Data Flow** principle, Module 16 ka direct extension hai) — agar values change karni hon, wo **parent** ke through hi honi chahiye (future modules me **State** ke through).

**Destructuring in function parameters** ek standard JavaScript ES6 feature hai (Module 10-11 se) — `function CustomButton({ title, styles })` effectively `props.title` aur `props.styles` ko directly `title`/`styles` variables me "unpack" kar deta hai, function body ke andar available hone se pehle hi.

`export default` vs named `export`:
- **Default exports** — Har file me **sirf ek** allowed hai; import karte waqt **koi bhi naam** diya ja sakta hai, curly braces nahi chahiye.
- **Named exports** — Ek file se **multiple** allowed hain; import karte waqt **exact same naam** aur **curly braces** zaroori hain.

## 7. Examples & Code

**Example 1 — Basic Component with Props**
```jsx
// Greeting.jsx
function Greeting(props) {
  return <h2>Hello, {props.name}!</h2>;
}
export default Greeting;
```
```jsx
// App.js
import Greeting from "./Greeting";

function App() {
  return (
    <>
      <Greeting name="Karan" />
      <Greeting name="Priya" />
    </>
  );
}
```

**Example 2 — Default Prop Value**
```jsx
function Greeting({ name }) {
  return <h2>Hello, {name || "Guest"}!</h2>;
}

// <Greeting /> (no name passed) -> "Hello, Guest!"
// <Greeting name="Karan" /> -> "Hello, Karan!"
```

**Example 3 — Passing an Object as a Prop**
```jsx
const cardStyle = { backgroundColor: "lightyellow", padding: "1rem", borderRadius: "8px" };

<ProfileCard name="Aman" styles={cardStyle} />
```
```jsx
function ProfileCard({ name, styles }) {
  return <div style={styles}>{name}</div>;
}
```

**Example 4 — Destructured Reusable Button (Full Pattern)**
```jsx
function CustomButton({ title, styles }) {
  return (
    <button style={styles}>{title || "Submit"}</button>
  );
}
export default CustomButton;
```
```jsx
import CustomButton from "./CustomButton";

const loginStyle = { backgroundColor: "yellow", fontSize: "18px" };
const signupStyle = { ...loginStyle, backgroundColor: "white", border: "2px solid lightblue" };

function App() {
  return (
    <>
      <CustomButton title="Log In" styles={loginStyle} />
      <CustomButton title="Sign Up" styles={signupStyle} />
      <CustomButton /> {/* uses default "Submit" text, no styles */}
    </>
  );
}
```

## 8. Line-by-Line Explanation

Using **Example 4**:
1. `function CustomButton({ title, styles }) {` — Component function define hua, jiske parameter me hi **destructuring** ho gaya — `title` aur `styles` directly usable variables ban gaye (props object me se auto-extracted).
2. `return (<button style={styles}>{title || "Submit"}</button>);` — Ek `<button>` return hua jiski inline `style` prop se styling aayi, aur uska text `title` (agar diya gaya ho) ya fallback `"Submit"`.
3. `const loginStyle = {...};` — Ek plain JS object banaya jo CSS-jaisi properties rakhta hai (camelCase keys).
4. `const signupStyle = { ...loginStyle, backgroundColor: "white", ... };` — Spread Operator se `loginStyle` ki saari properties copy ki, phir `backgroundColor` aur `border` **override** kiye — result ek naya, independent object.
5. `<CustomButton title="Log In" styles={loginStyle} />` — `CustomButton` ko call kiya, `title` aur `styles` dono props diye — internally ye ek object `{ title: "Log In", styles: loginStyle }` ban ke component ko milta hai.
6. `<CustomButton title="Sign Up" styles={signupStyle} />` — Same component, **different props** — different button dikhta hai.
7. `<CustomButton />` — Koi props nahi diye — `title` `undefined` hoga, isliye `||` operator ki wajah se `"Submit"` dikhega; `styles` bhi `undefined` hoga, matlab bina inline styling ke default button dikhega.

## 9. Common Mistakes

- Component file/function ka naam **lowercase letter se start** karna — React isko HTML tag samajh leta hai, custom component nahi (naming convention: **PascalCase**, first letter capital, mandatory hai).
- `props` object ko **directly** JSX me render karne ki koshish karna (`{props}`) — "Objects are not valid as a React child" error deta hai; hamesha specific property access karo (`{props.title}`).
- `export default` aur named `export` ke import syntax ko confuse karna (curly braces lagana jab zaroorat nahi thi, ya na lagana jab zaroorat thi).
- CSS property names ko HTML/CSS wale hyphenated format me likhna (`background-color`) JSX ke andar — JSX me **camelCase** chahiye (`backgroundColor`).
- Destructuring karte waqt braces bhool jaana (`function CustomButton(title, styles)` — ye **do separate parameters** define karega, destructuring nahi) — sahi syntax hai `function CustomButton({ title, styles })`.
- Default value dene ke liye `||` operator ka istemal karte waqt yaad rakhna ki **falsy values** (`0`, `""`, `false`) bhi default trigger kar denge — jo kabhi-kabhi unintended ho sakta hai (advanced nuance).

## 10. Best Practices

- Component file names hamesha **PascalCase** me rakho (`CustomButton.jsx`, na ki `custombutton.jsx`).
- Jab bhi ek file se sirf ek main component export karna ho, **`export default`** use karo — simpler imports.
- **Destructuring** ko prefer karo `props.propertyName` ke bajaye — modern React codebases me ye standard practice hai.
- Reusable components (jaise buttons, cards) me hamesha **sensible default values** do — components zyada robust aur "safe-to-use" ban jaate hain.
- Objects ko props ki tarah pass karte waqt, agar ek base style se multiple variations banani ho, **Spread Operator** use karo (jaisa `btn2` example me dikhaya gaya) — DRY (Don't Repeat Yourself) principle follow karta hai.

## 11. Performance Tips

- Props ke through bade, complex objects baar-baar naye reference ke saath pass karna (jaise inline `{ ... }` directly JSX me likh dena har render pe) unnecessary re-renders trigger kar sakta hai — better practice hai objects ko component ke bahar ya `useMemo` (advanced hook, future topic) ke saath define karna.
- Destructuring khud koi significant performance cost/benefit nahi laata — ye purely readability ke liye hai.

## 12. Security Notes

- Props ke through aane waala data (especially agar wo kisi external/user-input source se aaya ho) ko, jab render karo, React by-default **auto-escape** karta hai (XSS se safety) — lekin agar tum `dangerouslySetInnerHTML` jaisi API use karte ho props ke saath, tab manual sanitization zaroori ho jaati hai.

## 13. Interview Questions

1. React Component kya hota hai?
2. Props kya hote hain aur inka use kya hai?
3. `export default` aur named `export` me kya difference hai?
4. JSX ke andar JavaScript expression access karne ke liye kya zaroori hai?
5. Props object ko directly render karne ki koshish karne pe kya error aata hai, aur kyun?
6. Default prop values dene ka ek common tareeka kya hai?
7. Destructuring props ka kya fayda hai?
8. Kya child component apne props ko modify kar sakta hai? Iska React ke kis principle se connection hai?

## 14. Practice Questions

1. Ek `Greeting` component banao jo `name` prop leke "Hello, {name}!" print kare, default value "Guest" ke saath.
2. Same component ko App.js me 3 baar, alag-alag names ke saath, use karo.
3. Ek `Card` component banao jo `title`, `description`, aur `styles` (object) — teen props le.
4. Ek component ko destructured parameters ke saath likho, aur wahi component non-destructured (`props.x`) syntax me bhi likho — dono compare karo.

## 15. Coding Exercises

**Exercise 1:** Reusable Badge Component
- Ek `Badge` component banao jo `text` aur `color` props le, aur ek styled `<span>` return kare jiska background color prop se aaye.

**Exercise 2:** Default Props Practice
- `Badge` component me default values do: agar `text` na diya jaaye "New" dikhe, agar `color` na diya jaaye "gray" use ho.

**Exercise 3:** Style Variations via Spread
- Ek base style object banao, aur Spread Operator se 3 variations banao (alag-alag colors ke saath), aur 3 buttons render karo unhi variations ke saath.

## 16. Mini Projects

**Mini Project: Reusable Card Component System**
- Ek `ProductCard` component banao jo `name`, `price`, aur `imageUrl` props le.
- App.js me 4 different products ke data ke saath ise 4 baar use karo (ek array + `.map()` — Module 9 recap — se bhi kar sakte ho).
- Destructuring use karo component ke parameter me.
- Kam se kam ek prop ke liye default value do (jaise agar `imageUrl` na ho, ek placeholder image dikhe).

## 17. Summary

Is module me humne React ke **Components aur Props** — sabse frequently-used concepts — practically seekhe. Components banana, **`export default`** se export karna, aur **Rendering** ka basic matlab samjha. **Props** se data ek component se doosre me pass karna, JSX me `{}` curly braces se access karna, aur **same component ko multiple baar, different props ke saath reuse karna** seekha. **Default values** (`||` operator) se components ko robust banaya, aur **Destructuring** se code ko cleaner/professional banaya — ye sab React development ka daily-use foundation hai.

## 18. Keywords

Component, JSX, Rendering, export default, named export, import, Props, Properties, curly braces, camelCase (CSS-in-JS), Spread Operator, Default Prop Value, OR operator, Destructuring, PascalCase, Unidirectional Data Flow.

## 19. Tags
`#react` `#jsx` `#components` `#props` `#destructuring` `#default-values` `#frontend` `#intermediate`

## 20. Suggested Next Topics
- Conditional Rendering
- React Hooks — useState, useEffect

## 21. Related Topics
- Module 16: React Fundamentals (Virtual DOM, Component-Based Architecture)
- Module 9-11: JavaScript Objects, Destructuring, Spread Operator (directly reused here)
- React Hooks (where component data becomes dynamic/stateful, next module)

---
*End of Module 17. Continuing sequentially to Module 18: Conditional Rendering & React Hooks (useState, useEffect) in the next part.*
