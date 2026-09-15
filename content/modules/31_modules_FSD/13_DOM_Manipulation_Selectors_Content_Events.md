# Module 13: DOM Manipulation — Selectors, Content Changes & Basic Events

---

## 1. Overview

Is module me HTML, CSS, aur JavaScript **teeno ek saath** kaam karte hue dikhaye gaye — jise instructor "puri series ka meaningful moment" kehte hain. **DOM (Document Object Model)** ka concept detail se samjhaya gaya (ek tree-like structure jisme poora HTML document represent hota hai), phir **selectors** (`getElementById`, `getElementsByClassName`, `getElementsByTagName`, `querySelector`) aur **content-changing methods** (`innerHTML`, `innerText`) practically use karke dikhaye gaye, saath hi ek halka introduction diya gaya **event handling** (`onclick`) ka, ek Turn-On/Turn-Off bulb image-toggle example ke through.

## 2. Prerequisites

- Module 1-2 (HTML) aur Module 3-4 (CSS) completed hone chahiye.
- Module 5-12 (JavaScript fundamentals through built-in objects) completed hone chahiye.

## 3. Learning Objectives

- **DOM (Document Object Model)** kya hota hai, samajhna — HTML document ka tree-like, browser-object representation.
- CSS selectors (id/class/tag) ki tarah, JS me bhi **selectors** ka concept samajhna.
- `document.getElementById()`, `document.getElementsByClassName()`, `document.getElementsByTagName()`, aur `document.querySelector()` use karna.
- **`innerHTML`** vs **`innerText`** ka difference samajhna — kaunsa HTML tags ko parse karta hai, kaunsa nahi.
- Internal JavaScript (`<script>` tag) vs External JavaScript (`.js` file link karna) ka difference samajhna.
- Basic **Event Handling** — `onclick` attribute se function ko button-click pe trigger karna.
- `setAttribute()` method se HTML attributes (jaise image `src`) ko dynamically change karna.

## 4. Cleaned Transcript (Hinglish)

**What is the DOM?**

Jab bhi ek website (jaise Amazon) pe koi button click karta hai aur uska result "ON/OFF" ki tarah change hota hai, ye hota kaise hai? Isko samajhne ke liye **DOM (Document Object Model)** ka concept zaroori hai.

Har HTML document, browser ke liye ek **tree-like structure** banata hai:
```
HTML (root)
├── HEAD
│   ├── TITLE
│   └── STYLE
└── BODY
    ├── PARAGRAPH
    ├── DIV
    │   └── PARAGRAPH
    └── ...
```
- **DOM** ka matlab hai **Document Object Model** — "**Document**" (HTML document), "**Object**" (browser is document ko ek object ki tarah treat karta hai), "**Model**" (uska structure/representation kaisa dikhta hai).
- Ye tree structure isliye important hai kyunki JavaScript isi tree ko navigate/select/modify karke webpage ko dynamically change karta hai.

**How to Write JavaScript in an HTML file**

Do tareeke hain:
1. **Internal JavaScript** — HTML file ke andar hi, **end me** (before closing `</body>`), ek `<script>` tag ke andar JavaScript likhna.
2. **External JavaScript** — Ek alag `.js` file banake, use HTML file me `<script src="filename.js"></script>` se link karna (jaise CSS ke liye `<link>` tag hota hai).

**Selectors — Selecting HTML Elements**

Jaise CSS me ID, class, ya tag se select karte the, waise hi JavaScript me bhi **selectors** hote hain — koi bhi element ko change karne se pehle use **select** karna padta hai:

```javascript
// 1. Select by ID (most common)
let para = document.getElementById("para");

// 2. Select by Class Name (returns a collection of elements)
let items = document.getElementsByClassName("item");

// 3. Select by Tag Name (returns a collection of elements)
let allParagraphs = document.getElementsByTagName("p");

// 4. Query Selector (works like CSS selectors: #id, .class, tagname)
let selected = document.querySelector("#para"); // or ".item" or "p"
```
- `document` — Ye **hamesha likhna padta hai**, kyunki ye poora HTML document represent karta hai jise select karna hai.
- **`getElementById()`** — Ek **naming convention** follow karta hai jise **lower camelCase** kehte hain (har word ke baad next word ka first letter capital) — sabse common aur direct selector, ek single element return karta hai.
- **`getElementsByClassName()` / `getElementsByTagName()`** — "Elements" (plural) — multiple elements return kar sakte hain (ek collection/array-like object).
- **`querySelector()`** — Sabse flexible, CSS-jaisi syntax use karta hai (`#id`, `.class`, `tagname`) — sirf **pehla matching element** return karta hai.

**Verifying Selection**
```javascript
console.log(para); // prints the ENTIRE selected element (with its content, tags, etc.)
```

**Changing Content — innerHTML vs innerText**

Ek baar element select ho jaaye, uska content change karne ke **do main methods** hain:

**1. `innerHTML`** — Element ke andar ki content ko **poori tarah replace** kar deta hai, aur agar naye HTML tags diye jaayein, **wo bhi parse/render** honge:
```javascript
para.innerHTML = "<h1>Hi Learners!</h1>"; // The <h1> tag WILL be rendered as an actual heading
```

**2. `innerText`** — Sirf **plain text** set karta hai — agar tum HTML tags likho bhi, wo **as-it-is text** ki tarah dikhengi, render nahi hongi:
```javascript
para.innerText = "Hi Class"; // Only sets text, no HTML parsing
```

**Key Difference:**
| Method | HTML Tags Parse Hote Hain? |
|---|---|
| `innerHTML` | ✅ Haan — agar tags diye, wo render honge |
| `innerText` | ❌ Nahi — sirf plain text set hota hai |

(Instructor ne ye bhi mention kiya ki ek teesra similar method **`textContent`** bhi hota hai, jo CSS-hidden text ko bhi include karta hai — is fine-grain difference ko self-explore karne ki advice di gayi.)

**Basic Event Handling — onclick**

Content ko **automatically** change karne ke bajaye, agar hum chahte hain ki wo **button click hone par** change ho, tab **Event Handling** chahiye hoti hai:

```html
<button onclick="changeContent()">Change Content</button>
```
```javascript
function changeContent() {
    para.innerText = "Hi Class!";
}
```
- `onclick="functionName()"` — HTML attribute jo batata hai ki us button pe click hone par **kaunsa function call hoga**.
- Function alag se **define** karna zaroori hai (jaisa normal JavaScript function hota hai) — bina define kiye, sirf call karne se kuch nahi hoga.
- Instructor ne demo kiya ki agar `innerText` ki jagah `innerHTML` use kiya jaaye, aur value me HTML tags (`<h1>`) diye jaayein, tab wo **actual heading ki tarah render** honge, jabki `innerText` sirf plain text ki tarah dikhayega.

**Toggle Example — Two Buttons for Upper/Lower Case**
```html
<button onclick="upper()">UPPERCASE</button>
<button onclick="lower()">lowercase</button>
```
```javascript
function upper() {
    para.innerText = para.innerText.toUpperCase();
}

function lower() {
    para.innerText = para.innerText.toLowerCase();
}
```
Ye demonstrate karta hai ki kaise **String methods** (Module 12 se) aur **DOM manipulation** ko combine karke real interactivity banayi ja sakti hai.

**Changing Attributes — setAttribute() (Bulb On/Off Example)**

Real project example: Ek image thi jo bulb "ON" (glowing) dikhati thi, aur ek "OFF" (not glowing) — do alag image files. Do buttons the: "Turn On" aur "Turn Off". Image ka `src` attribute dynamically change karke ye achieve kiya gaya:

```html
<img id="bulb" src="bulb-off.png">
<button onclick="turnOn()">Turn On</button>
<button onclick="turnOff()">Turn Off</button>
```
```javascript
let bulb = document.getElementById("bulb");

function turnOn() {
    bulb.setAttribute("src", "bulb-on.png"); // changes the image's src attribute dynamically
}

function turnOff() {
    bulb.setAttribute("src", "bulb-off.png");
}
```
- **`setAttribute(attributeName, newValue)`** — Kisi bhi HTML element ke **kisi bhi attribute** ki value ko dynamically set/change karta hai — jaise `innerText` se text change hota hai, `setAttribute` se attributes (`src`, `href`, `class`, etc.) change hote hain.

**Important Note — DOM in Real-World Development**

Instructor ne clarify kiya ki DOM ko is tarah **directly manipulate karna real-world (React-based) development me commonly nahi hota** — React jaisa framework isko **optimized/automated tareeke se internally handle karta hai**. Ye topic isliye padhaya gaya taaki:
1. Fundamentals clear rahein (interview questions ke liye important).
2. Future me React seekhte waqt ye concept "meaningful" lage.

## 5. Beginner Explanation

DOM ko socho jaise ek **family tree** — HTML sabse upar (dada-dadi), phir head/body (parents), phir unke andar ke tags (children) — sab ek dusre se connected hain. Jab tum kisi ko "select" karte ho (jaise `getElementById`), tum us family tree me se ek specific member ko dhoondh rahe ho. Ek baar mil jaaye, tum unse baat kar sakte ho (unka content change kar sakte ho) — `innerHTML` se tum unka poora "look" badal sakte ho (naye tags ke saath), aur `innerText` se sirf unki "baat" (text) badal sakte ho.

## 6. Technical Explanation

**DOM (Document Object Model)** ek **platform-and-language-neutral interface** hai jo HTML/XML documents ko ek **tree/node-based structure** ki tarah represent karta hai, jisse programming languages (jaise JavaScript) is structure ko **read aur modify** kar sakein. Browser HTML parse karke ek in-memory DOM tree banata hai — JavaScript isi tree ke saath interact karta hai, actual HTML file ke saath nahi.

**Selector Methods — Performance & Return Types:**
- `getElementById()` — **Fastest**, ek single element (ya `null`) return karta hai, kyunki IDs unique hote hain.
- `getElementsByClassName()` / `getElementsByTagName()` — **Live HTMLCollection** return karte hain (agar DOM baad me change ho, ye collection automatically update hoti hai).
- `querySelector()` / `querySelectorAll()` — CSS selector syntax support karta hai, **static NodeList** return karta hai (`querySelectorAll` ke case me) — DOM change hone pe automatically update nahi hoti.

**`innerHTML` vs `innerText` vs `textContent`:**
- `innerHTML` — String ko **HTML parse karke** DOM me insert karta hai — agar untrusted user input yahan directly daala jaaye, ye **XSS (Cross-Site Scripting)** vulnerability create kar sakta hai.
- `innerText` — **CSS-aware** — sirf wahi text return/set karta hai jo actually visually render ho raha ho (hidden elements ka text ignore karta hai); ye layout ko trigger kar sakta hai (reflow), thoda slower.
- `textContent` — Saara text return karta hai (CSS-hidden text bhi included), aur `innerText` se **faster** hai kyunki ye layout-aware nahi hai.

## 7. Examples & Code

**Example 1 — Selecting and Reading an Element**
```html
<p id="greeting">Hello World</p>
```
```javascript
let greeting = document.getElementById("greeting");
console.log(greeting.innerText); // "Hello World"
```

**Example 2 — Changing Content Dynamically on Click**
```html
<p id="message">Original message</p>
<button onclick="updateMessage()">Update</button>
```
```javascript
let message = document.getElementById("message");

function updateMessage() {
    message.innerText = "Message has been updated!";
}
```

**Example 3 — innerHTML Rendering Tags**
```javascript
let container = document.getElementById("container");
container.innerHTML = "<strong>Bold Text</strong> and <em>Italic Text</em>";
// Renders actual bold and italic text, not the literal tags
```

**Example 4 — Bulb Toggle with setAttribute**
```html
<img id="bulbImg" src="off.png" width="100">
<button onclick="turnOn()">Turn On</button>
<button onclick="turnOff()">Turn Off</button>
```
```javascript
let bulbImg = document.getElementById("bulbImg");

function turnOn() {
    bulbImg.setAttribute("src", "on.png");
}
function turnOff() {
    bulbImg.setAttribute("src", "off.png");
}
```

## 8. Line-by-Line Explanation

Using **Example 4**:
1. `<img id="bulbImg" src="off.png" width="100">` — Ek image element, initial state "off" wali image dikhata hai, `id="bulbImg"` isko JS se select karne ke liye.
2. `<button onclick="turnOn()">Turn On</button>` — Button click hote hi `turnOn()` function call hoga.
3. `let bulbImg = document.getElementById("bulbImg");` — Image element ko select karke `bulbImg` variable me store kiya — ab is variable se image ko baar-baar access kiya ja sakta hai.
4. `function turnOn() { bulbImg.setAttribute("src", "on.png"); }` — Function define hua jo image ke `src` attribute ko `"on.png"` me change kar deta hai — browser turant naya image file load/display karega.
5. `function turnOff() { bulbImg.setAttribute("src", "off.png"); }` — Similarly, `src` ko wapas `"off.png"` pe set karta hai.
6. Jab user "Turn On" click karta hai, `turnOn()` chalta hai, image change ho jaati hai — koi page reload nahi hota, sab kuch **client-side JavaScript** se ho raha hai.

## 9. Common Mistakes

- `document` likhna bhool jaana selectors ke pehle (`getElementById(...)` directly likh dena) — `document.getElementById(...)` zaroori hai.
- `innerHTML` aur `innerText` ko interchangeably use karna, phir confuse hona ki HTML tags kabhi render hote hain kabhi nahi.
- Untrusted/user-input data ko directly `innerHTML` me daalna — XSS vulnerability create kar sakta hai.
- `getElementsByClassName()`/`getElementsByTagName()` ka result directly ek single element ki tarah use karne ki koshish karna — ye ek **collection** return karte hain, individual element access karne ke liye index (`[0]`) chahiye.
- `onclick` attribute me function ka naam **bina parentheses** likh dena galat context me, ya function ko define karna hi bhool jaana.
- Element select karne se **pehle** uska JavaScript code likhna (agar `<script>` tag `<body>` ke andar element se **upar** hai) — is case me element abhi DOM me exist hi nahi karta jab script run hoti hai, `null` milega.

## 10. Best Practices

- Jab bhi single, specific element select karna ho, `getElementById()` ya `querySelector()` prefer karo — fast aur predictable.
- User-generated/untrusted content ko `innerHTML` se inject karne se bachो — `innerText`/`textContent` use karo jab sirf text chahiye ho.
- `<script>` tag ko HTML body ke **end me** rakho (ya `defer` attribute use karo external scripts ke saath) — taaki poora DOM load ho chuka ho JS chalne se pehle.
- Meaningful IDs/classes do elements ko, taaki selectors readable aur maintainable rahein.
- Complex UI ke liye manual DOM manipulation ki jagah eventually React jaisa framework consider karo (jaisa instructor ne bhi mention kiya).

## 11. Performance Tips

- `getElementById()` sabse fast selector hai — agar ek hi element baar-baar access karna hai, use ek variable me store kar lo (jaisa `para`/`bulbImg` example me kiya gaya), baar-baar `document.getElementById()` call na karo.
- `innerHTML` se bada content set karna (especially baar-baar, loop ke andar) **reflow/repaint** trigger karta hai — performance-heavy operation hai; bade updates ko batch karo jaha possible ho.
- `getElementsByClassName`/`getElementsByTagName` ke "live" collections ko loop ke andar repeatedly access karna avoid karo — pehle ek array me convert kar lo agar multiple baar iterate karna hai.

## 12. Security Notes

- **`innerHTML` ke saath untrusted data kabhi mat use karo** — agar koi user-submitted string directly `innerHTML` me daali jaaye, attacker malicious `<script>` tags inject kar sakta hai (Cross-Site Scripting/XSS attack) — hamesha `innerText`/`textContent` use karo untrusted content ke liye, ya proper sanitization library use karo.
- `setAttribute()` se bhi careful raho agar attribute value user-controlled ho (jaise `href`, `src` — `javascript:` URLs inject ho sakte hain) — hamesha validate/sanitize karo.

## 13. Interview Questions

1. DOM kya hai? Full form aur matlab explain karo.
2. `getElementById()`, `getElementsByClassName()`, aur `querySelector()` me kya difference hai?
3. `innerHTML` aur `innerText` me kya fundamental difference hai?
4. `innerHTML` use karna security ke perspective se kab risky ho sakta hai?
5. `setAttribute()` method kya karta hai?
6. Internal aur External JavaScript me kya difference hai?
7. `onclick` attribute kaise kaam karta hai?
8. React jaisa framework DOM manipulation ko traditionally kaise different handle karta hai (conceptually)?

## 14. Practice Questions

1. Ek paragraph banao aur usse `getElementById()` se select karke uska text `innerText` se change karo, button click pe.
2. `innerHTML` use karke ek button click pe paragraph ke andar ek poora naya `<h2>` heading insert karo.
3. Do buttons banao jo ek image ke `src` attribute ko `setAttribute()` se alag-alag images me switch karein.
4. `getElementsByClassName()` use karke ek jaisi class waale multiple elements ko select karo aur console me print karo.

## 15. Coding Exercises

**Exercise 1:** Live Text Toggler
- Ek paragraph aur 2 buttons (Uppercase, Lowercase) banao jo text ko toggle karein `toUpperCase()`/`toLowerCase()` string methods se.

**Exercise 2:** Dynamic Image Switcher
- 3 images (day.png, evening.png, night.png) aur 3 buttons banao jo `setAttribute()` se ek hi `<img>` tag ka `src` change karein.

**Exercise 3:** innerHTML vs innerText Demo
- Ek hi paragraph pe do buttons banao — ek `innerHTML` se HTML tags insert kare, ek `innerText` se same string insert kare — visually difference observe karo.

## 16. Mini Projects

**Mini Project: Interactive Light Switch (Bulb On/Off)**
- Ek image element banao jo "bulb off" state dikhaye.
- Do buttons: "Turn On" aur "Turn Off".
- `getElementById()` se image select karo, aur `setAttribute()` se click hone par `src` ko toggle karo bulb-on/bulb-off images ke beech.
- Bonus: Ek status paragraph add karo jo `innerText` se "Bulb is ON" / "Bulb is OFF" dikhaye, jo bhi current state ho.

## 17. Summary

Is module me HTML, CSS, aur JavaScript **teeno combine** hokar real interactivity banate hue dikhaye gaye. **DOM (Document Object Model)** samjha — ek tree-like structure jisme browser HTML ko object ki tarah represent karta hai. **Selectors** (`getElementById`, `getElementsByClassName`, `getElementsByTagName`, `querySelector`) seekhe DOM elements ko target karne ke liye, aur **`innerHTML` vs `innerText`** ka crucial difference samjha (HTML-parsing vs plain-text). Basic **event handling** (`onclick`) aur **`setAttribute()`** se ek real bulb-toggle project banaya gaya, jo full-stack development ki practical foundation hai.

## 18. Keywords

DOM, Document Object Model, Tree Structure, Internal JavaScript, External JavaScript, Selector, getElementById, getElementsByClassName, getElementsByTagName, querySelector, innerHTML, innerText, textContent, onclick, Event Handling, setAttribute, XSS.

## 19. Tags
`#javascript` `#dom-manipulation` `#dom-selectors` `#innerhtml-innertext` `#event-handling` `#frontend` `#intermediate`

## 20. Suggested Next Topics
- DOM Events — Deep Dive (addEventListener, event object, more event types)
- Git & GitHub

## 21. Related Topics
- Module 12: JS Built-in Objects (String methods used in the toggle example)
- Module 1-4: HTML & CSS (structure/style being manipulated here)
- React.js (the modern, optimized alternative to direct DOM manipulation)

---
*End of Module 13. Continuing sequentially to Module 14: Git & GitHub in the next part.*
