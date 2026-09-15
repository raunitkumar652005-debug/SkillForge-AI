# Module 30: Authorization Middleware & Protected Routes

---

## 1. Overview

Is module me **Authorization Middleware** cover kiya gaya — ek reusable middleware function jo protected API routes pe **automatically JWT token verify** karta hai. Instructor ne dikhaya ki kaise Bearer token ko Authorization header se extract kiya jaata hai, `jwt.verify()` se validate kiya jaata hai, aur `next()` se request ko agle handler pe forward kiya jaata hai — ya error return kiya jaata hai agar token invalid/missing ho. Ye module Module 29 (Authentication/JWT generation) ka direct continuation hai.

## 2. Prerequisites

- Module 29 (Authentication — bcrypt, JWT generation) completed.
- Module 27 (Express Middleware concept — `app.use()`, `next()`) completed.

## 3. Learning Objectives

- **Middleware function** ka pattern (`req, res, next`) samajhna.
- **Authorization header** se Bearer token extract karna.
- **`jwt.verify()`** se token validate karna.
- Token valid hone par **`next()`** call karke request forward karna.
- Token invalid/missing hone par appropriate **error response** return karna.
- Protected routes pe middleware **"sandwiching"** — route handler se pehle middleware lagana.
- **Postman** me Authorization → Bearer Token bhejne ka process.

## 4. Cleaned Transcript (Hinglish)

**Why a Separate Auth Middleware File?**

Login ke baad, jab bhi user koi protected API call kare (jaise apna profile fetch kare), backend ko verify karna padta hai ki:
1. Kya request ke saath ek valid JWT token hai?
2. Kya wo token genuine hai (tamper nahi kiya gaya)?

Agar ye verification **har controller me** likhni pade — 10,000 APIs me 10,000 baar — bahut inefficient aur repetitive hoga. Iske bajaye ek **single middleware function** banate hain (`auth.mjs`), jo ek baar likhne ke baad **har protected route pe** easily laga sakte hain.

**Creating auth.mjs — The Middleware Function**

```javascript
// src/auth/auth.mjs
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../../config.mjs';

export const authentication = async (req, res, next) => {
    try {
        // Step 1: Extract Authorization header
        const header = req.headers.authorization;
        // header looks like: "Bearer eyJhbGciOiJIUzI1NiJ9..."

        // Step 2: Split out the actual token (index [1] after splitting by space)
        const token = header.split(' ')[1]; // "eyJhbGciOiJIUzI1NiJ9..."

        // Step 3: Verify the token
        const decodedToken = jwt.verify(token, SECRET_TOKEN);

        // Step 4: Attach decoded user info to request for downstream use
        req.user = decodedToken;

        // Step 5: Pass to the next middleware/route handler
        next();

    } catch (err) {
        return res.status(401).json({
            status: 'Failed',
            message: 'Authentication failed — invalid or expired token'
        });
    }
};
```

**Breaking Down the Flow:**
- `req.headers.authorization` — Client jab bhi Postman (ya React frontend) se request bhejta hai, Authorization header me JWT token aata hai. Format hota hai: `"Bearer <token>"`.
- `.split(' ')[1]` — String ko space se tod deta hai do parts me — `["Bearer", "eyJ..."]` — humein index `1` chahiye (sirf actual token, "Bearer" text nahi).
- `jwt.verify(token, SECRET_TOKEN)` — Token ko validate karta hai. Agar:
  - Token **valid** hai → Decoded payload (e.g. `{ userId: "abc", role: "admin" }`) return karta hai.
  - Token **invalid/expired/tampered** → Exception throw karta hai → `catch` block execute hoga.
- `req.user = decodedToken` — Decoded data ko `req` object pe attach kar diya — ab aage ke handlers me `req.user.userId` ya `req.user.role` access kar sakte hain (without calling database).
- **`next()`** — Bahut important! Middleware ka "signal" ki aage badhna chahiye — agar `next()` nahi bolte, request yahan **stuck** ho jaati hai aur route handler kabhi execute nahi hota.

**Using the Middleware on Protected Routes**

```javascript
// src/routes/router.mjs
import { authentication } from '../auth/auth.mjs';
import { getUser, createUser } from '../controllers/userController.mjs';

// Public routes (no auth needed)
router.post('/register', createUser);
router.post('/login', loginUser);

// Protected routes (auth middleware applied BEFORE the handler)
router.get('/users', authentication, getUser); // ← authentication runs first, THEN getUser
```
- `authentication` middleware **route aur controller handler ke beech** daala gaya — jaise ek "gate" jo pehle check karta hai, phir andar jaane deta hai.
- **Multiple middlewares** ek route pe chain ki ja sakti hain: `router.get('/path', middleware1, middleware2, handler)`.

**Testing in Postman — Sending Bearer Token**

1. Pehle `/login` API call karo → response me token mile.
2. Us token ko copy karo.
3. Protected endpoint (`/users` GET) pe jaao.
4. Postman me **Authorization** tab pe jao.
5. Type me **Bearer Token** select karo.
6. Token paste karo.
7. Send karo → Request ke Authorization header me automatically `"Bearer <token>"` add ho jaayega.

**Full Header Flow (Console Demo)**

Instructor ne dikhaya: `console.log(req.headers)` karne pe poore headers print hote hain — jisme `authorization: "Bearer eyJ..."` visible hota hai. Fir `header.split(' ')[1]` se sirf token part extract hua. Tab `jwt.verify()` ne use decode karke `{ userId: "abc", role: "admin", iat: ..., exp: ... }` return kiya.

**What Happens Without a Token (or Wrong Token)?**
- Agar request me Authorization header hi nahi → `header` undefined → `.split()` throws error → `catch` block → `401 Unauthorized`.
- Agar token expired hai → `jwt.verify()` throws `TokenExpiredError` → `catch` → `401`.
- Agar token tamper kiya gaya (signature invalid) → `jwt.verify()` throws `JsonWebTokenError` → `catch` → `401`.

## 5. Beginner Explanation

Socho middleware ek **security guard** hai jo hotel ke har restricted room ke baahir khada hai. Jab bhi koi room me jaana chahta hai (protected API call), guard pehle ID card (JWT token) check karta hai. Agar card valid hai, guard "Okay, aao" (`next()`) keh deta hai — agar invalid, "Bahar jao" (`401 error`). Sab se acchi baat — ek baar guard hire karo (middleware likho), use jitne bhi rooms ke baahir lagana ho laga do — baar-baar alag guard nahi hire karna.

## 6. Technical Explanation

Express middleware ek function hai jise three arguments milte hain: `req` (incoming request), `res` (outgoing response), aur `next` (ek callback jo next middleware/handler ko invoke karta hai). Middleware chain me, agar `next()` call nahi hota aur response bhi nahi bheja jaata, request **hang** ho jaati hai.

**JWT Verification process (jwt.verify()):**
- Token ke teeno parts (header.payload.signature) ko decode karta hai.
- Signature ko `SECRET_TOKEN` se recompute karke compare karta hai — agar match nahi, tamper detect hoti hai.
- `exp` (expiry) claim ko current timestamp se compare karta hai — agar expiry past ho gayi, `TokenExpiredError` throw hoti hai.
- Successful verification pe decoded **payload object** return hota hai.

**`req.user` pattern** — Decoded data ko `req` object pe attach karna ek standard Express pattern hai (bhi `passport.js` jaisi libraries isi tarah kaam karti hain) — isse subsequent middlewares aur route handlers user identity access kar sakte hain **bina database query kiye** (fast, stateless).

**401 vs 403 Status Codes:**
- **401 Unauthorized** — Token missing/invalid — "Who are you?"
- **403 Forbidden** — Token valid, lekin user ke paas permission nahi — "I know who you are, but you can't do this"

## 7. Examples & Code

**Example 1 — Complete Auth Middleware**
```javascript
// src/auth/auth.mjs
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../../config.mjs';

export const authentication = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = header.split(' ')[1];
        const decodedToken = jwt.verify(token, SECRET_TOKEN);
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({
            status: 'Failed',
            message: 'Authentication failed',
            error: err.message
        });
    }
};
```

**Example 2 — Applying Middleware to Routes**
```javascript
// router.mjs
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authentication, getUserProfile); // protected!
router.delete('/account', authentication, deleteAccount); // protected!
```

**Example 3 — Using req.user in a Controller**
```javascript
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.user; // set by auth middleware
        const user = await User.findById(userId).select('-password'); // exclude password
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

## 8. Line-by-Line Explanation

Using **Example 1**:
1. `const header = req.headers.authorization;` — Authorization header access kiya (`"Bearer eyJ..."` format).
2. `if (!header) return res.status(401)...` — Agar header hi nahi, early return — token nahi diya.
3. `const token = header.split(' ')[1];` — Space pe split kiya → `["Bearer", "eyJ..."]` → index 1 se actual token.
4. `const decodedToken = jwt.verify(token, SECRET_TOKEN);` — Token verify kiya same secret se jisse sign kiya tha — agar tamper ya expired, exception.
5. `req.user = decodedToken;` — Decoded payload (`{userId, role}`) ko `req` pe store kiya — aage waale handlers use karenge.
6. `next();` — Middleware done, request aage forward karo handler pe.
7. `} catch (err) { return res.status(401)...` — Koi bhi error (invalid/expired/missing token) 401 response ke saath handle.

## 9. Common Mistakes

- **`next()` call karna bhool jaana** — Sab kuch sahi hone pe bhi request hang ho jaayegi.
- **Authorization header aur token ko confuse karna** — Poora `"Bearer token"` string ko directly `jwt.verify()` me daalna — sirf token part hi `verify()` me jaana chahiye, "Bearer " prefix nahi.
- **401 aur 403** confusion — 401 = "Who are you?" (missing/invalid token), 403 = "You don't have permission" (valid token, insufficient role).
- **`secret.split(' ')[1]` na karna aur poora header verify karne ki koshish** — error aayegi.
- Middleware ko route ke **baad** lagana — `router.get('/path', handler, authentication)` — middleware ko **pehle** aana chahiye.

## 10. Best Practices

- Auth middleware file ko `src/auth/` ya `src/middleware/` jaise dedicated folder me rakho — controllers/routes se separation.
- **Early return** karo agar header missing hai — unnecessary processing avoid karo.
- `req.user` me hamesha **minimal data** rakho (user ID, role) — entire user object nahi (extra DB queries).
- **Token expiry check** automatically `jwt.verify()` karta hai — manually `exp` field check karne ki zaroorat nahi.
- Sensitive routes pe **authorization** bhi add karo (role-based) authentication ke baad — jaise sirf `admin` role wale users hi delete operations kar sakein.

## 11. Performance Tips

- `jwt.verify()` fast synchronous cryptographic operation hai — performance negligible, har request pe safe hai.
- `req.user` me user data store karne se **database hits eliminate** hote hain protected routes pe — direct token se user identity milti hai.

## 12. Security Notes

- **`SECRET_TOKEN` ko `.env` me rakho** — kabhi code me hardcode mat karo.
- Error message me token ka koi detail expose mat karo — generic "Authentication failed" message dena better security practice.
- **Token blacklisting** — JWT stateless hai, issued token ko individually revoke nahi kar sakte (unlike sessions). Production me logout ke liye token blacklist (Redis me) ya short expiry times implement karo.
- **HTTPS only** — Tokens ki transport security ensure karo — plain HTTP pe tokens intercept ho sakte hain.

## 13. Interview Questions

1. Express middleware function me `next()` parameter ka kya role hai?
2. JWT token ko request header se kaise extract karte hain, aur `.split()` kyun lagana padta hai?
3. `jwt.verify()` fail kab hota hai?
4. `req.user` pe decoded token store karne ka kya faayda hai?
5. 401 aur 403 HTTP status codes me kya difference hai?
6. Middleware ko route handler se pehle kyun apply karna zaroori hai?
7. Agar `next()` call nahi kiya middleware me, toh kya hoga?

## 14. Practice Questions

1. Ek auth middleware likho jo Authorization header se token extract kare, verify kare, aur `req.user` set kare.
2. Ek protected route define karo jo auth middleware use kare aur `req.user.userId` se user ka profile fetch kare.
3. Ek scenario describe karo jahan `401` appropriate hai aur ek jahan `403` appropriate hai.

## 15. Coding Exercises

**Exercise 1:** Complete Auth Middleware
- `auth.mjs` file banao complete middleware ke saath — missing header check, token extraction, jwt.verify(), next().

**Exercise 2:** Protected Profile Route
- `/profile` GET route banao jo auth middleware ke baad `req.user` se userId leke user find kare.

**Exercise 3:** Role-Based Authorization
- Auth middleware ke baad ek **authorization** middleware banao (`isAdmin`) jo `req.user.role !== 'admin'` hone par 403 return kare.

## 16. Mini Projects

**Mini Project: Complete Auth Flow Test**
- Register endpoint se user banao.
- Login endpoint se token lo.
- Protected `/profile` endpoint pe Bearer token ke saath request karo — profile data aane chahiye.
- Galat/expired token bhejo — 401 aana chahiye.
- Bina token ke request karo — 401 with "No token provided" aana chahiye.
- MongoDB Compass me verify karo ki passwords hashed hain (plain-text nahi).

## 17. Summary

Is module me humne **Authorization Middleware** pattern implement kiya — ek reusable `authentication` function jo `req.headers.authorization` se Bearer token extract karta hai, `jwt.verify()` se validate karta hai, `req.user` pe decoded data store karta hai, aur `next()` se request forward karta hai. Protected routes pe ye middleware route handler se **pehle** laga diya jaata hai — ek **"gate"** ki tarah jo har unauthorized access block karta hai. Ye Module 29 (JWT generation) ko complete karta hai — ab register → login → protected API access ka poora Auth cycle cover ho gaya.

## 18. Keywords

Authorization Middleware, authentication function, req.headers.authorization, Bearer Token, Bearer prefix, jwt.verify, next, next(), req.user, decoded token, protected routes, middleware chain, 401 Unauthorized, 403 Forbidden, TokenExpiredError, JsonWebTokenError.

## 19. Tags
`#authorization` `#middleware` `#jwt-verify` `#protected-routes` `#bearer-token` `#backend` `#security` `#expressjs`

## 20. Suggested Next Topics
- Full-Stack Integration — Connecting React Frontend to Express Backend
- Deployment (Vercel for frontend, Render/Railway for backend)

## 21. Related Topics
- Module 29: Authentication — bcrypt, JWT (where tokens were generated)
- Module 27: Express Middleware concept
- Module 15: Async/Await (used in middleware)

---
*End of Module 30. Continuing sequentially to Module 31: Full-Stack Integration & Deployment in the next part.*
