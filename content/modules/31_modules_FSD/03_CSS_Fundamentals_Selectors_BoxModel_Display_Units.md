# Module 3: CSS Fundamentals — Selectors, Box Model, Display & Units

---

## 1. Overview

Is module me CSS (Cascading Style Sheets) ki practical foundation cover ki gayi hai. Instructor ne HTML file ko external `.css` file se **link** karna sikhaya, phir selectors (tag, class, universal), **Box Model** (width, height, padding, border, margin), **display property** (block vs inline vs inline-block), aur **box-sizing** jaisa crucial concept practically ek chalte-firte **navigation bar (navbar)** example ke through cover kiya — jo aage Module 5 (CSS Mini Project) me poora complete hoga.

## 2. Prerequisites

- Module 1 & 2 completed (HTML structure, tags, class attribute intro).
- Basic understanding ki `class` attribute HTML elements ko identify karta hai.

## 3. Learning Objectives

- External CSS file ko HTML se **link** karna (`<link>` tag).
- CSS **Selectors** ka use: tag selector, class selector (`.classname`), universal selector (`*`).
- **Box Model** ke sabhi parts samajhna: content, padding, border, margin.
- `width`, `height` properties aur units (px, %) samajhna.
- `display` property ke values: `block`, `inline`, `inline-block` ka behavior difference samajhna.
- `box-sizing: border-box` ka purpose samajhna.
- `text-align`, `border-radius`, `background-color` jaise common styling properties use karna.
- Multiple classes ek element pe apply karna.

## 4. Cleaned Transcript (Hinglish)

**Linking CSS to HTML**

CSS file ko HTML se connect karne ke liye `<head>` ke andar `<link>` tag use hota hai:
```html
<link rel="stylesheet" href="style.css">
```
Bina is link ke, CSS file me likhi properties HTML pe apply hi nahi hongi — instructor ne demo diya ki agar link nahi kiya, toh width/height jaisi properties diye hone ke bawajood browser me effect nahi dikhta.

**Display Property — Block vs Inline**

Har HTML element ka ek default `display` value hota hai:
- **Block-level elements** (jaise `<div>`) — poori available width le lete hain, hamesha naye line se start hote hain.
- **Inline elements** (jaise `<span>`) — sirf content jitni width lete hain, same line pe continue hote hain.

Demo: ek `<div class="container">` banaya gaya jisme heading (`<h1>`) aur paragraph (`<p>`) tha. `.container` class ko select karke:
```css
.container {
    text-align: center;
    padding: 10px;
    background-color: lightblue;
    border-radius: 10px;
}
```
- `text-align: center` — andar ka text horizontally center ho jaata hai.
- `padding` — content aur border ke beech internal spacing deta hai.
- `background-color` — element ka background color set karta hai.
- `border-radius` — corners ko round/circular bana deta hai.

Jab `display: inline` set kiya gaya, container ne poori width lena band kar diya aur sirf content jitni jagah li — lekin **width aur height properties inline elements pe kaam nahi karti** jab tak `display: inline-block` na set kiya jaaye.

**Box Model — Width, Height, Border, Content Overflow**

Jab content hata diya gaya aur sirf `width`/`height`/`border` diye gaye:
```css
.box {
    width: 500px;
    height: 100px;
    border: 1px solid red;
}
```
Observation: agar element ke parent ki width define nahi hai ya content available nahi hai, **percentage-based width** kabhi kabhi expected tarike se apply nahi hoti — is case me **fixed pixel units (px)** use karna zyada reliable hota hai jab tak parent context clear na ho.

**Universal Selector & box-sizing**

Browsers ke default me har element ke around kuch built-in margin/padding hoti hai. Ye extra unwanted spacing remove karne ke liye **universal selector** (`*`) use hota hai:
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
- `*` — website ke **saare** elements ko target karta hai.
- `margin: 0; padding: 0;` — browser ki default spacing reset karta hai.
- `box-sizing: border-box` — **important concept**: normally jab tum kisi box ki `width: 50px` set karte ho aur usme `padding`/`border` add karte ho, toh element ka total rendered size 50px se **badh jaata hai** (padding/border extra add hota hai). `box-sizing: border-box` set karne se padding aur border us defined width/height ke **andar hi adjust** ho jaate hain — total size same rehta hai. Isse layout predictable rehta hai.

**Navbar Example — Practical Application**

Ek real navigation bar banate hue in concepts ko combine kiya gaya:
```html
<nav>
    <ul class="left-nav-items">
        <li class="left-nav-item"><a href="#"><i class="fa fa-home"></i> Home</a></li>
        <li class="left-nav-item"><a href="#"><i class="fa fa-info-circle"></i> About</a></li>
        <li class="left-nav-item"><a href="#"><i class="fa fa-folder"></i> Projects</a></li>
        <li class="left-nav-item"><a href="#"><i class="fa fa-address-book"></i> Contact</a></li>
        <li class="left-nav-item"><a href="#"><i class="fa fa-user"></i> Login</a></li>
    </ul>
</nav>
```
Key points from this build:
- Icons Font Awesome (`fontawesome.com`) se search karke `<i>` tag ke through add kiye gaye, aur wahi behavior — icon ko `<a>` (anchor) tag ke **andar** rakhna zaroori hai taaki wo bhi clickable/link ho jaaye (agar icon anchor tag ke bahar rahega, wo link nahi banega aur click karne pe kuch nahi hoga).
- Har `<li>` ko `left-nav-item` class di gayi — **class selector** se sabhi list items ko ek saath style karne ke liye.
- **Multiple classes** ek element pe space se separate karke di ja sakti hain: `class="fifa solid fifa-house"` — isse ek element multiple CSS rules ko simultaneously inherit kar sakta hai.
- Navbar pe `border: 1px solid lightblue;` aur `padding: 10px;` apply karke usse polish kiya gaya. Extra unwanted top-space `*` selector se `margin/padding` reset karke fix kiya gaya.
- Font-size aur boldness `font-size` aur `font-weight` jaisi properties se adjust kiya gaya (example: `font-size: 18px` best dikha).
- Responsiveness (mobile-friendly banana) is stage pe abhi nahi kiya gaya — wo **agle module** (CSS Layout — Flexbox & Responsive Design) me cover hoga.

## 5. Beginner Explanation

CSS ko socho jaise ek makeup kit — HTML ne skeleton (structure) bana diya, ab CSS us skeleton ko sundar banata hai. Har HTML element ek invisible **box** hota hai — us box ke andar content hai, uske around padding (cushion) hai, uske around border (frame) hai, aur border ke bahar margin (outside spacing) hai. Ye poora concept **Box Model** kehlata hai. `display: block` matlab element apna poora row le leta hai (jaise ek poora tray), `display: inline` matlab element sirf apni jagah leta hai (jaise ek chhota sticker).

## 6. Technical Explanation

CSS **selectors** browser ko batate hain ki konsa HTML element style karna hai:
- **Type/Tag selector** — `p { }` sabhi `<p>` tags ko target karta hai.
- **Class selector** — `.classname { }` (`.` prefix) us class waale sabhi elements ko target karta hai — reusable across multiple elements.
- **Universal selector** — `* { }` document ke **har** element ko target karta hai; commonly CSS resets ke liye use hota hai.

**Box Model** (outside to inside): `margin` → `border` → `padding` → `content`. `box-sizing` property is model ke calculation ko control karti hai:
- `content-box` (default) — `width`/`height` sirf **content area** ko define karti hai; padding aur border **extra add** hoti hain, total rendered size badh jaata hai.
- `border-box` — `width`/`height` me padding aur border **included** hote hain; total rendered size fixed rehta hai, industry-standard best practice.

`display` property ka default value HTML spec me har tag ke liye predefined hai (`div` = `block`, `span` = `inline`, `img` = `inline-block`), lekin CSS se override kiya ja sakta hai.

## 7. Examples & Code

**Example 1 — Linking CSS**
```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

**Example 2 — Box Model with border-box**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.card {
    width: 300px;
    padding: 20px;
    border: 2px solid #333;
    background-color: #f0f0f0;
    border-radius: 8px;
}
```

**Example 3 — Block vs Inline Comparison**
```html
<div class="block-demo">I am block-level</div>
<span class="inline-demo">I am inline</span>
```
```css
.block-demo {
    display: block;
    background-color: lightgreen;
}
.inline-demo {
    display: inline;
    background-color: lightyellow;
}
```

**Example 4 — Simple Navbar (foundation)**
```html
<nav class="navbar">
    <ul class="left-nav-items">
        <li class="left-nav-item"><a href="#">Home</a></li>
        <li class="left-nav-item"><a href="#">About</a></li>
        <li class="left-nav-item"><a href="#">Contact</a></li>
    </ul>
</nav>
```
```css
.navbar {
    border: 1px solid lightblue;
    padding: 10px;
    background-color: white;
}
.left-nav-item {
    font-size: 18px;
    font-weight: bold;
}
```

## 8. Line-by-Line Explanation

Using **Example 2**:
1. `* { margin: 0; padding: 0; box-sizing: border-box; }` — Universal selector reset: sabhi elements ki default browser spacing hata di, aur sabke box-sizing calculation ko `border-box` mode me daal diya (taaki aage koi bhi width/height set karo, wo predictable rahe).
2. `.card { width: 300px; }` — `.card` class waale element ki total width **300px fix** ho jaayegi (border-box ki wajah se — padding/border isi 300px ke andar accommodate honge).
3. `padding: 20px;` — content aur border ke beech 20px internal spacing; total width same (300px) rehti hai kyunki border-box active hai.
4. `border: 2px solid #333;` — 2px ka solid dark-grey border.
5. `background-color: #f0f0f0;` — light-grey background.
6. `border-radius: 8px;` — corners 8px radius se round ho jaate hain.

## 9. Common Mistakes

- CSS file likhne ke baad `<link>` tag lagana bhool jaana — sabse common beginner mistake, jiski wajah se "CSS kaam nahi kar rahi" jaisa confusion hota hai.
- `box-sizing: border-box` set na karna aur phir confuse hona ki width set karne ke baad bhi element expected se bada dikh raha hai.
- Percentage-based width use karna jab parent element ki khud ki width defined na ho — result unpredictable hota hai.
- Icons ya links ko anchor tag (`<a>`) ke **bahar** rakh dena — element visually dikhta hai lekin clickable/functional nahi hota.
- `display: inline` element pe `width`/`height` set karke confuse hona ki wo apply kyun nahi ho raha (inline elements pe ye properties by default ignore hoti hain — `inline-block` chahiye hota hai).

## 10. Best Practices

- Har project ki CSS file ki **shuruaat** me hi universal selector reset (`* { margin:0; padding:0; box-sizing: border-box; }`) daalna — consistent starting point ke liye.
- Class selectors ko meaningful, reusable names do (`left-nav-item`, na ki `x1`).
- Fixed pixel values ki jagah jahan possible ho relative units (`%`, `rem`) prefer karo — better responsiveness ke liye (detail Module 4 me).
- Styling ko HTML attributes (`border="1"`) me na daal ke hamesha external CSS file me rakho — separation of concerns.
- Multiple related classes ko combine karke reusability badhao (`class="btn btn-primary"` jaisा pattern).

## 11. Performance Tips

- Ek hi external CSS file use karna (multiple inline `<style>` blocks ke bajaye) browser caching ko better banata hai — repeat visits pe page fast load hota hai.
- Overly specific/nested selectors avoid karo — simple class-based selectors browser ke liye parse karna fast hota hai.

## 12. Security Notes

- CSS khud directly security risk nahi hai, lekin **externally hosted CSS/icon libraries** (jaise Font Awesome CDN) use karte waqt hamesha trusted, official CDN links hi use karo — malicious third-party CSS/JS bundles inject hone ka risk hota hai untrusted sources se.

## 13. Interview Questions

1. CSS ko HTML se link karne ka syntax kya hai?
2. `display: block` aur `display: inline` me kya fark hai?
3. CSS Box Model ke 4 parts kaunse hain (order sahi bataiye)?
4. `box-sizing: border-box` kya karta hai aur ye kyun important hai?
5. Universal selector (`*`) kab aur kyun use kiya jaata hai?
6. Class selector aur tag/type selector me kya difference hai?
7. `padding` aur `margin` me kya difference hai?
8. Ek element ko multiple classes kaise di jaati hain?

## 14. Practice Questions

1. Ek `.card` class banao jisme width, padding, border, aur border-radius ho, `box-sizing: border-box` ke saath.
2. `display: inline`, `display: block`, aur `display: inline-block` teeno ka ek-ek example likho aur unka visual difference explain karo.
3. Ek navbar list item (`<li>`) banao jisme icon + text dono ek hi anchor tag ke andar ho.

## 15. Coding Exercises

**Exercise 1:** Box Model Playground
- Ek `<div>` banao aur usme alag-alag `padding`, `border`, `margin` values try karo — `box-sizing: content-box` vs `border-box` ka farak note karo.

**Exercise 2:** Reset Stylesheet
- Apni khud ki `* { margin:0; padding:0; box-sizing:border-box; }` reset likho aur isko kisi bhi purani HTML file pe apply karke before/after farak dekho.

**Exercise 3:** Mini Navbar
- 4 links (Home, About, Projects, Contact) ka ek horizontal-looking navbar banao (abhi flexbox nahi seekha hai, toh `display: inline-block` use karke horizontal layout achieve karo).

## 16. Mini Projects

**Mini Project: Styled Profile Card**
- Ek `.profile-card` class waala div banao jisme: profile heading, ek short bio paragraph, aur ek button ho.
- Box model properties (width, padding, border, border-radius) use karke card ko polish karo.
- `background-color` aur `text-align: center` add karo.
- Ye card aage Module 4 (Flexbox) me multiple cards ke layout ka base banega.

## 17. Summary

Is module me humne CSS ko HTML se link karna, **selectors** (tag, class, universal), **Box Model** (content, padding, border, margin), `display` property (block/inline/inline-block), aur `box-sizing: border-box` seekha — ye sab CSS ke sabse foundational aur frequently-used concepts hain. Ek navbar example ke through in concepts ko real-world context me apply karke dekha gaya, jisse aage flexbox-based full responsive navbar (Module 5) banaya jaayega.

## 18. Keywords

CSS, link tag, rel="stylesheet", Selector, Tag Selector, Class Selector, Universal Selector, Box Model, width, height, padding, border, margin, border-radius, background-color, text-align, display, block, inline, inline-block, box-sizing, border-box, content-box, Font Awesome, navbar.

## 19. Tags
`#css` `#box-model` `#css-selectors` `#display-property` `#box-sizing` `#frontend` `#beginner-to-intermediate`

## 20. Suggested Next Topics
- CSS Layout — Flexbox, Grid, Responsive Design & Media Queries
- CSS Mini Project — Complete Responsive Navbar

## 21. Related Topics
- Module 2: HTML Deep Dive (class attribute foundation)
- CSS Flexbox & Grid (layout systems built on top of Box Model)
- Responsive Web Design & Media Queries

---
*End of Module 3. Continuing sequentially to Module 4: CSS Layout — Flexbox, Grid, Responsive Design in the next part.*
