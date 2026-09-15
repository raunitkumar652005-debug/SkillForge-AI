# Module 23: React Router — Multi-Page Navigation

---

## 1. Overview

Is module me **React Router** cover kiya gaya — ek essential library jo React apps (jo fundamentally **Single Page Applications/SPA** hote hain) me **multi-page-jaisa navigation** enable karti hai. Instructor ne pehle dikhaya ki **anchor tag/bookmark-based navigation** (`href="#sectionId"`) kyun ek **real solution nahi hai** (Wikipedia ke real URL-based routing se contrast karke), phir **`react-router-dom`** install karke `BrowserRouter`, `Routes`, `Route`, aur `Link` components ka practical setup dikhaya.

## 2. Prerequisites

- Module 16-22 (React Fundamentals through Lifting State/Prop Drilling) completed.
- Module 19 (Project Structure — pages folder) ka concept.

## 3. Learning Objectives

- Samajhna ki React apps **Single Page Applications (SPA)** kyun hote hain, aur isse navigation me kya challenge aata hai.
- **Bookmark/Anchor-tag navigation** (`#id`) ki limitations samajhna — kyun ye "true routing" nahi hai.
- **`react-router-dom`** library install karna.
- **`BrowserRouter`** se poore app ko routing-capable banana.
- **`Routes`** aur **`Route`** (with `path` aur `element`) se URL paths ko specific components se map karna.
- **`Link`** component se navigation karna (anchor tag ke bajaye).
- Dynamic/conditional logic se **active link styling** implement karna.

## 4. Cleaned Transcript (Hinglish)

**The Problem — React is a Single Page Application (SPA)**

React apps **Single Page Application (SPA)** hote hain — matlab poori app ka **sirf ek hi HTML page** hota hai (`index.html`). Traditional multi-page websites ki tarah tum **alag-alag HTML pages** (Home.html, About.html) nahi bana sakte React me — sab kuch ek hi page ke andar, JavaScript se dynamically render hota hai.

**Why Anchor Tags/Bookmarks Aren't a Real Solution**

Instructor ne pehle **anchor-tag-based navigation** try kiya (jaise Module 2 me `target` attribute ke context me seekha tha) — sections ko `id` diya, aur navigation links ko `href="#sectionId"` diya, taaki click karne par same page ke andar us section tak "jump" ho jaaye.

**Comparison with Real Routing — Wikipedia Example**

Wikipedia (jo React se nahi bani) pe "India" search karne se URL kuch aisa dikhta hai jisme **"India" clearly path me shamil hai**, aur agar URL ko manually "China" ya "Nepal" me change kiya jaaye, **content bhi accordingly badal jaata hai** — **bina kisi `#` (hash) symbol ke**. Ye **real/proper routing** hai — content **URL ke behalf pe** control hota hai.

Jabki anchor-tag/bookmark approach me URL me ek **`#` (hash)** add ho jaata hai (jaise `yoursite.com/#login`) — ye batata hai ki tum sirf ek **ID ko target** kar rahe ho, wahi single page ke andar — ye **true routing nahi hai**.

**Conclusion:** Anchor tag/Bookmark approach single-page ke andar quick-jump ke liye theek hai, lekin **proper multi-page-jaisa navigation ke liye ye solution nahi hai**.

**The Solution — react-router-dom**

```bash
npm install react-router-dom
```
- Ye ek **library** hai jo React apps ko **routing facility** deti hai.
- Install hone ke baad, ye tumhari `package.json` file me dependency ki tarah add ho jaati hai.

**Step 1 — Wrap the App with BrowserRouter (in main.jsx)**

```jsx
// main.jsx
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

<Router>
  <App />
</Router>
```
- **`BrowserRouter`** ko `Router` naam se import kiya gaya (`as Router` — ek alias diya, koi bhi naam de sakte ho).
- Poore `App` component ko `<Router>` ke andar wrap kiya — isse **poori app me routing ki facility support hone lagti hai**, kyunki `App` hi tumhare application ka **main entry point** hai.

**Step 2 — Define Routes (in App.jsx)**

```jsx
// App.js
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Media from "./pages/Media";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/media" element={<Media />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
```
- **`Routes`** — Ek wrapper hai jiske andar **saare individual `Route` definitions** rehte hain — jaise ek highway jisme bahut saare individual roads (routes) hote hain.
- **`Route`** — Ek single mapping define karta hai: **`path`** (URL ka wo hissa jispe ye route match hoga) aur **`element`** (kaunsa component render hona chahiye us path pe).
- Jab URL me `/about` type kiya jaata hai, sirf `About` component render hota hai — baaki kuch nahi (poora page-jaisa dedicated view milta hai, `#` waale hash-jump se bilkul different).

**Testing It — Direct URL Navigation**

Instructor ne demo kiya: browser me directly URL me `/media` type karke Enter dabaya — sirf Media component render hua. `/about` type kiya — sirf About render hua. Ye confirm karta hai ki **URL ke behalf pe content control ho raha hai**, jaisa Wikipedia me tha — na ki sirf ek hash-based jump.

**Step 3 — Navigation with `Link` (Instead of `<a>` tags)**

React Router me links banane ke liye **anchor tag (`<a>`) use nahi karte** — iske bajaye **`Link`** component use hota hai:

```jsx
import { Link } from "react-router-dom";

<ul className={styles.navItems}>
  <li className={styles.navItem}>
    <Link to="/">Home</Link>
  </li>
  <li className={styles.navItem}>
    <Link to="/about">About</Link>
  </li>
  <li className={styles.navItem}>
    <Link to="/media">Media</Link>
  </li>
</ul>
```
- **`Link`** ko `react-router-dom` se **import** karna padta hai.
- `<a>` tag ke `href` attribute ki jagah, `Link` ka attribute hai **`to`** — jisme wo path diya jaata hai jaha navigate karna hai.
- **Important:** `Link` internally CSS ke through **anchor tag ki tarah hi accessible/style hota hai** (browser DevTools me inspect karne par `<a>` tag hi dikhega), lekin behavior different hai — ye **poora page reload nahi karta** (jabki normal `<a>` tag page reload karta), sirf React ke andar hi component switch karta hai — isliye **fast aur smooth navigation** milta hai.

**Making Navigation Dynamic (Using the nav-items Array)**

Agar navigation items ek **array** se `.map()` karke generate ho rahe hon (jaisa Module 3-4 me navbar banate waqt seekha tha):

```jsx
const navItems = ["Home", "About", "Media", "Services", "Login"];

<ul className={styles.navItems}>
  {navItems.map((item, idx) => (
    <li key={idx} className={styles.navItem}>
      <Link to={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}>
        {item}
      </Link>
    </li>
  ))}
</ul>
```
- `to={...}` me ek **ternary condition** use ki gayi: agar item `"Home"` hai, path `/` (root) hoga; warna path `/itemNameInLowerCase` banega (jaise `/about`, `/media`).
- Ye special-casing zaroori thi kyunki **Home ka route default `/`** hai, na ki `/home` — baaki sab items ka route unke apne naam se automatically match ho jaata hai (`item.toLowerCase()`).

## 5. Beginner Explanation

Socho tumhare paas ek **magic building** hai jisme sirf **ek hi darwaza (entrance)** hai (Single Page Application) — lekin andar bahut saare **alag-alag rooms** (Home, About, Media) hain. Pehle tum sirf ek room ke andar "jump" kar sakte the (bookmark/`#`), poora building navigate nahi kar sakte the properly. **React Router** ek "smart directory board" jaisa hai — jab tum kisi specific room ka naam (URL) bolte ho, wo tumhe seedha us room me le jaata hai — bina poore building ko dobara banaye (page reload) — bas andar ka scene change ho jaata hai.

## 6. Technical Explanation

React apps SPA (Single Page Application) hote hain — matlab server sirf **ek baar** ek single `index.html` serve karta hai, aur uske baad **saara navigation client-side JavaScript se handle hota hai**, bina server ko dobara request bheje.

**`react-router-dom`** browser ki **History API** (`pushState`, `popState`) leverage karta hai — jab `Link` pe click hota hai, ye:
1. Browser ke **URL bar ko update** karta hai (bina page reload trigger kiye).
2. Current URL ke basis pe, matching `Route` ka **`element`** render karta hai.
3. Browser ke **back/forward buttons** bhi automatically kaam karte hain (History API ki wajah se).

`BrowserRouter` internally React **Context API** (future advanced topic) use karta hai taaki poori app ke components ko current URL/location ka access mil sake, bina explicit props pass kiye.

`Routes` component apne andar diye gaye `Route`s ko scan karta hai aur **pehla matching path** dhoondh ke uska `element` render karta hai — is matching algorithm ko samajhna advanced routing (nested routes, wildcards) ke liye important hai (future topic).

## 7. Examples & Code

**Example 1 — Complete Basic Setup**
```jsx
// main.jsx
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);
```
```jsx
// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
export default App;
```

**Example 2 — Navbar with Link**
```jsx
// Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
export default Navbar;
```

**Example 3 — Dynamic Nav Items from an Array**
```jsx
const pages = ["Home", "About", "Contact"];

<nav>
  {pages.map((page) => (
    <Link key={page} to={page === "Home" amp;amp; "/" || `/${page.toLowerCase()}`}>
      {page}
    </Link>
  ))}
</nav>
```

## 8. Line-by-Line Explanation

Using **Example 1**:
1. `import { BrowserRouter as Router } from "react-router-dom";` — `BrowserRouter` ko import kiya, `Router` alias diya.
2. `<Router><App /></Router>` — Poori `App` ko `Router` ke andar wrap kiya — ab poori app routing-aware hai.
3. `import { Routes, Route } from "react-router-dom";` (App.jsx me) — Routing components import kiye.
4. `<Routes>` — Saare routes ka container/wrapper.
5. `<Route path="/" element={<Home />} />` — Jab URL **root** (`/`) ho, `Home` component render hoga.
6. `<Route path="/about" element={<About />} />` — Jab URL `/about` ho, `About` component render hoga.
7. `<Navbar />` — `Routes` ke bahar rakha gaya, kyunki Navbar **har page pe hamesha dikhna chahiye** (routes ke change hone se independent).

## 9. Common Mistakes

- `App` ko `BrowserRouter` ke andar wrap karna **bhool jaana** — bina iske, `Link`/`Route` jaisi koi bhi routing feature kaam nahi karegi (error aayega).
- `Route` me `path` aur `element` dono dena zaroori hai — koi ek missing hone se route kaam nahi karega.
- `Link` ki jagah galti se `<a href="...">` use kar lena — ye technically kaam toh karega, lekin **poora page reload** kar dega, jo SPA ke performance benefits ko defeat kar deta hai.
- `.map()` se navigation items generate karte waqt **`key` prop dena bhool jaana** — React warning dega.
- "Home" route ke liye `/home` path expect karna — actually Home ka default route **`/`** (root) hota hai, special-case handle karna padta hai.
- Bookmark/anchor-tag approach ko "routing" samajh lena — ye sirf same-page section-jump hai, true multi-view routing nahi.

## 10. Best Practices

- Navigation (`Navbar`) ko `Routes` ke **bahar** rakho agar wo har page pe consistently dikhna chahiye.
- Route paths **lowercase, hyphen-separated** convention follow karo (`/about-us`, na ki `/AboutUs`) — URL conventions ke liye standard practice.
- Bade apps me routes ko ek **centralized, organized structure** me rakho (jaise ek alag `routes.js` file) — maintainability ke liye.
- Hamesha `Link` use karo internal navigation ke liye, `<a>` tags sirf **external links** (doosri websites) ke liye reserve karo.

## 11. Performance Tips

- `react-router-dom` se navigation **client-side** hoti hai — koi full-page reload nahi hota, isliye traditional multi-page sites se **significantly fast** feel hota hai.
- Bade apps me, routes ko **lazy-load** karna (`React.lazy()` — advanced topic) initial load time ko improve kar sakta hai, kyunki sirf current route ka code load hota hai, poori app ka nahi.

## 12. Security Notes

- Client-side routing **koi security boundary nahi hai** — sirf kisi route ko "hide" karna (jaise `/admin`) uski **actual protection nahi** hai; kisi bhi protected route ka actual access-control **backend/authentication logic** (future JWT module) se enforce karna zaroori hai, na ki sirf routing se.

## 13. Interview Questions

1. React app ko "Single Page Application (SPA)" kyun kaha jaata hai?
2. Anchor-tag/Bookmark-based navigation "real routing" kyun nahi hai?
3. `react-router-dom` install karne ke baad, poori app ko routing-capable banane ke liye kya karna padta hai?
4. `Routes` aur `Route` me kya-kya role hai?
5. `Link` component `<a>` tag se kaise different hai (behavior ke terms me)?
6. `BrowserRouter` internally browser ke kis feature ko leverage karta hai?

## 14. Practice Questions

1. `react-router-dom` install karne ka command likho.
2. Ek `BrowserRouter` setup likho jo `App` ko wrap kare.
3. 3 routes define karo (`/`, `/about`, `/contact`) unke respective components ke saath.
4. Ek Navbar banao `Link` components se, jo in teeno routes ko link kare.

## 15. Coding Exercises

**Exercise 1:** Multi-Page Portfolio
- `react-router-dom` use karke ek 3-page portfolio banao: Home, Projects, Contact — sabka apna route ho.

**Exercise 2:** Dynamic Nav from Array
- Ek array se (`["Home", "Projects", "Contact"]`) `.map()` use karke Navbar links generate karo, "Home" ke liye special-case (`/`) handle karte hue.

**Exercise 3:** Direct URL Test
- App run karke browser me directly `/projects` type karke test karo ki sahi component load hota hai bina Navbar click kiye.

## 16. Mini Projects

**Mini Project: Multi-Page Company Website**
- Pages: Home, About, Services, Contact — har ek apni `pages/` folder me component.
- `BrowserRouter` + `Routes` + `Route` se poora setup karo.
- `Navbar` (`components/` folder me) banao jo `Link` se saare pages ko connect kare.
- Verify karo ki direct URL navigation (address bar me type karke) bhi kaam karta hai.

## 17. Summary

Is module me humne **React Router** (`react-router-dom`) seekha — React apps (jo fundamentally Single Page Applications hote hain) me **multi-page-jaisa, URL-driven navigation** enable karne ka standard tareeka. Humne samjha ki anchor-tag/bookmark approach (`#id`) **real routing nahi hai** (Wikipedia se comparison karke). Practical setup dekha: **`BrowserRouter`** se poori app ko wrap karna, **`Routes`**/**`Route`** (with `path` aur `element`) se URL-to-component mapping define karna, aur **`Link`** component se (anchor tag ke bajaye) client-side, no-reload navigation implement karna.

## 18. Keywords

React Router, react-router-dom, Single Page Application (SPA), BrowserRouter, Routes, Route, path, element, Link, History API, client-side navigation, anchor tag, bookmark navigation, hash routing.

## 19. Tags
`#react` `#react-router` `#spa` `#navigation` `#routing` `#frontend` `#intermediate`

## 20. Suggested Next Topics
- Redux / Global State Management
- Local Storage & Session Storage

## 21. Related Topics
- Module 19: React Project Structure (pages folder — routes map directly to these)
- Module 17: Components & Props
- Module 22: Lifting State/Prop Drilling (Router often connects with app-wide state needs)

---
*End of Module 23. Continuing sequentially to Module 24: Local Storage & Session Storage in the next part.*
