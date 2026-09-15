# Module 26: Node.js & Express.js Fundamentals — Backend Development Introduction

---

## 1. Overview

Is module se **Backend development** shuru hota hai — course ka doosra bada arc. Instructor pehle explain karte hain ki frontend credentials (jaise login data) actually **database me jaana chahiye**, local storage ek temporary workaround tha. Ab asli backend systems ka time hai. Module me cover hota hai: **Backend architecture** (kya hota hai, kyun zaroori hai), **API / Request-Response cycle**, **Postman** (backend testing tool), aur **Node.js + Express.js** se ek pehla backend server banana — `npm init`, `npm install express`, `require`, `app.get()`, aur `app.listen()`.

## 2. Prerequisites

- Module 5 (JavaScript Fundamentals — Node.js was installed here).
- Module 15 (Asynchronous JavaScript, API, Fetch — frontend API calling samajha tha).
- Basic terminal/command-line comfort.

## 3. Learning Objectives

- **Backend systems** kya hote hain aur kyun zaroorat hai samajhna.
- **API (Application Programming Interface)** ka concept refresh karna — frontend-backend ke beech bridge.
- **Request-Response cycle** samajhna — Client → API → Backend → Database → Response.
- **JSON** ko data-exchange format ki tarah samajhna.
- **Postman** install karna aur use karna — backend APIs test karne ke liye.
- `npm init` se ek naya Node.js project initialize karna, `package.json` ka structure samajhna.
- **Express.js** install karna (`npm install express`) aur import karna (`require('express')`).
- `app.get()` se ek pehla route define karna.
- `app.listen()` se server start karna.
- **Library vs Framework** ka conceptual difference samajhna.

## 4. Cleaned Transcript (Hinglish)

**Why Backend? The Real Problem**

Frontend me humne login form banaya aur credentials `localStorage` me store kiye — lekin ye real-world approach **nahi hai**. Actual data **database me jaana chahiye**, securely. Backend systems isi zaroorat ko fulfill karte hain. Backend ka kaam hota hai:
1. **Database handle karna** — data securely store aur retrieve karna.
2. **Security handle karna** — passwords hash karna, authentication karna.
3. **Efficient operations on data** — APIs ke through data provide karna.

**What is a Backend System?**

Backend ek aisa system hai jo **user ko dikhai nahi deta** (koi UI nahi hota) — ye sirf **data me baat karta hai** (JSON format me). Frontend aur Backend ke beech ek **API** hoti hai jo middlewan ka kaam karti hai.

**API & Request-Response Cycle**

- **API (Application Programming Interface)** — Frontend aur Backend ke beech ka middleman/broker.
- **Request** — hamesha **Client (Frontend)** bhejta hai.
- **Response** — hamesha **Server (Backend)** deta hai.

**Full cycle:**
```
Client (Frontend)  →  API  →  Backend Server  →  Database
Database  →  Backend  →  API  →  Frontend (Response received)
```

**JSON — Data Exchange Format**

**JSON (JavaScript Object Notation)** — Data transfer ka standard format. Dikhta hai JavaScript objects jaise, lekin:
- **Bahut lightweight** hai (faster transfer)
- **Har technology support** karta hai (Node.js, Python, Java — sab JSON samajhte hain)
- Isliye industry standard hai API responses ke liye.

**Postman — Testing Backend APIs**

Backend koi visual UI nahi dikhata — isko test karne ke liye **Postman** tool use hota hai:
- Google pe "Postman install" search karo → OS ke hisaab se download karo → install karo.
- Postman me ek naya **Collection** banao (ek project ki saari API calls organize karne ke liye).
- Collection ke andar **Add Request** karo, URL dalo (jaise `https://dummyjson.com/products`), aur **Run** karo.
- Response JSON format me dikhega — exactly wahi jo backend server send karega.

**Demo:** DummyJSON API `/products` endpoint call karke live JSON response Postman me dekha gaya.

**Starting a New Backend Project — npm init**

```bash
mkdir day23
cd day23
npm init
```

`npm init` ek series of questions puchega:
- **Package name** — project ka naam (e.g., `backend-setup`)
- **Version** — `1.0.0` (pehla release, convention hai)
- **Description** — short description (e.g., "Test package for setup")
- **Entry point** — `index.js` (main file jo execute hogi)
- **Test command** — abhi skip karo
- **Git repository** — apna GitHub repo URL (optional)
- **Keywords** — relevant terms
- **Author** — tumhara naam
- **License** — `MIT` ya blank

Sab kuch enter karne ke baad ek **`package.json`** file banti hai — project ki metadata file, jisme saari dependencies track hoti hain.

**Installing Express.js**

```bash
npm install express
# OR shorthand:
npm i express
```

Is se:
- `node_modules/` folder create hota hai (Express aur uski dependencies).
- `package-lock.json` create hota hai (exact versions lock karta hai).
- `package.json` me `"dependencies": { "express": "^4.x.x" }` automatically add ho jaata hai.

**Library vs Framework — Key Distinction**

| | Library | Framework |
|---|---|---|
| **Definition** | Ek-do specific features | Poora end-to-end application structure |
| **Examples** | Axios, lodash | Express.js, Django, Spring |
| **Control** | Tum control karte ho | Framework control karta hai |

- **Express.js** ek **Framework** hai — poora backend application iska use karke ban sakta hai.
- **Library** jaise Axios — sirf ek specific kaam (HTTP calls) ke liye.

**Writing the First Server — index.js**

```javascript
const express = require('express');  // old CommonJS syntax (CJS)
const app = express();               // creates an Express application instance

// Define a route: when someone visits "/" (root), send this response
app.get('/', (req, res) => {
    res.send('Hello World from Backend!');
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

**Breaking it down:**
- `require('express')` — CJS (CommonJS) syntax for importing — ye Node.js ka original/default module system hai. (`import` from ESM ka use future lectures me hoga). Curly braces nahi chahiye `require` me (jaise React me hote hain).
- `express()` — Express ka ek **instance/object** banata hai jise `app` naam diya gaya.
- `app.get(path, callback)` — **GET request** ke liye ek route define karta hai. Pehla argument: URL path (`'/'`). Doosra: callback function jo `req` (request object) aur `res` (response object) leta hai.
- `res.send(...)` — Client ko response bhejta hai (string, JSON, anything).
- `app.listen(port, callback)` — Server ko specified port pe **start** karta hai. Jab server ready hota hai, callback chalta hai.

**Running the Server**

```bash
node index.js
```

Terminal me `"Server is running on port 3000"` dikhega — iska matlab server chal raha hai. Ab browser me `http://localhost:3000` kholne par `"Hello World from Backend!"` dikhega. Postman se bhi is URL ko test kiya ja sakta hai.

**Important Note — `.mjs` vs `.js`**

- `.js` extension — **CommonJS (CJS)** module system — `require()` syntax.
- `.mjs` extension — **ES Module (ESM)** system — `import` syntax (jaise React me use karte hain).
- Abhi ke liye `.js` aur `require()` use kiya gaya — future me ESM (`import`/`export`) ka detailed coverage hoga.

## 5. Beginner Explanation

Socho frontend ek **customer** hai aur backend ek **kitchen** hai. Customer directly kitchen me nahi jaata — **waiter (API)** ke through order (request) deta hai, kitchen (backend) khaana (data) prepare karta hai, aur waiter laake deta hai (response). **JSON** wo "language" hai jisme kitchen aur waiter baat karte hain — lightweight, universal. **Postman** ek "test customer" jaisa hai — bina poora frontend banaye, seedha kitchen (backend) ko order deke test karo ki wo sahi response de raha hai ya nahi.

## 6. Technical Explanation

**Node.js** ek **JavaScript runtime environment** hai (Chrome ka V8 engine use karta hai) jo JavaScript ko **browser ke bahar** (server/machine pe) run karna possible banata hai. Node.js internally **single-threaded, non-blocking I/O** model use karta hai (Event Loop based — Module 15 se recall).

**Express.js** Node.js ke upar ek **minimal, unopinionated web framework** hai jo:
- HTTP routing (`app.get()`, `app.post()`, etc.) provide karta hai.
- Middleware system provide karta hai (request-response pipeline).
- JSON parsing, static file serving, aur bahut kuch built-in ya plugin-based support karta hai.

**`require()` (CommonJS)** Node.js ka original module system hai — synchronously modules load karta hai. `module.exports` se export kiya jaata hai, `require()` se import. Modern Node.js versions me **ESM** (`import`/`export`) bhi support hota hai, lekin `package.json` me `"type": "module"` set karna padta hai.

**`app.get(path, handler)`** — HTTP GET method ke liye ek route register karta hai. Handler callback ko do objects milte hain: `req` (request — client ki info, headers, body, params) aur `res` (response — client ko response bhejne ke methods).

**Port** — Ek numeric identifier jispe server "listen" karta hai. `localhost:3000` ka matlab hai local machine ka port 3000. Multiple servers alag-alag ports pe chal sakte hain.

## 7. Examples & Code

**Example 1 — Minimal Express Server**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

**Example 2 — Multiple Routes**
```javascript
app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.get('/products', (req, res) => {
    res.json({ products: ['Apple', 'Mango', 'Banana'] });
});
```

**Example 3 — package.json Structure (after npm init)**
```json
{
  "name": "backend-setup",
  "version": "1.0.0",
  "description": "Test package for setup",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2"
  },
  "author": "YT Learners",
  "license": "MIT"
}
```

## 8. Line-by-Line Explanation

Using **Example 1**:
1. `const express = require('express');` — `express` package ko import kiya CommonJS `require()` syntax se. `require('express')` `node_modules` me Express dhoondh ke uska exported object laata hai.
2. `const app = express();` — Express framework ka ek **instance** banaya — ye `app` object hi ab hamaara poora web server hai.
3. `const PORT = 3000;` — Port number variable me store kiya (magic number se bachne ke liye).
4. `app.get('/', (req, res) => {` — **GET route** define kiya root path `/` ke liye. Jab koi `localhost:3000/` visit karega, ye callback run hoga.
5. `res.send('Server is working!');` — Client ko text response bheja.
6. `});` — Route handler ka end.
7. `app.listen(PORT, () => {` — Server ko `PORT` (3000) pe start kiya.
8. `console.log(...)` — Server ready hone par terminal me message print hota hai (ya baad me startup errors identify karne me help karta hai).

## 9. Common Mistakes

- `npm init` ke baad Express install karna **bhool jaana** — bina install kiye `require('express')` ReferenceError dega.
- `npm i express` ke baad `node_modules` folder ka size dekh ke nervous ho jaana — ye normal hai, Express ke saath bahut saare dependencies aate hain.
- `app.get()` me **route path case-sensitivity** ignore karna — `/About` aur `/about` alag routes hote hain.
- `res.send()` ke baad `res.json()` bhi call karne ki koshish karna — ek route handler me sirf **ek response** bhejni hoti hai, warna "Headers already sent" error.
- Server start karne ke baad code changes **automatically reflect nahi hote** — server dobara restart karna padta hai (`Ctrl+C` → `node index.js` again). Isse bachne ke liye future me **nodemon** library use ki jaayegi.

## 10. Best Practices

- Port number ko ek **constant variable** me store karo (`const PORT = 3000`) — hamesha magic numbers avoid karo.
- Entry point file ko `index.js` ya `server.js` naam do — team convention ke hisaab se consistent rakho.
- `node_modules/` folder ko **`.gitignore`** me add karo (Git me commit nahi karna chahiye — ye `npm install` se regenerate hoti hai).
- Routes ko logically organize karo (separate files me) jaise project bada ho — ek hi `index.js` me sab kuch likhna messy ho jaata hai.
- Har response ke baad `return` use karo agar uske baad aur code hai handler me — accidental double-response errors avoid karne ke liye.

## 11. Performance Tips

- `nodemon` (later module) install karo development me — file changes pe automatic server restart, productivity significantly improve hoti hai.
- Production me `node index.js` ke bajaye **PM2** jaisa process manager use karo — auto-restart on crash, logs, cluster mode.

## 12. Security Notes

- Port 3000 local development ke liye theek hai, lekin production me firewall rules se unnecessary ports block karo.
- Sensitive config (jaise port, API keys) ko code me hardcode karne ke bajaye **environment variables** (`.env` file, `dotenv` library — future module) me rakho.
- Backend pe hamesha **HTTPS** use karo production me — data encryption ke liye.

## 13. Interview Questions

1. Node.js kya hai? Ye JavaScript ko server-side pe run karne kaise allow karta hai?
2. Express.js kya hai? Ye Node.js se alag kaise hai?
3. Library aur Framework me kya conceptual difference hai?
4. Request-Response cycle explain karo — full flow describe karo.
5. API ka full form kya hai aur ye kya kaam karta hai?
6. Postman kyun use kiya jaata hai backend development me?
7. `require('express')` aur `import express from 'express'` me kya fark hai?
8. `app.listen()` ka kya role hai?
9. `npm init` kya karta hai?

## 14. Practice Questions

1. Ek Express server banao jo `localhost:3000/hello` pe visit karne par "Hello Backend!" dikhaye.
2. `package.json` me kya-kya fields hoti hain? Har ek ka purpose batao.
3. `node_modules` folder kyun `.gitignore` me add karna chahiye?
4. Ek route banao jo `/products` pe JSON array send kare.

## 15. Coding Exercises

**Exercise 1:** First Server
- `npm init` + `npm i express` karo, `index.js` me basic Express server likho, `node index.js` se run karo, browser me verify karo.

**Exercise 2:** Multiple Routes
- Same server me 3 routes add karo: `/`, `/about`, `/contact` — har ek pe alag message send karo.

**Exercise 3:** Postman Test
- Postman install karo, ek collection banao, aur apne running server ke saare routes ko Postman se test karo.

## 16. Mini Projects

**Mini Project: Personal Info API**
- Express server banao jisme ye routes hon:
  - `GET /` — "Welcome to My API" dikhaye.
  - `GET /info` — JSON me `{ name: "YourName", course: "Full Stack", status: "Learning" }` return kare.
  - `GET /skills` — JSON array of your skills return kare.
- Postman se saare routes test karo.

## 17. Summary

Is module me Backend development shuru hui. Humne **Backend ka purpose** samjha (database, security, efficient data operations), **API aur Request-Response cycle** ko solid conceptually cover kiya (Client → API → Backend → Database → Response), **JSON** ko data-exchange format ki tarah samjha, aur **Postman** se backend APIs test karna seekha. Practical side me **`npm init`** se Node.js project initialize kiya, **Express.js** install kiya, aur apna **pehla server** banaya — `require('express')`, `app.get()` (routes), `app.listen()` (port pe server start). **Library vs Framework** ka fark bhi clear hua.

## 18. Keywords

Backend, Node.js, Express.js, npm init, package.json, require, CommonJS (CJS), app.get, app.listen, Route, Request, Response, req, res, JSON, API, Request-Response Cycle, Postman, localhost, Port, node_modules, Library vs Framework.

## 19. Tags
`#nodejs` `#expressjs` `#backend` `#api` `#request-response` `#postman` `#npm` `#beginner-backend` `#server-setup`

## 20. Suggested Next Topics
- Express Routing — Multiple HTTP Methods, Route Parameters, Query Strings
- Nodemon — Automatic Server Restart

## 21. Related Topics
- Module 5: JS Fundamentals (Node.js was installed/intro'd there)
- Module 15: Async JS & Fetch API (frontend side of API calling)
- Module 27: MongoDB & Mongoose (database for the backend being built here)

---
*End of Module 26. Continuing sequentially to Module 27: Express.js Routing, HTTP Methods & Middleware in the next part.*
