# Module 2: HTML Deep Dive — Forms, Semantic Tags, Favicon & Multimedia

---

## 1. Overview

Is module me HTML ke remaining core concepts cover kiye gaye hain jo real-world websites banane ke liye zaroori hain: **advanced form fields** (textarea, rows/cols), **Semantic vs Non-Semantic tags** (`div`, `span`, aur meaning-carrying tags jaise headings/address), **favicon** add karna (browser tab icon), aur **multimedia embedding** (audio/video tags). Instructor yahan AI-assisted styling (CSS auto-generate) bhi demonstrate karte hain taaki learner form ko turant achha dikhta dekh sake, saath hi ye bhi bataya jaata hai ki underlying CSS concepts (box-shadow, display flex, text-align) aage detail me cover honge.

## 2. Prerequisites

- Module 1 completed hona chahiye (HTML boilerplate, basic tags, tables, forms basics).
- VS Code installed aur familiar hona chahiye.
- Basic samajh: attributes kya hote hain (`type`, `placeholder`).

## 3. Learning Objectives

- `<textarea>` field ka use samajhna, including `rows` aur `cols` attributes.
- **Semantic** aur **Non-Semantic** HTML tags me difference samajhna.
- `<div>` (block-level container) aur `<span>` (inline container) ka correct use-case samajhna.
- Favicon (browser tab icon) kaise add karte hain, seekhna.
- `<video>` aur `<audio>` tags ka use karke multimedia embed karna, `src` aur `controls` attributes ke saath.
- Class attribute ka intro — CSS selection ke liye foundation.

## 4. Cleaned Transcript (Hinglish)

**Textarea — Large Text Input**

Agar user se ek bada text input chahiye (jaise address ya message), single-line `<input>` kaafi nahi hota — iske liye `<textarea>` tag use hota hai:

```html
<label for="address">Address:</label>
<textarea id="address" rows="4" cols="30"></textarea>
```

- `rows` — textarea ki height control karta hai (kitni lines dikhengi).
- `cols` — textarea ki width control karta hai.

Instructor ne ek demo diya jaha AI tool ki help se poore form ko ek prompt ("style it in a proper login form / sign up form") se automatically styled kiya gaya — jisme background color, font-family, `display: flex`, `box-shadow`, aur `text-align: center` jaisi CSS properties apply hui. Ye properties detail me CSS module me cover hongi; yahan sirf real-world workflow dikhaya gaya ki AI tools se rapid prototyping kaise hoti hai, lekin underlying concepts samajhna zaroori hai.

**Semantic vs Non-Semantic Tags**

- **Semantic tags** — Wo tags jinka browser (aur search engines) ke liye ek defined **meaning** hota hai. Example: `<h1>` heading ke liye hai — browser use bada aur important text ki tarah treat karta hai, aur ye SEO ke liye bhi optimized hota hai. Similarly `<address>` tag contact information ke liye meaning rakhta hai.
- **Non-Semantic tags** — Wo tags jinka browser ke liye koi specific meaning nahi hota — inka use sirf **styling ya code organization** ke liye hota hai. Do main non-semantic tags:
  - `<div>` — **Block-level** container. Poore content ko ek block (naye line se start, poori width le leta hai) me wrap karta hai. Website ke bade sections/containers banane ke liye use hota hai.
  - `<span>` — **Inline** container. Sirf jitni content ki width hai utni hi jagah leta hai, new line nahi leta. Kisi specific word/phrase ko highlight/style karne ke liye use hota hai.

**Favicon**

Favicon wo chhota icon hota hai jo browser tab me website ke title ke pehle dikhta hai. Isse add karne ke liye ek online icon-kit tool use kiya gaya (jaise favicon generator service):
1. Website pe jaake apna project name do (e.g. "StudyIQ Skills").
2. Ek style/icon choose karo (free tier available).
3. "Make my kit" pe click karo — tool ek `<script>` tag generate karta hai.
4. Us generated script tag ko copy karke apni HTML file ke `<head>` tag ke andar paste karo.
5. Site pe available icons me se koi bhi icon search karke (jaise "home") select karo, HTML version copy karo, aur website me jaha chahiye wahan paste karo.

**Multimedia — Video & Audio**

Jaise images ke liye `<img>` tag hota hai, waise hi video aur audio embed karne ke liye dedicated tags hain:

```html
<video src="./example-video.mp4" controls width="100%" height="auto"></video>
<audio src="./example-audio.mp3" controls></audio>
```

- `src` attribute — video/audio file ka path (relative jaise `./filename.mp4` sem folder ke liye, ya full URL).
- `controls` attribute — user ko play/pause/volume jaisa native player UI deta hai (bina iske video/audio silently embed hoga bina kisi interaction option ke).
- YouTube jaisi external video links **directly support nahi hoti** — unhe embed karne ke liye special permissions/embedding settings chahiye hote hain (separate topic).

Video ka size control karne ke liye instructor ne **class attribute** introduce kiya — ye pehli baar dikhaya gaya ki CSS me tag-selector ke bajaye **class-selector** se bhi elements ko target kiya ja sakta hai:

```html
<video class="my-video" src="./example-video.mp4" controls></video>
```
```css
.my-video {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto; /* auto = horizontally center ho jaayega */
    border: 1px solid black;
}
```

## 5. Beginner Explanation

Socho tumhare paas ek form hai jisme address likhna hai — ek chhoti si line kaafi nahi hai, isliye ek bada box (`textarea`) chahiye. Ab socho website ke different parts ko group karna hai — jaise ek "header box" aur ek "footer box" — uske liye `<div>` use karo (jaise bade dabbe/containers). Agar sirf ek word ko highlight karna hai bina naya paragraph banaye, `<span>` use karo (jaise ek chhota sticker jo word ke around chipak jaata hai). Favicon ek tarah se tumhare ghar ke bahar lagi hui naam-plate jaisi hai — chhota sa icon jo pehchan deta hai. Aur video/audio tags basically embed karne ka tareeka hain — jaise TV screen fit karna webpage ke andar.

## 6. Technical Explanation

- `<textarea>` ek **replaced element** hai jo multi-line plain text input accept karta hai; iski value form submission ke time `name` attribute ke through backend ko bhejti hai.
- **Semantic HTML** browser ke accessibility tree aur search engine crawlers dono ko structural meaning provide karta hai — screen readers jaise assistive technologies semantic tags ko better interpret kar paate hain, jisse **accessibility** aur **SEO** dono improve hote hain.
- `<div>` default `display: block` hota hai (full width, new line), jabki `<span>` default `display: inline` hota hai (content-width, same line).
- `class` attribute ek non-unique identifier hai jo multiple elements pe apply ho sakta hai — CSS/JS dono me ye elements ko group-select karne ka primary tareeka hai (`id` ke contrast me, jo unique hota hai per page).
- `<video>`/`<audio>` HTML5 media elements hain jo browser ke native media engine se render hote hain — `controls` attribute boolean hai (present matlab true).

## 7. Examples & Code

**Example 1 — Textarea in a Form**
```html
<form>
    <label for="name">Name:</label>
    <input type="text" id="name" placeholder="Enter your name">

    <label for="age">Age:</label>
    <input type="number" id="age" placeholder="Enter your age">

    <label for="address">Address:</label>
    <textarea id="address" rows="4" cols="30" placeholder="Enter your address"></textarea>

    <button type="submit">Submit</button>
</form>
```

**Example 2 — Semantic vs Non-Semantic**
```html
<!-- Semantic: browser/SEO understands purpose -->
<h1>Welcome to My Website</h1>
<address>Contact us at: info@example.com</address>

<!-- Non-Semantic: only for grouping/styling -->
<div class="card">
    <span class="highlight">New!</span>
    <p>Product description goes here.</p>
</div>
```

**Example 3 — Favicon**
```html
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <script src="https://icon-kit-generated-link.js"></script>
</head>
```

**Example 4 — Video and Audio Embedding**
```html
<video class="demo-video" src="./example-video.mp4" controls></video>
<audio src="./example-audio.mp3" controls></audio>
```
```css
.demo-video {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    border: 1px solid black;
}
```

## 8. Line-by-Line Explanation

Using **Example 4**:
1. `<video class="demo-video" ...>` — `<video>` tag create hota hai; `class="demo-video"` isko CSS/JS se select karne ke liye ek identifier deta hai.
2. `src="./example-video.mp4"` — `./` ka matlab hai "same directory/folder jaha ye HTML file hai" — browser wahi se video file dhoondega.
3. `controls` — is attribute ki presence hi browser ko default play/pause/volume/fullscreen UI dikhane ko bolti hai.
4. `.demo-video { width: 100%; }` — CSS class-selector (`.` prefix) `demo-video` class waale sabhi elements ko target karta hai; video ki width parent container ke 100% ke barabar set ho jaati hai.
5. `height: auto;` — height, width ke proportion me automatically adjust hoti hai (aspect ratio maintain hota hai).
6. `display: block;` — video ko block-level bana deta hai (default video element inline-block hota hai) taaki wo apni pura available width use kare.
7. `margin: 0 auto;` — top/bottom margin 0, left/right margin `auto` — ye trick element ko horizontally center kar deti hai.
8. `border: 1px solid black;` — video ke around ek thin black border draw hota hai.

## 9. Common Mistakes

- `<textarea>` me `value` attribute use karne ki koshish karna — actually textarea ka default text uske **opening aur closing tag ke beech** likha jaata hai (`<textarea>default text</textarea>`), attribute me nahi.
- Semantic tags ki jagah har jagah `<div>` use kar dena ("div-itis") — isse accessibility aur SEO dono suffer karte hain.
- `<span>` ko block-level content ke liye use karna — isse layout expected tarike se nahi behave karega kyunki span inline hai.
- Video/audio `src` path galat likhna (case-sensitivity, wrong relative path `./` vs `../`) — file load hi nahi hogi.
- `controls` attribute bhool jaana — user ke paas play/pause ka koi UI hi nahi hoga.
- `class` aur `id` ko confuse karna — `id` unique per page hona chahiye, `class` multiple elements pe reuse ho sakta hai.

## 10. Best Practices

- Jahan bhi possible ho, semantic tags prefer karo (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<address>`) non-semantic `<div>` ke bajaye — better accessibility aur SEO.
- `<div>`/`<span>` ka use tabhi karo jab koi semantic tag available na ho for that purpose.
- Har media element (`video`/`audio`) me `controls` add karo unless intentionally autoplay-background media chahiye ho.
- Class names meaningful aur consistent naming convention (jaise `kebab-case`: `demo-video`, `left-nav-item`) me rakho.
- Favicon har production website me add karo — professional appearance aur brand recognition ke liye zaroori hai.

## 11. Performance Tips

- Large video files directly embed karne se page load slow ho sakta hai — production me video hosting services (jaise Cloudinary, YouTube embed with proper settings) prefer kiya jaata hai instead of raw file hosting.
- Audio/video files ko compress karke use karo taaki bandwidth aur load time optimize ho.
- `loading="lazy"` jaisi techniques images ke liye future modules me cover hongi — same philosophy media ke liye bhi apply hoti hai.

## 12. Security Notes

- External scripts (jaise favicon generator ka `<script>` tag) sirf **trusted sources** se hi include karo — kisi bhi third-party script ko blindly `<head>` me daalna security risk create kar sakta hai (XSS/supply-chain attack vector).
- User-uploaded media files (jab forms se upload honge, aage ke modules me) ko hamesha server-side validate karna padta hai — file type, size, aur content verify kiye bina serve nahi karna chahiye.

## 13. Interview Questions

1. `<div>` aur `<span>` me kya difference hai?
2. Semantic aur Non-semantic tags kya hote hain? Do-do examples do.
3. Semantic HTML SEO aur accessibility ko kaise improve karta hai?
4. `<textarea>` aur `<input type="text">` me kya difference hai?
5. Favicon kya hota hai aur website me kaise add karte hain?
6. `<video>` tag ke `controls` attribute ka kya role hai?
7. `class` attribute `id` attribute se kaise different hai?
8. Kya YouTube video directly `<video src="youtube-link">` se embed ho sakti hai? Kyun/kyun nahi?

## 14. Practice Questions

1. Ek form banao jisme ek `<textarea>` ho jisme user apna feedback likh sake (max 5 rows).
2. Ek page banao jisme `<div>` se do sections banao (header-section aur footer-section), aur ek `<span>` se ek word highlight karo.
3. Apni website me ek favicon add karne ke steps likho.
4. Ek HTML page banao jisme ek video aur ek audio dono embed ho, dono me `controls` attribute ho.

## 15. Coding Exercises

**Exercise 1:** Feedback Form
- Name, Email, aur ek `<textarea>` (Feedback message) waala form banao.

**Exercise 2:** Semantic Refactor
- Ek plain `<div>`-only layout ko semantic tags (`<header>`, `<main>`, `<footer>`) me refactor karo.

**Exercise 3:** Media Gallery
- Ek page banao jisme 1 video aur 1 audio ho, dono ko class-selector se CSS ke through width/border style karo.

## 16. Mini Projects

**Mini Project: Personal Portfolio Landing Section**
- `<div class="container">` ke andar apna intro (`<h1>`, `<p>`) rakho.
- Ek `<span>` se apni "current role/title" highlight karo.
- Ek intro video (agar available ho) `<video controls>` se embed karo.
- Favicon add karo apni site ke liye.
- Ek contact form (name, email, `<textarea>` message) add karo.

## 17. Summary

Is module me humne HTML ke advanced building blocks cover kiye: `<textarea>` (multi-line input), **Semantic vs Non-Semantic tags** (`div`/`span` ka sahi use-case), **favicon** setup, aur **multimedia embedding** (`<video>`, `<audio>` with `src` aur `controls`). Humne pehli baar **class attribute** bhi dekha jo CSS selection ka foundation hai — agle module (CSS Fundamentals) me isi concept ko deeply explore kiya jaayega.

## 18. Keywords

Textarea, rows, cols, Semantic HTML, Non-Semantic HTML, div, span, block-level, inline, Favicon, Multimedia, video tag, audio tag, src attribute, controls attribute, class attribute, box-shadow, display flex, AI-assisted styling.

## 19. Tags
`#html` `#semantic-html` `#html-forms` `#multimedia` `#favicon` `#div-span` `#frontend` `#intermediate`

## 20. Suggested Next Topics
- CSS Fundamentals — Selectors (tag, class, id), Box Model, Colors, Units
- CSS Layout — Flexbox & Responsive Design

## 21. Related Topics
- Module 1: Introduction to Web Development & HTML Fundamentals
- CSS Fundamentals (class selectors used here will be explained fully)
- Accessibility (a11y) & SEO Basics

---
*End of Module 2. Continuing sequentially to Module 3: CSS Fundamentals (Selectors, Box Model, Colors, Units) in the next part.*
