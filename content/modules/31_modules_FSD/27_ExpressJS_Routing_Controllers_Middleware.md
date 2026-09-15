# Module 27: Express.js Routing, HTTP Methods, Controllers & Middleware

---

## 1. Overview

Is module me Express.js ka deeper, organized architecture cover kiya gaya — real-world backend projects kaise structure karte hain. Instructor ne dikhaya ki **Router** aur **Controller** folders kyun banate hain (separation of concerns — scalability ke liye), `GET` vs `POST` request ka difference (aur kab kaunsa use karein), **`req.body`** se frontend-sent JSON data access karna, aur `express.json()` **Middleware** ka critical role (bina jiske `req.body` hamesha `undefined` rahega).

## 2. Prerequisites

- Module 26 (Node.js & Express.js setup) completed.
- `npm init`, `npm i express`, `require`, `app.get()`, `app.listen()` familiar hona chahiye.

## 3. Learning Objectives

- **Router folder** (`routes/`) kyun banate hain samajhna — saari APIs ek hi `index.js` me kyun nahi likhi jaati.
- **Controller folder** (`controllers/`) kyun banate hain — route handler logic ko alag file me kaise extract karte hain.
- **`express.Router()`** se ek Router instance banana aur routes define karna.
- `router.get()` aur `router.post()` ka use karna (alag-alag HTTP methods ke liye routes).
- **`app.use(router)`** se router ko main `index.js` me register karna.
- `export default` aur named `export`/`import` dono patterns use karna (ESM syntax).
- **`req.body`** se POST request ka data access karna.
- **`express.json()`** middleware ka role samajhna — JSON body reading enable karna.
- Postman me POST request me **Body → Raw → JSON** data bhejne ka process.

## 4. Cleaned Transcript (Hinglish)

**Why Separate Files? — Scalability Problem**

Ek chhote project me saari APIs `index.js` me likhna theek hai, lekin agar 10,000 APIs hon aur har ek me 1,000 lines of code ho — toh ek hi file me 1 crore lines likhna impractical/impossible hai. Real-world projects me hamesha **organized, modular structure** follow kiya jaata hai.

**Standard Backend Folder Structure**

```
project/
├── index.js         (main entry — server setup only)
├── routes/
│   └── router.mjs   (all route definitions)
└── controllers/
    └── userController.mjs  (all handler logic/functions)
```

**Step 1 — Create routes/router.mjs**

```javascript
// routes/router.mjs
import express from 'express';
const router = express.Router(); // creates a Router instance

router.get('/users', userDetail);   // GET route
router.post('/create', createUser); // POST route

export default router; // export the router
```
- **`express.Router()`** — Router ka ek instance banata hai. Sab routes is `router` pe define kiye jaate hain (jaise pehle `app` pe karte the).
- `export default router` — is router ko doosri files se import karne ke liye export kiya.

**Step 2 — Create controllers/userController.mjs**

```javascript
// controllers/userController.mjs
export const userDetail = (req, res) => {
    res.send('Hi, I am coming from Controller!');
};

export const createUser = (req, res) => {
    const data = req.body; // access data sent from frontend/Postman
    console.log(data);
    res.send(data);
};
```
- Functions ab `index.js` ya `router.mjs` me inline nahi hain — alag **Controller file** me hain.
- **Named exports** (`export const`) use kiye gaye — multiple functions ek file se export ho sakte hain.

**Step 3 — Import controller in router.mjs**

```javascript
// routes/router.mjs
import express from 'express';
import { userDetail, createUser } from '../controllers/userController.mjs';

const router = express.Router();

router.get('/users', userDetail);
router.post('/create', createUser);

export default router;
```
- `../` — Router folder se bahar niklo, phir `controllers` folder me jaao.
- Curly braces: **Named imports** ke liye curly braces zaroori hain (exact names match karne chahiye).

**Step 4 — Register router in index.js**

```javascript
// index.js
import express from 'express';
import router from './routes/router.mjs';

const app = express();

app.use(express.json()); // CRITICAL MIDDLEWARE — must come before routes
app.use(router);          // all requests now forwarded to router

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```
- **`app.use(router)`** — Ab `index.js` me individual `app.get()` likhne ki zaroorat nahi — saari incoming requests **Router** ke paas chali jaati hain, jo unhe sahi Controller function pe forward karta hai.

**GET vs POST — When to Use Which**

| HTTP Method | Use Case |
|---|---|
| **GET** | Server se data **padhna/retrieve** karna |
| **POST** | Client se server ko data **bhejana** (create/update) |

Best practice:
- Data **sirf retrieve karna** hai → `GET`
- Frontend se backend pe **data bhejana** hai (jaise form submission, user registration) → `POST`

**req.body — Accessing Sent Data**

Jab Postman ya frontend se data POST kiya jaata hai, wo data **`req.body`** me available hota hai:
```javascript
const createUser = (req, res) => {
    const data = req.body; // { name: "Utkarsh", age: 19, course: "FSD" }
    console.log(data);     // prints in server terminal
    res.send(data);        // sends the data back as response
};
```

**The `undefined` Problem — And the Fix**

Demo: bina kisi special setup ke, `req.body` **`undefined`** return karta hai even when Postman ne data bheja tha. Kyun? Kyunki backend system by-default **JSON body read nahi kar sakta**.

**Fix — `express.json()` Middleware:**
```javascript
app.use(express.json()); // ADD THIS in index.js, BEFORE app.use(router)
```
- **Middleware** ek function hai jo request aur response ke **beech me** execute hota hai — "interceptor" jaisa.
- `express.json()` ek built-in Express middleware hai jo incoming requests ke **JSON body** ko parse karta hai aur use `req.body` me store karta hai.
- Ye **sirf ek baar** `index.js` me add karna padta hai — phir poori app me har jagah `req.body` readable ho jaata hai.
- **Order matters:** `app.use(express.json())` ko `app.use(router)` se **pehle** likhna zaroori hai — warna middleware routes ke execute hone se pehle nahi chalega.

**Demo in Postman (POST Request):**
1. Postman me method `POST` choose karo.
2. URL dalo (jaise `http://localhost:3000/create`).
3. **Body** tab → **Raw** → **JSON** select karo.
4. JSON format me data likho: `{ "name": "Utkarsh", "age": 19, "course": "FSD" }`.
5. Send karo.
6. Terminal me `{ name: 'Utkarsh', age: 19, course: 'FSD' }` print hoga (after `express.json()` middleware added) — Response me bhi same data aayega.

## 5. Beginner Explanation

Socho ek bada office hai. Pehle sabka kaam ek hi room me hota tha — `index.js` ek chhota room tha aur theek tha. Jab office bada hua, toh alag **departments** (folders) banaye — "Routes" department (kaunsa request kahan jaaye), "Controllers" department (actual kaam kaun karega). **`app.use(router)`** ek receptionist hai jo saare visitors ko sahi department bhejta hai. **`express.json()`** ek "translator" hai jo frontend ki JSON language ko backend samjha deta hai — bina is translator ke backend ko kuch samajh hi nahi aata.

## 6. Technical Explanation

**Express Router** ek mini-application jaisa hai — iski khud ki route handlers hoti hain, middleware hoti hai, aur ye `app.use()` se main application se attach hota hai. Ye modular routing enable karta hai.

**MVC Architecture (simplified):**
- **Model** — Data/Database (future MongoDB module)
- **View** — Frontend (React)
- **Controller** — Business logic (handlers we wrote) → ye module Controllers cover karta hai

**Middleware** Express ka ek powerful concept hai — `app.use(fn)` se registered functions **har request ke liye** (ya specific paths ke liye) request pipeline me execute hote hain:
```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```
`express.json()` khud internally `body-parser` library ka use karta hai to parse `Content-Type: application/json` requests ki body. Bina iske, `req.body` `undefined` hoga.

**ESM vs CJS:**
- `.mjs` files automatically **ESM (ES Modules)** treat hoti hain — `import`/`export` syntax.
- `.js` files default **CJS (CommonJS)** hoti hain — `require`/`module.exports` syntax.
- Ek hi project me dono mix karna confusion create kar sakta hai — consistency maintain karo. Alternatively, `package.json` me `"type": "module"` add karke `.js` files bhi ESM support karne lagte hain.

## 7. Examples & Code

**Example 1 — Complete Router File**
```javascript
// routes/userRouter.mjs
import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.mjs';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users/create', createUser);

export default router;
```

**Example 2 — Controller File**
```javascript
// controllers/userController.mjs
export const getAllUsers = (req, res) => {
    // In future, this will fetch from MongoDB
    res.json({ users: ['Alice', 'Bob', 'Charlie'] });
};

export const createUser = (req, res) => {
    const { name, age, email } = req.body; // destructure from body
    console.log('New user:', name, age, email);
    res.json({ message: 'User created', user: { name, age, email } });
};
```

**Example 3 — index.js with Middleware**
```javascript
// index.js
import express from 'express';
import userRouter from './routes/userRouter.mjs';

const app = express();
const PORT = 3000;

app.use(express.json()); // parse JSON bodies — MUST be before routes!
app.use(userRouter);      // use the router

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

## 8. Line-by-Line Explanation

Using **Example 2**:
1. `export const getAllUsers = (req, res) => {` — Arrow function ko directly named-export ki tarah define kiya — `getAllUsers` naam se doosri files se import hoga.
2. `res.json({ users: ['Alice', 'Bob', 'Charlie'] });` — `res.json()` method response me JSON-formatted data bhejta hai (automatically Content-Type: application/json header set karta hai).
3. `export const createUser = (req, res) => {` — Ek doosra controller function, POST requests ke liye.
4. `const { name, age, email } = req.body;` — `req.body` me frontend-bheja hua JSON object hai — **destructuring** se specific properties nikali.
5. `console.log('New user:', name, age, email);` — Server terminal pe print hoga (debugging ke liye).
6. `res.json({ message: 'User created', user: { name, age, email } });` — Confirmation + data wapas bheja.

## 9. Common Mistakes

- `app.use(express.json())` ko **router ke baad** rakhna — order matter karta hai, middleware pehle aana chahiye.
- `.mjs` file me `require()` use karne ki koshish karna — ESM files me `import`/`export` use karna padta hai.
- Named imports me **curly braces bhool jaana** (`import userDetail from '...'` vs `import { userDetail } from '...'`) — `export default` → no braces, named `export` → braces.
- `req.body` ko `undefined` dekh ke confuse ho jaana bina `express.json()` ke — ye sabse common backend beginner mistake hai.
- `router.post('/create', createUser)` me function ko **call** karne ki koshish karna (`createUser()` with parentheses) — function ko **reference** pass karna hai (bina parentheses ke), call nahi.
- Relative path (`../`) galat likhna — ek level upar jaane ke liye `../`, do level ke liye `../../`, etc.

## 10. Best Practices

- **Har feature/resource ki alag route file aur controller file** banao (`userRouter.mjs`, `userController.mjs`; `productRouter.mjs`, `productController.mjs`) — MVC pattern follow karo.
- Controller functions ko **descriptive verb-noun names** do: `getUser`, `createUser`, `updateUser`, `deleteUser` — CRUD operations clearly indicate hone chahiye.
- **`express.json()`** ko hamesha router registration se pehle rakho.
- Production apps me **`express.urlencoded({ extended: true })`** bhi add karo form-data support ke liye.
- Request body ko **validate** karo before using it (e.g., check if required fields exist) — future middleware/validation module me cover hoga.

## 11. Performance Tips

- Route handlers ko **lean** rakho — heavy computation ko separate service/utility functions me move karo.
- Express Router se routing efficiently managed hoti hai — ek monolithic `index.js` se better performance aur maintainability milti hai.

## 12. Security Notes

- **`req.body` data ko kabhi blindly trust mat karo** — user-sent data hamesha validate karo backend pe before saving/using (SQL injection, NoSQL injection se bachne ke liye). Validation libraries jaise `express-validator` ya `joi` use karo (advanced topic).
- **Error handling middleware** add karo (`app.use((err, req, res, next) => {...})`) taaki unhandled errors server crash na karein — future module me detail se cover hoga.

## 13. Interview Questions

1. Backend project me Router aur Controller folder kyun alag-alag banate hain?
2. `GET` aur `POST` HTTP methods me kya fundamental difference hai?
3. `req.body` hamesha `undefined` aata hai — kya problem ho sakti hai?
4. `express.json()` middleware kya karta hai?
5. Middleware ka concept Express me kya hai?
6. `export default` aur named `export` me kya difference hai? Import syntax me kya difference aata hai?
7. `app.use(router)` vs direct `app.get()` — dono me kya difference hai?
8. Relative path me `../` aur `./` ka kya matlab hai?

## 14. Practice Questions

1. Ek Controller banao jisme `getProducts` aur `createProduct` — do named-export functions hon.
2. Ek Router banao jo `/products` pe GET aur `/products/add` pe POST define kare, oopar bane controller functions use karke.
3. `index.js` me `express.json()` aur router dono add karo.
4. Postman me ek POST request create karo, Body → Raw → JSON me product data bhejo aur `console.log` output verify karo.

## 15. Coding Exercises

**Exercise 1:** Full MVC Setup
- Ek project banao jisme `routes/router.mjs`, `controllers/userController.mjs`, aur `index.js` teeno hon — GET `/users` aur POST `/users/create` routes fully working hon.

**Exercise 2:** Multiple Controllers
- `userController.mjs` ke alawa ek `productController.mjs` bhi banao — products ke liye `getProducts` aur `addProduct` functions.

**Exercise 3:** Request Body Destructuring
- `createUser` controller me `req.body` se naam, email, aur password destructure karo, validate karo ki sab present hain, aur agar nahi hain toh error response bhejo.

## 16. Mini Projects

**Mini Project: Complete User API**
- Routes:
  - `GET /users` → dummy list of users return karo.
  - `POST /users/register` → `req.body` se `{name, email, password}` lo, validate karo, simulated success response bhejo.
  - `GET /users/:id` → route parameter se user ID lo (`:id` syntax — future module) aur simulated user object return karo.
- Postman se saare routes test karo.

## 17. Summary

Is module me humne Express.js ka **organized, scalable architecture** seekha — `routes/` folder me **Router** (API paths define karna), `controllers/` folder me **Controller functions** (actual handler logic), aur `index.js` me sirf **server setup aur middleware**. Humne `GET` (data retrieve) vs `POST` (data send) HTTP methods ka difference samjha, **`req.body`** se frontend-bheja data access karna, aur sabse importantly — **`express.json()` middleware** ki critical role (bina jiske `req.body` hamesha `undefined` rahega). Postman me Body → Raw → JSON format me data bhejne ka practical flow bhi cover kiya.

## 18. Keywords

Router, Controller, MVC Architecture, express.Router, router.get, router.post, app.use, req.body, express.json, Middleware, GET, POST, HTTP Methods, Named Export, Export Default, ESM, mjs, req, res, Postman Body Raw JSON, Relative Path.

## 19. Tags
`#expressjs` `#backend` `#routing` `#middleware` `#mvc` `#req-body` `#http-methods` `#controller` `#intermediate-backend`

## 20. Suggested Next Topics
- MongoDB & Mongoose — Database Integration
- Route Parameters, Query Strings & Complete CRUD

## 21. Related Topics
- Module 26: Node.js & Express Fundamentals (foundation for this module)
- Module 28: MongoDB & Mongoose (where actual data goes instead of simulated responses)
- Authentication Module (middleware will be used extensively for protected routes)

---
*End of Module 27. Continuing sequentially to Module 28: MongoDB & Mongoose in the next part.*
