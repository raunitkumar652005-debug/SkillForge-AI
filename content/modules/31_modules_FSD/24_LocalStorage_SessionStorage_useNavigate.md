# Module 24: Local Storage, Session Storage & useNavigate

---

## 1. Overview

Is module me **Browser Storage** — `localStorage` aur `sessionStorage` — cover kiya gaya, jo browser ke andar client-side data persist karne ke liye use hote hain (jaise login credentials remember rakhna). Instructor ne ek Login form example se `setItem`, `getItem`, `removeItem` methods practically dikhaye, DevTools ke **Application tab** se live values verify ki, aur Local vs Session Storage ka key behavioral difference demonstrate kiya. Module ke shuru me ek chhota lekin useful hook — **`useNavigate`** — bhi cover kiya gaya, jo button-click jaisi actions par programmatically navigate karne deta hai.

## 2. Prerequisites

- Module 23 (React Router) completed.
- Module 21 (useRef) completed — is module me forms `useRef` se handle kiye gaye hain.

## 3. Learning Objectives

- **`useNavigate`** hook se, button click jaise events par, programmatically doosre route pe navigate karna.
- **Browser Storage** ka concept samajhna — browser ke andar approximately **10 MB** ki ek dedicated space hoti hai data store karne ke liye.
- **`localStorage`** — permanent (tab/browser close hone par bhi persist karti) storage.
- **`sessionStorage`** — temporary (sirf tab open rehne tak persist karti) storage.
- `setItem()`, `getItem()`, `removeItem()` methods use karna.
- Chrome DevTools ke **Application tab** se stored values verify/inspect karna.
- Objects store karne ke liye `JSON.stringify()`/`JSON.parse()` ki zaroorat samajhna (storage sirf strings accept karta hai).

## 4. Cleaned Transcript (Hinglish)

**useNavigate Hook — Programmatic Navigation**

Pehle humne `Link` se navigation seekha tha (click karo, navigate ho jaao). Lekin kabhi-kabhi tumhe chahiye ki koi **action** (jaise button click, form submit) hone ke **baad**, code se hi navigate ho jaaye — iske liye **`useNavigate`** hook use hota hai:

```jsx
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate(); // must be defined at the TOP of the component

  function handleClick() {
    navigate("/about"); // navigates to /about programmatically
  }

  return <button onClick={handleClick}>Go to About</button>;
}
```
- `useNavigate` **React Router DOM se import** hota hai.
- Isse ek `navigate` variable milta hai (naam koi bhi rakh sakte ho) — ye ek **function** hai jise call karke, koi bhi path pass karke, us route pe navigate kiya ja sakta hai.
- **Important:** `useNavigate()` ko **hamesha component ke top pe** call karna hota hai (jaise saare hooks) — kisi function ke andar directly `useNavigate()` call nahi kar sakte.

---

**Browser Storage — The Concept**

Har browser ke paas **application ke liye ek dedicated space** hoti hai (approximately **10 MB**) jisme kuch data store kiya ja sakta hai. Real-world example: jab tumne kisi website pe pehli baar **login** kiya, aur agli baar visit karne pe **automatically login-details/session yaad rehta hai** — ye isi Browser Storage ki wajah se hota hai.

**Do types hote hain:**
- **`localStorage`** — Data **permanently** store hota hai — tab close karo, browser close karo, phir bhi data **wahi ka wahi rehta hai** jab tak explicitly delete na kiya jaaye.
- **`sessionStorage`** — Data sirf **temporary** rehta hai — **jaise hi tab close hota hai, data delete ho jaata hai**. Real-world example: **AWS** jaisi services har baar login maangti hain kyunki wo credentials ko `sessionStorage` me rakhti hain — tab close hote hi session khatam ho jaata hai, dobara login karna padta hai.

**Setting Values — setItem()**

```jsx
import { useRef } from "react";

function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("username", usernameRef.current.value);
    localStorage.setItem("password", passwordRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={usernameRef} placeholder="Username" />
      <input type="password" ref={passwordRef} placeholder="Password" />
      <button type="submit">Log In</button>
    </form>
  );
}
```
- **`localStorage.setItem(key, value)`** — Ek **key-value pair** ki tarah data store karta hai.
- Yahan `useRef` use kiya gaya form values access karne ke liye (Module 21 se) — production me `useState` se bhi kiya ja sakta hai.
- **Verify karne ka tareeka:** Chrome DevTools → **Inspect** → **Application** tab → left sidebar me **Local Storage** (browser ka URL select karke) — yahan **key-value pairs** ki tarah stored data dikhta hai.
- Instructor ne demo kiya: page refresh kiya, tab close karke dobara khola — **data wahi ka wahi tha** — confirm karta hai ki `localStorage` **permanent** hai.

**Getting Values — getItem()**

```javascript
const savedUsername = localStorage.getItem("username");
console.log(savedUsername); // retrieves the stored value
```

**Removing Values — removeItem()**

```jsx
function handleDelete() {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  alert("Account deleted successfully!");
}
```
```jsx
<button onClick={handleDelete}>Delete Account</button>
```
- **`removeItem(key)`** — Specific key (aur uski value) ko storage se **delete** kar deta hai.
- Demo me delete button click karne par, DevTools me values **turant gayab** hoti dikhi.

**sessionStorage — Same Methods, Different Persistence**

`sessionStorage` ke **methods bilkul same** hain — `setItem()`, `getItem()`, `removeItem()`:
```javascript
sessionStorage.setItem("username", usernameRef.current.value);
```
- Demo: `sessionStorage` me value set karke, **same tab me refresh** kiya — value **bani rahi**. Lekin tab **close karke naya tab khola** — DevTools me `sessionStorage` **khaali** dikha, jabki `localStorage` me data **abhi bhi tha**.
- **Key Takeaway:** `sessionStorage` ki lifetime **exactly tab tak hai jab tak tab open hai** — tab close hote hi memory clear ho jaati hai.

**Important Limitation — Only Strings**

`localStorage`/`sessionStorage` **sirf string values** store kar sakte hain — directly koi Object nahi daala ja sakta. Agar ek poora **Object** store karna ho:
```javascript
const user = { name: "Karan", age: 25 };

// Storing an object - must convert to a string first
localStorage.setItem("user", JSON.stringify(user));

// Retrieving it - must convert back to an object
const retrievedUser = JSON.parse(localStorage.getItem("user"));
console.log(retrievedUser.name); // "Karan"
```
- **`JSON.stringify()`** — Object ko ek **String** me convert karta hai (storage ke liye).
- **`JSON.parse()`** — Wapas String ko **Object** me convert karta hai (retrieval ke liye).

**Real-World Context (Preview of Future Modules)**

Instructor ne mention kiya ki abhi is storage ka **directly practical fayda kam** dikh raha hai, lekin jab **Backend (future modules)** aayega, tab ye bahut important ho jaayega — jaise ek user login karega, backend ek **"secret" (token — future JWT module)** dega, jise `localStorage`/`sessionStorage` me store karke, user ko baar-baar login kiye bina **authenticated rakha** ja sakega.

## 5. Beginner Explanation

Socho browser ke andar do tarah ke "diary" hain jaha tum notes likh sakte ho. Ek diary **permanent** hai (`localStorage`) — usme jo likha wo hamesha rahega, chahe tum kitni baar bhi kitaab band-khol lo. Doosri diary **temporary** hai (`sessionStorage`) — jaise ek **whiteboard** jise tum session ke end me (tab close karte hi) automatically mita dete ho.

## 6. Technical Explanation

`localStorage` aur `sessionStorage` — dono **Web Storage API** (browser-native) ka part hain, jo har origin (domain) ke liye **isolated, key-value storage** provide karti hai:
- **`localStorage`** — Data **no expiration date** ke saath persist karta hai — explicit `removeItem()`/`clear()` ya user ke browser data clear karne tak rehta hai.
- **`sessionStorage`** — Data **sirf current browser tab/window session** ke liye scoped hai — tab close hone par automatically clear ho jaata hai (naya tab bhi ek **naya session** treat hota hai, chahe same website ho).

Dono APIs **synchronous** hain (unlike `IndexedDB`, jo asynchronous hai) — chhote amounts of data (jaise ~10MB tak) ke liye suitable hain, bade datasets ke liye nahi.

**Data sirf strings ke roop me store hoti hai** — ye ek fundamental limitation hai Web Storage API ki. Complex data types (Objects, Arrays) ko store karne ke liye **serialization** (`JSON.stringify()`) aur **deserialization** (`JSON.parse()`) zaroori hai.

## 7. Examples & Code

**Example 1 — useNavigate on Button Click**
```jsx
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/profile")}>
      View Profile
    </button>
  );
}
```

**Example 2 — Saving and Retrieving a User Preference**
```javascript
// Save
localStorage.setItem("theme", "dark");

// Retrieve
const theme = localStorage.getItem("theme");
console.log(theme); // "dark"
```

**Example 3 — Storing an Object with JSON methods**
```javascript
const settings = { fontSize: 16, darkMode: true };
localStorage.setItem("settings", JSON.stringify(settings));

const savedSettings = JSON.parse(localStorage.getItem("settings"));
console.log(savedSettings.fontSize); // 16
```

**Example 4 — sessionStorage for Temporary Data**
```javascript
sessionStorage.setItem("cartId", "temp-12345");
// This will disappear once the browser tab is closed
```

## 8. Line-by-Line Explanation

Using **Example 3**:
1. `const settings = { fontSize: 16, darkMode: true };` — Ek normal JavaScript object banaya.
2. `localStorage.setItem("settings", JSON.stringify(settings));` — `JSON.stringify(settings)` object ko ek string me convert karta hai (jaise `'{"fontSize":16,"darkMode":true}'`), jise `setItem` ke through key `"settings"` ke saath store kiya.
3. `const savedSettings = JSON.parse(localStorage.getItem("settings"));` — `getItem("settings")` se wo stored **string** wapas mili; `JSON.parse()` usse wapas ek **actual JavaScript object** me convert kar deta hai.
4. `console.log(savedSettings.fontSize);` — Ab `savedSettings` ek normal object hai, uski `fontSize` property directly access ki ja sakti hai.

## 9. Common Mistakes

- Directly ek Object ko `setItem()` me pass karna (bina `JSON.stringify()` ke) — ye automatically **`"[object Object]"`** jaisa ek useless string store kar dega, actual data nahi.
- `sessionStorage` ko `localStorage` ki tarah "permanent" expect karna — tab close hote hi data gayab ho jaata hai, ye common confusion hai.
- `getItem()` se ek object retrieve karne ki koshish karna bina `JSON.parse()` ke — result ek raw string milegi, usable object nahi.
- `useNavigate()` ko component ke **top ke bajaye kisi function ke andar** call karna — Hooks rules violate karta hai.
- Sensitive data (jaise raw passwords) ko directly `localStorage` me plain-text me store karna — production me ye **major security risk** hai.

## 10. Best Practices

- **Temporary, session-specific data** (jaise ek form ka draft, ek temporary cart ID) ke liye `sessionStorage` use karo.
- **Long-term preferences ya non-sensitive persistent data** (jaise theme preference, "remember me" flags) ke liye `localStorage` use karo.
- Objects/Arrays store karte waqt **hamesha `JSON.stringify()`/`JSON.parse()`** use karo.
- **Sensitive credentials** (passwords, tokens) ko directly plain-text me `localStorage` me store karna avoid karo — production apps me encrypted tokens ya secure `httpOnly` cookies (future Auth module) prefer kiye jaate hain.
- Storage operations ko `try-catch` (Module 12) me wrap karna best practice hai — storage full ho sakta hai ya browser settings se disabled ho sakta hai.

## 11. Performance Tips

- Web Storage APIs **synchronous** hain — bahut bade data ko baar-baar read/write karna (especially loops ke andar) **main thread ko block** kar sakta hai; bade/complex data ke liye `IndexedDB` (asynchronous) better suited hai.
- ~10MB ki limit hone ki wajah se, storage ko sirf **essential, small data** ke liye use karo, bade datasets ke liye nahi.

## 12. Security Notes

- **`localStorage`/`sessionStorage` XSS (Cross-Site Scripting) attacks ke against protected nahi hain** — agar attacker kisi tarah malicious script inject kar de, wo directly `localStorage` ka data read kar sakta hai. Isliye **highly sensitive data** (jaise raw passwords, long-lived auth tokens) ko yaha store karna risky consider kiya jaata hai — production apps me `httpOnly` cookies (jo JavaScript se access nahi ho sakti) zyada secure alternative hain (future Auth/JWT module me detail se).
- Passwords ko **kabhi bhi plain-text me** kisi bhi client-side storage me rakhna best practice violate karta hai — hamesha backend pe hashing (bcrypt, future module) use karna chahiye, aur frontend storage sirf tokens/session-identifiers ke liye reserve karna chahiye.

## 13. Interview Questions

1. `localStorage` aur `sessionStorage` me kya fundamental difference hai?
2. Browser Storage ki approximate size limit kya hoti hai?
3. `setItem()`, `getItem()`, aur `removeItem()` ka kya-kya role hai?
4. Kya directly ek JavaScript Object ko `localStorage` me store kiya ja sakta hai? Agar nahi, toh kya karna padta hai?
5. `JSON.stringify()` aur `JSON.parse()` ka use kaha hota hai storage ke context me?
6. `useNavigate` hook kya karta hai, aur ye `Link` component se kaise different hai?
7. Kya `localStorage` XSS attacks se safe hai? Explain karo.

## 14. Practice Questions

1. Ek login form banao jo `localStorage` me username/password save kare, `useRef` se.
2. Ek "Delete Account" button banao jo `localStorage.removeItem()` se data clear kare.
3. Ek object ko `sessionStorage` me store karo aur wapas retrieve karke uski ek property print karo.
4. Do tabs khol ke test karo ki `sessionStorage` ka data dono tabs me share hota hai ya nahi.

## 15. Coding Exercises

**Exercise 1:** Theme Preference Saver
- Ek button banao jo click hone pe `localStorage` me `"theme": "dark"` set kare, aur page reload hone par bhi wo value persist rahe (verify DevTools se).

**Exercise 2:** Session-Based Cart
- `sessionStorage` use karke ek temporary "cart item count" store karo — verify karo ki naya tab kholne pe ye reset ho jaata hai.

**Exercise 3:** Object Storage Round-Trip
- Ek user profile object (`{name, email, age}`) ko `localStorage` me store karo `JSON.stringify()` se, phir retrieve karke `JSON.parse()` se wapas object banao aur saari properties print karo.

## 16. Mini Projects

**Mini Project: Persistent Login Simulator**
- Ek Login form banao (`useRef` se username/password).
- Submit hone par `localStorage.setItem()` se credentials save karo.
- Ek "Welcome back, {username}!" message dikhao agar `localStorage` me already koi username saved hai (page load par `useEffect` + `getItem()` se check karo).
- Ek "Logout" button banao jo `removeItem()` se data clear kare aur `useNavigate()` se Home page pe redirect kare.

## 17. Summary

Is module me humne **`useNavigate`** hook seekha — programmatic navigation ke liye (button clicks jaise actions ke baad route change karna). Phir **Browser Storage** ka core concept seekha: **`localStorage`** (permanent, tab/browser close hone par bhi persist) vs **`sessionStorage`** (temporary, sirf tab open rehne tak) — dono ke methods same hain: `setItem()`, `getItem()`, `removeItem()`. Humne Chrome DevTools ke **Application tab** se live values verify karna seekha, aur samjha ki Objects store karne ke liye `JSON.stringify()`/`JSON.parse()` zaroori hai kyunki storage sirf strings accept karta hai. Ye foundation future **Authentication (JWT)** modules ke liye crucial hai.

## 18. Keywords

useNavigate, programmatic navigation, Browser Storage, localStorage, sessionStorage, setItem, getItem, removeItem, Application tab, DevTools, JSON.stringify, JSON.parse, Web Storage API, permanent storage, temporary storage.

## 19. Tags
`#react` `#local-storage` `#session-storage` `#usenavigate` `#web-storage-api` `#browser-storage` `#intermediate`

## 20. Suggested Next Topics
- Git & GitHub (immediately follows in the transcript)
- Authentication — JWT, Cookies, bcrypt (future full backend modules)

## 21. Related Topics
- Module 23: React Router (useNavigate is part of react-router-dom)
- Module 21: useRef (used here for form handling)
- Module 12: JSON, try-catch (JSON.stringify/parse recap)
- Authentication & JWT (future — where storage becomes critical for session management)

---
*End of Module 24. Continuing sequentially to Module 25: Redux — Global State Management in the next part.*
