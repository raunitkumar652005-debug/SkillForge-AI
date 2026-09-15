# Module 28: MongoDB & Mongoose — Schema, Models, CRUD Operations & .env Setup

---

## 1. Overview

Is module me **MongoDB** (NoSQL database) aur **Mongoose** (Node.js ke liye MongoDB ODM/library) cover kiye gaye — including MongoDB Atlas (cloud database) ka setup, `.env` file (sensitive credentials secure rakhne ke liye), **Schema** define karna, **Model** banana, aur CRUD operations perform karna — create (save karna), find, update. Instructor ne full-stack architecture bhi practically demonstrate kiya — ek Vite React frontend + Express backend, saath me MongoDB se connected.

## 2. Prerequisites

- Module 26-27 (Node.js & Express basics, Routing/Controllers/Middleware) completed.
- MongoDB Atlas account banana (cloud-based free tier available).
- **MongoDB Compass** install karna (GUI-based MongoDB viewer — Google se download).

## 3. Learning Objectives

- **MongoDB Atlas** cloud setup karna aur connection URI nikalna.
- **`.env` file** create karna sensitive credentials store karne ke liye, aur `dotenv` package se load karna.
- **`.gitignore`** file me `.env` aur `node_modules` add karna (GitHub pe expose hone se bachne ke liye).
- `mongoose.connect(MONGO_URI)` se database ko Node.js app se connect karna.
- **Schema** define karna — MongoDB document ka structure/template.
- **Model** banana schema se — database collection create karta hai.
- `async/await` + `model.create()` se database me document **create** karna.
- `model.find()` se documents **read** karna.
- Asynchronous database operations me **try-catch** ka use karna.
- **CORS** error kya hota hai aur `cors` middleware se fix karna.

## 4. Cleaned Transcript (Hinglish)

**Why MongoDB?**

MongoDB ek **NoSQL, document-based database** hai — data ko JSON-jaisi format (BSON) me store karta hai, tables aur rows (SQL) ki jagah **collections aur documents** use karta hai. Mongoose ek **ODM (Object Document Mapper)** library hai jo Node.js code se MongoDB ke saath interact karna aasan banati hai — schema validation, model-based queries, aur mongoose methods sab ye provide karta hai.

**MongoDB Atlas — Cloud Database Setup**

1. Google pe "MongoDB Atlas" search karo → free account banao.
2. Project banao aur ek **Cluster** create karo (free M0 tier).
3. **Database User** create karo (username aur password — isko `userPassword` jaisa koi memorable naam do, special characters se bacho).
4. **Network Access** me `0.0.0.0/0` add karo (sab IPs allow — development ke liye).
5. **Connect** button → **MongoDB for VS Code** → URI copy karo (`mongodb+srv://...`).
6. Compass me bhi ye URI paste karke connect karo (database ka GUI view milega).

**The .env File — Sensitive Data Security**

`.env` (environment variables) ek plain-text file hai jisme **sensitive/secret values** store ki jaati hain jaise database URIs, API keys, passwords — jo code me hardcode nahi karne chahiye (kyunki GitHub pe public ho sakti hain):

```
# .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/databaseName
PORT=8080
```

**Connecting MongoDB in Node.js**

```javascript
// config.mjs — centralized config file
import dotenv from 'dotenv';
dotenv.config(); // loads .env file into process.env

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
```

```javascript
// index.mjs — main entry point
import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI, PORT } from './config.mjs';
import router from './src/routes/router.mjs';

const app = express();
app.use(express.json());
app.use(router);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Database connected successfully!');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.log('Database connection failed:', err);
    });
```
- **`mongoose.connect(URI)`** — MongoDB Atlas se connection establish karta hai. Ye ek **Promise** return karta hai.
- `.then()` — Agar connection successful ho, **server start** karo (aur tabhi — server ko database connection ke baad start karna best practice hai).
- `.catch()` — Agar connection fail ho, error log karo.
- **`dotenv.config()`** — `.env` file ki saari values `process.env.VARIABLE_NAME` ke form me accessible bana deta hai.
- **Config file** (`config.mjs`) — `.env` values ko ek central location se export karne ka pattern — maintainability ke liye.

**MongoDB Schema — Defining the Data Structure**

Schema MongoDB documents ka **template/blueprint** hota hai:

```javascript
// src/models/userModel.mjs
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number
    },
    course: {
        type: String,
        default: 'Full Stack Development'
    }
});

const User = mongoose.model('User', userSchema);
export default User;
```
- `new mongoose.Schema({...})` — Schema define kiya, jisme har field ka **type** (aur optional properties jaise `required`, `unique`, `default`) bataya.
- `mongoose.model('User', userSchema)` — Ek **Model** banaya. MongoDB automatically `'User'` se **plural, lowercase** collection name derive karta hai (yahan `users` collection banta hai).
- Model ko default export kiya — controller files me import hoga.

**Creating Data — model.create() / new Model().save()**

```javascript
// Controller function
export const createUser = async (req, res) => {
    try {
        const { name, email, age, course } = req.body;

        // Method 1: create() — shorthand
        const newUser = await User.create({ name, email, age, course });

        // Method 2: save() — manual, more control
        // const newUser = new User({ name, email, age, course });
        // await newUser.save();

        res.json({ message: 'User created successfully!', user: newUser });
    } catch (err) {
        res.json({ message: 'Error creating user', error: err.message });
    }
};
```
- `async` function mandatory hai kyunki database operations **asynchronous** hain.
- `await User.create({...})` — MongoDB me ek naya document insert karta hai aur us created document ko return karta hai.
- `try-catch` — Database errors (jaise duplicate email, missing required field) handle karne ke liye.

**Reading Data — model.find()**

```javascript
export const getUsers = async (req, res) => {
    try {
        const users = await User.find(); // returns ALL documents in the collection
        res.json({ users });
    } catch (err) {
        res.json({ message: 'Error fetching users', error: err.message });
    }
};
```
- `User.find()` — Poore collection ke saare documents return karta hai.
- `User.find({ course: 'FSD' })` — Filter ke saath specific documents dhoondha ja sakta hai.

**CORS — Cross-Origin Resource Sharing Error**

Jab React frontend (`localhost:5173`) se Express backend (`localhost:8080`) pe request karta hai, browser ek **CORS Error** throw karta hai — kyunki security policy by-default **alag ports ke beech requests block** karti hai ("Cross-Origin" = different origin/domain/port).

**Fix:**
```bash
npm install cors
```
```javascript
// index.mjs
import cors from 'cors';
app.use(cors()); // allow all cross-origin requests (development setting)
```
- `cors()` middleware saari cross-origin requests allow kar deta hai — development ke liye theek hai.
- Production me specific origins whitelist karna better practice hai (`cors({ origin: 'https://yoursite.com' })`).

**Connecting Frontend (React) to Backend**

```javascript
// In React component (using Axios)
import axios from 'axios';

async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post('http://localhost:8080/create', {
        name, email, age, course
    });
    console.log(response.data);
}
```
- React ka port typically `5173` (Vite) ya `3000` (CRA).
- Backend ka port `.env` me define kiya hua (jaise `8080`).
- Axios POST request me, backend URL poora likhna padta hai (including `http://localhost:PORT`).

## 5. Beginner Explanation

MongoDB ek **warehouse** jaisa hai — data "shelves" (collections) pe "boxes" (documents) ki tarah rakhti hai. **Schema** ek "standardized box template" jaisa hai — kaunsi items us box me allowed hain (name — string, age — number, etc.). **Model** us template ko use karke actual boxes banata hai. **`.env` file** ek "locked safe" jaisi hai — sensitive keys (jaise warehouse ka combination lock) wahan rakho, code me nahi. **CORS** ek "visitor policy" jaisa hai — browser by-default alag-alag offices (ports) ke beech communication block karta hai; `cors` middleware us restriction lift kar deta hai.

## 6. Technical Explanation

**MongoDB** ek **document-oriented NoSQL database** hai — data **BSON (Binary JSON)** format me store hota hai, relational databases ke tables ki jagah **Collections** use hoti hain. Schema-less by nature (documents same collection me alag-alag fields rakh sakte hain), lekin **Mongoose** upar ek schema-enforcement layer add karta hai.

**Mongoose** ek **ODM (Object Document Mapper)** hai — ye JavaScript objects ko MongoDB documents se map karta hai, validation, middleware, aur query helpers provide karta hai.

**`mongoose.connect()`** ek **async operation** hai jo MongoDB Atlas (ya local MongoDB) se TCP connection establish karta hai. `.then()`/`.catch()` ya `async/await` + `try/catch` se handle karna zaroori hai.

**Schema types** — Mongoose ke support kiye jaane wale types: `String`, `Number`, `Boolean`, `Date`, `Buffer` (binary data — images/videos ke liye), `ObjectId` (references ke liye), `Array`, `Mixed`.

**`model.create(data)`** internally ek naya Model instance banata hai, validate karta hai (schema ke against), aur `save()` call karta hai — shorthand convenience method hai.

**CORS (Cross-Origin Resource Sharing)** ek browser security mechanism hai — agar request ka **origin** (protocol + domain + port ka combination) response server ke origin se alag ho, browser us request ko block karta hai — unless server appropriate CORS headers (`Access-Control-Allow-Origin: *`) send kare. `cors` npm package ye headers automatically add karta hai.

## 7. Examples & Code

**Example 1 — Complete Backend File Structure**
```
backend/
├── index.mjs
├── config.mjs
├── .env
├── .gitignore
└── src/
    ├── models/
    │   └── userModel.mjs
    ├── controllers/
    │   └── userController.mjs
    └── routes/
        └── router.mjs
```

**Example 2 — userModel.mjs**
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    course: { type: String, default: 'Full Stack Development' }
});

export default mongoose.model('User', userSchema);
```

**Example 3 — userController.mjs**
```javascript
import User from '../models/userModel.mjs';

export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json({ message: 'Created!', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

## 8. Line-by-Line Explanation

Using **Example 3 — `createUser`**:
1. `import User from '../models/userModel.mjs';` — Mongoose Model import kiya (ye poori collection represent karta hai).
2. `export const createUser = async (req, res) => {` — Async controller function (database operations ke liye zarooori).
3. `const user = await User.create(req.body);` — `req.body` me frontend-bheja JSON data hai — `User.create()` ise MongoDB me save karta hai, `await` operation complete hone tak wait karta hai. Returns saved document.
4. `res.json({ message: 'Created!', user });` — Success response bheja jisme confirmation aur created document dono hain.
5. `} catch (err) {` — Agar koi error ho (validation fail, duplicate key, connection issue), control yahan aata hai.
6. `res.status(400).json({ error: err.message });` — `.status(400)` HTTP error code set karta hai, `.json()` error response bhejta hai.

## 9. Common Mistakes

- MongoDB Atlas me **Network Access** me apna IP whitelist karna bhool jaana — "IP not authorized" jaisi connection error aayegi.
- `.env` file me **special characters** (jaise `@` ya `#`) unquoted rakhna — dotenv parsing issues create kar sakta hai.
- `.gitignore` me `.env` add karna bhool jaana — database credentials publicly expose ho sakte hain GitHub pe.
- `mongoose.connect()` **ke pehle** `app.listen()` call karna — server start ho jaata hai bina database ready hue.
- `async` keyword bina controller function me `await` use karne ki koshish — unhandled Promise warnings ya undefined results.
- Schema me required field bhejana bhool jaana — Mongoose ValidationError throw karega.
- CORS error dekh ke confuse hona — ye browser security hai, `cors` middleware se fix hota hai.

## 10. Best Practices

- **Hamesha `.env` ko `.gitignore` me** rakho — sensitive data commit karna security violation hai.
- Database connection (`mongoose.connect`) ke baad server start karo — ensures data layer ready hai before accepting requests.
- Controllers me hamesha **`try-catch`** use karo — unhandled database errors server crash kar sakte hain.
- HTTP status codes sahi use karo: `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `500` Internal Server Error.
- Schema me appropriate **validators** add karo (`required`, `min`, `max`, `match`, etc.) — data integrity ensure karne ke liye.
- Production me CORS ko specific origins tak limit karo (`cors({ origin: 'https://yourproductiondomain.com' })`).

## 11. Performance Tips

- `mongoose.connect()` ek persistent connection maintain karta hai — har request pe reconnect nahi hota (connection pool use hoti hai internally).
- Frequently queried fields pe MongoDB **indexes** add karo (`unique: true` automatically index banata hai — additional indexes `schema.index()` se add ho sakte hain) — read operations significantly fast ho jaate hain large collections me.

## 12. Security Notes

- **MongoDB Atlas password me special characters avoid karo** — URI encoding issues se bachne ke liye numeric+alpha password prefer karo.
- Database user ko sirf **required permissions** do (Atlas me read/write only, admin nahi) — least privilege principle.
- `.env` credentials ko **regularly rotate** karo, especially if accidentally committed.
- Production me MongoDB connection string ko **server-side only** (Node.js backend) rakho — kabhi frontend code me expose mat karo.

## 13. Interview Questions

1. MongoDB aur SQL (relational) databases me kya fundamental differences hain?
2. Mongoose kya hai? Ye MongoDB se alag kaise hai?
3. Schema aur Model me kya difference hai Mongoose me?
4. `mongoose.connect()` ko `app.listen()` se pehle kyun call karna chahiye?
5. `.env` file ka kya purpose hai? Ise `.gitignore` me kyun add karte hain?
6. CORS error kya hota hai? Ise kaise fix karte hain?
7. `model.create()` aur `new Model().save()` me kya difference hai?
8. `User.find()` kya return karta hai?

## 14. Practice Questions

1. Ek `Product` Schema banao jisme `name` (String, required), `price` (Number, required), `description` (String), `inStock` (Boolean, default: true) ho.
2. `Product` model se `Product.create()` use karke ek product save karo.
3. `Product.find()` se saare products fetch karo aur response me bhejo.
4. Postman me POST request banao — Body → Raw → JSON me product data bhejo aur MongoDB Compass me verify karo ki document save hua.

## 15. Coding Exercises

**Exercise 1:** Full Connection Setup
- `.env` me `MONGO_URI` aur `PORT` define karo, `config.mjs` se export karo, `index.mjs` me `mongoose.connect()` karo.

**Exercise 2:** Product CRUD API
- `productModel.mjs` banao schema ke saath.
- `productController.mjs` me `createProduct` aur `getProducts` functions likho.
- Router me routes define karo, Postman se test karo.

**Exercise 3:** CORS Fix + Frontend Connect
- React frontend (Vite) se Axios se backend POST request karo — pehle CORS error observe karo, phir `cors` middleware add karke fix karo.

## 16. Mini Projects

**Mini Project: User Registration System (Full Stack)**
- **Backend:** Express + Mongoose, `User` model (name, email, age, course), `POST /register` aur `GET /users` routes.
- **Frontend:** React form (Vite), Axios se backend se connect kiya hoa.
- **Flow:** User form fill kare → React Axios POST → Express controller → Mongoose `User.create()` → MongoDB Atlas save → Success response → React me success message.
- MongoDB Compass se live data insertion verify karo.

## 17. Summary

Is module me humne **MongoDB Atlas** cloud database setup kiya, **.env file** se sensitive credentials securely manage karna seekha, aur `mongoose.connect()` se backend ko database se connect kiya. **Schema** (document ka template/blueprint) aur **Model** (Schema se bana, actual collection ke saath interact karta hai) define karna seekha. `async/await` + `try-catch` ke saath **CRUD operations** kiye — `User.create()` (create), `User.find()` (read). **CORS error** ko `cors` middleware se fix kiya. Aur ek complete full-stack flow demonstrate hua — React frontend se Axios POST → Express → Mongoose → MongoDB Atlas.

## 18. Keywords

MongoDB, Atlas, Mongoose, ODM, Schema, Model, mongoose.connect, MONGO_URI, dotenv, .env file, process.env, .gitignore, Collection, Document, model.create, model.find, async/await, try-catch, CORS, cors middleware, MongoDB Compass, HTTP Status Codes.

## 19. Tags
`#mongodb` `#mongoose` `#database` `#schema` `#model` `#crud` `#cors` `#dotenv` `#full-stack` `#backend`

## 20. Suggested Next Topics
- Authentication — bcrypt, JWT, Cookies
- Authorization & Protected Routes (Middleware)

## 21. Related Topics
- Module 27: Express.js Routing (controllers used here)
- Module 15: Async/Await (heavily used in database operations)
- Module 12: try-catch (essential pattern for database error handling)
- Module 29: Authentication (JWT/bcrypt — next backend arc)

---
*End of Module 28. Continuing sequentially to Module 29: Authentication — bcrypt, JWT & Cookies in the next part.*
