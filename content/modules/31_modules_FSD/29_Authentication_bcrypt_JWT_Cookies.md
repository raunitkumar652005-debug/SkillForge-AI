# Module 29: Authentication — bcrypt, JWT & Cookies

---

## 1. Overview

Is module me **Authentication aur Authorization** — backend ke sabse important security topics — cover kiye gaye. Instructor ne pehle dono terms ka conceptual difference explain kiya, phir practically implement kiya: **User Registration API** (Schema validation + bcrypt password hashing), **JWT (JSON Web Token)** generation aur structure (header, payload, signature), aur **Login API** (password verification + token send karna). Ye module directly previous MongoDB/Mongoose module pe build karta hai.

## 2. Prerequisites

- Module 28 (MongoDB, Mongoose, Schema, CRUD) completed.
- Module 27 (Express routing, controllers, middleware) completed.
- Module 12 (try-catch) aur Module 15 (async/await) strong understanding.

## 3. Learning Objectives

- **Authentication** aur **Authorization** ka conceptual difference samajhna.
- Kyun passwords **plain-text me store nahi karne chahiye** — hashing ka importance.
- **bcrypt** library install aur use karna — password ko hash karna (`bcrypt.hash()`).
- **Salt rounds** ka concept samajhna.
- **JWT (JSON Web Token)** ka structure samajhna — Header, Payload, Signature.
- `SECRET_TOKEN` kya hota hai aur `.env` me kyun rakha jaata hai.
- **User Registration flow** implement karna — validation → hash password → save to DB.
- **User Login flow** implement karna — find user → `bcrypt.compare()` → JWT generate → send token.
- **Cookies** se token securely frontend ko bhejne ka concept samajhna.

## 4. Cleaned Transcript (Hinglish)

**Authentication vs Authorization — The Difference**

- **Authentication** — Kya tum wahi ho jo hone ka claim kar rahe ho? Jaise ek user ne signup/login kiya — wo is website ke liye ek "authentic" (verified) user hai.
- **Authorization** — Login hone ke baad, tum kya-kya kar sakte ho? Jaise ek Admin user ke paas sab kuch delete karne ki permission hai, ek regular User ke paas sirf read karne ki. In permissions ko control karna **Authorization** hai.

Real-world example: Google pe ek baar login karo — phir wo automatically logged-in rehta hai. Ye hota hai **JWT (JSON Web Token)** ki wajah se — har baar login nahi karna padta kyunki ek secure "token" already browser me store ho jata hai.

**Why Not Store Passwords as Plain-Text?**

Agar passwords as-is database me store hon, aur koi ek bhi company employee (ya hacker) database access kare — wo sabke passwords directly dekh sakta hai. Ye **user privacy ki badi violation** hai aur legally bhi punishable hai. Isliye passwords ko **hash** karke store kiya jaata hai.

**bcrypt Library — Password Hashing**

```bash
npm install bcrypt
```

bcrypt ek password hashing library hai:
```javascript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
```
- **`bcrypt.hash(password, saltRounds)`** — Password ka ek **irreversible hash** generate karta hai.
- **Salt Rounds (10)** — Hashing algorithm kitne baar apply hogi — zyada rounds = zyada secure (10 ek industry-standard good number hai). Iska matlab hai ki koi brute-force attack se bhi easily crack nahi kar sakta.
- **Key point:** Hashed password se original password **wapas nahi nikala ja sakta** — hashing ek **one-way operation** hai. Login ke time, entered password ko dobara hash karke stored hash se **compare** kiya jaata hai.

**JWT — JSON Web Token**

JWT ek encoded **string token** hai jisme ek authenticated user ke baare me information hoti hai, jo **securely share** ki ja sakti hai. JWT ka structure **3 parts** hote hain (base64 encoded, `.` se separate):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header
.
eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ  ← Payload
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

- **Header** — Algorithm type (jaise HS256) aur token type ("JWT") contain karta hai.
- **Payload** — User ka data (jaise user ID, role) — ye **readable** hai (sensitive data mat daalo).
- **Signature** — Header + Payload ko ek **SECRET_TOKEN** (`.env` me rakha hua private key) se sign karta hai. Isse verify kiya ja sakta hai ki token tamper nahi kiya gaya.

**SECRET_TOKEN in .env:**
```
SECRET_TOKEN=mysupersecretkey123
```
Ye secret key kisi ko bhi nahi pata honi chahiye — isi se JWT signature banti aur verify hoti hai.

**User Schema (for Auth)**

```javascript
// models/userModel.mjs
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['admin', 'user', 'guest'],
            message: 'Role: admin, user, and guest are only allowed'
        }
    },
    age: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```
- **`enum`** — Field ke allowed values restrict karta hai. Agar koi aur value di jaaye (jaise `"gaurav"`), Mongoose validation error throw karega.
- **`timestamps: true`** — Automatically `createdAt` aur `updatedAt` fields add karta hai.

**User Registration API — Complete Flow**

```javascript
// controllers/userController.mjs
import bcrypt from 'bcrypt';
import User from '../models/userModel.mjs';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, age } = req.body;

        // Step 1: Manual validation
        if (!name) return res.status(400).send({ status: 'Failed', message: 'Name is required' });
        if (!email) return res.status(400).send({ status: 'Failed', message: 'Email is required' });
        if (!password) return res.status(400).send({ status: 'Failed', message: 'Password is required' });
        if (!role) return res.status(400).send({ status: 'Failed', message: 'Role is required' });
        if (!age) return res.status(400).send({ status: 'Failed', message: 'Age is required' });

        // Step 2: Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 3: Create the user with hashed password
        const createdUser = await User.create({
            name, email,
            password: hashedPassword, // ← NEVER store plain-text!
            role, age
        });

        res.status(201).send({ status: 'Success', data: createdUser });

    } catch (err) {
        if (err.message.includes('validation')) {
            return res.status(400).send({ status: 'Failed', message: err.message });
        } else if (err.message.includes('duplicate')) {
            return res.status(400).send({ status: 'Failed', message: 'Email already exists' });
        } else {
            return res.status(500).send({ status: 'Failed', error: err });
        }
    }
};
```

**User Login API — JWT Generation**

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET_TOKEN } from '../../config.mjs'; // from .env

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Find user in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ status: 'Failed', message: 'User not found' });
        }

        // Step 2: Compare entered password with stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({ status: 'Failed', message: 'Invalid credentials' });
        }

        // Step 3: Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // payload
            SECRET_TOKEN,                           // secret key
            { expiresIn: '7d' }                    // token expiry
        );

        // Step 4: Send token in response (or as a cookie)
        res.status(200).send({ status: 'Success', token });

    } catch (err) {
        res.status(500).send({ status: 'Failed', error: err.message });
    }
};
```

**JWT Token Expiry (`expiresIn: '7d'`)** — Token 7 din baad automatically invalid ho jaata hai — user ko dobara login karna padega. Ye security ke liye important hai.

**Cookies — Where to Store the Token**

Token frontend pe **dono jagah** store kiya ja sakta hai — `localStorage` ya **cookies**. Production me `httpOnly cookies` prefer kiye jaate hain (JavaScript se access nahi ho sakti — XSS attack se safe):

```javascript
// Sending token as a cookie (more secure)
res.cookie('token', token, {
    httpOnly: true,     // JavaScript can't access this cookie
    secure: true,       // HTTPS only
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
});
res.status(200).send({ status: 'Login Successful' });
```

## 5. Beginner Explanation

Authentication ko socho jaise ek club ka bouncer — pehle tumhara ID card check hota hai (login/registration). **bcrypt** ek magic shredder jaisa hai — tumhara original password leke use ek unreadable pieces me badal deta hai (hash). Database me wahi pieces store hote hain, original nahi — chahe koi database hack kare, original password nahi milega. **JWT** ek "stamped wristband" jaisa hai jo club mein entry ke baad milta hai — ab baar-baar ID check nahi hota, wristband dikhao aur andar jao. **SECRET_TOKEN** woh special stamp hai jo sirf club owner ke paas hota hai — isi se wristband authentic hai ya fake, verify hota hai.

## 6. Technical Explanation

**bcrypt** ek adaptive password hashing algorithm hai jo intentionally **slow** hai (unlike MD5/SHA) — iska purpose brute-force attacks ko computationally expensive banana hai. Salt rounds badhane se hashing time exponentially badhta hai. `bcrypt.compare(plain, hash)` internally plain password ko same salt se hash karke stored hash se compare karta hai — ye **safe comparison** hai jo timing attacks se bhi protected hai.

**JWT** ek open standard (RFC 7519) hai. Teeno parts base64URL-encoded hote hain:
- Header: `{"alg":"HS256","typ":"JWT"}`
- Payload: `{"userId":"abc123","role":"admin","iat":1620000,"exp":1620604800}`
- Signature: `HMACSHA256(base64(header) + "." + base64(payload), SECRET_TOKEN)`

Signature verify karne ke liye server ko sirf `SECRET_TOKEN` chahiye — payload easily decode ho jaata hai (sensitive info mat daalo), lekin **tamper nahi ho sakta** kyunki signature invalidate ho jaayega.

**`httpOnly` cookies** JavaScript se completely inaccessible hote hain — XSS attacks jaise page pe injected malicious scripts bhi inhe read nahi kar sakte — isliye ye `localStorage` se zyada secure hai JWT store karne ke liye.

## 7. Examples & Code

**Example 1 — Hash aur Compare**
```javascript
import bcrypt from 'bcrypt';

const plain = "myPassword123";
const hashed = await bcrypt.hash(plain, 10);
console.log(hashed); // "$2b$10$..." — unreadable hash

const isMatch = await bcrypt.compare("myPassword123", hashed); // true
const isWrong = await bcrypt.compare("wrongPassword", hashed); // false
```

**Example 2 — JWT Sign aur Verify**
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: "123", role: "admin" }, "mySecret", { expiresIn: "1d" });
console.log(token); // "eyJ..." long encoded string

const decoded = jwt.verify(token, "mySecret");
console.log(decoded); // { userId: "123", role: "admin", iat: ..., exp: ... }
```

## 8. Line-by-Line Explanation

Using the Login API:
1. `User.findOne({ email })` — DB me us email ke saath ek user dhoondha.
2. `if (!user) return res.status(404)` — Agar user nahi mila, "not found" error bheja (email match nahi hua).
3. `const isPasswordCorrect = await bcrypt.compare(password, user.password)` — User ne jo password enter kiya (plain) aur DB me stored hash — compare kiya bina original dekhye.
4. `if (!isPasswordCorrect) return res.status(400)...` — Password match nahi hua toh "Invalid credentials" error.
5. `jwt.sign({ userId, role }, SECRET_TOKEN, { expiresIn: '7d' })` — Ek JWT generate kiya — payload me user ID aur role rakha, SECRET_TOKEN se sign kiya, 7 din ki expiry di.
6. `res.status(200).send({ status: 'Success', token })` — Token frontend ko bheja — browser ise `localStorage` ya cookie me store karega.

## 9. Common Mistakes

- Password ko plain-text me `User.create()` me daalna — kabhi nahi karna chahiye, hamesha pehle `bcrypt.hash()` karo.
- `SECRET_TOKEN` ko code me hardcode karna — `.env` file me rakho, GitHub pe expose nahi hona chahiye.
- JWT payload me sensitive data (passwords, credit card info) daalna — payload base64 decode ho sakta hai, encrypt nahi hota.
- `bcrypt.compare()` me arguments ka order galat karna — pehle plain password, phir hashed password.
- Token expiry na dena — agar token expire nahi hoga, ek baar leaked token hamesha valid rahega.
- `jwt.verify()` me galat SECRET_TOKEN use karna — token verification fail hoga.

## 10. Best Practices

- Salt rounds **10** rakho minimum — development me thoda slow lagta hai lekin production security ke liye zaroori hai.
- JWT tokens ko **`httpOnly` cookies** me store karo (localStorage ki jagah) — XSS attacks se better protection.
- Token payload me sirf **minimum necessary data** rakho (user ID, role) — personal info nahi.
- **Token expiry hamesha set karo** (`expiresIn`) — `'7d'`, `'1h'`, `'30m'` jaisi values use karo.
- Ek **Refresh Token mechanism** implement karo long-term sessions ke liye (advanced topic).

## 11. Performance Tips

- bcrypt hashing intentionally slow hai — isko background/async me handle karo (already `await bcrypt.hash()` se kiya gaya) taaki event loop block na ho.
- JWT verification fast hota hai (symmetric key algorithm) — har protected route pe verify karna performance-wise feasible hai.

## 12. Security Notes

- **NEVER store plain-text passwords** — ye legal violation bhi hai GDPR/privacy laws ke under.
- JWT tokens ko **never** non-httpOnly cookies ya localStorage me store mat karo agar highly sensitive app hai — XSS vulnerability.
- **Rate limiting** implement karo login endpoint pe (express-rate-limit library) — brute-force attacks se bachne ke liye (advanced topic).
- Error messages me zyada detail mat do — "User not found" aur "Wrong password" alag-alag message dene ki bajay generic "Invalid credentials" use karna better security practice hai (user enumeration attacks se bachne ke liye).

## 13. Interview Questions

1. Authentication aur Authorization me kya difference hai?
2. Passwords plain-text me store kyun nahi karne chahiye?
3. bcrypt kya karta hai aur salt rounds ka kya role hai?
4. JWT ka structure kya hota hai? Teeno parts kya represent karte hain?
5. JWT ka Payload readable kyun hai (encrypted kyun nahi)?
6. `bcrypt.hash()` aur `bcrypt.compare()` ka use kab kiya jaata hai?
7. `jwt.sign()` aur `jwt.verify()` me kya fark hai?
8. `localStorage` vs `httpOnly cookie` — token storage ke liye kaunsa better hai aur kyun?
9. SECRET_TOKEN ko `.env` me kyun rakha jaata hai?

## 14. Practice Questions

1. bcrypt use karke "myPassword123" ka hash generate karo, phir correct aur incorrect password dono test karo.
2. jwt.sign() se ek token banao jisme `{ userId: "abc", role: "admin" }` payload ho aur 1 day expiry ho.
3. Ek login controller likho jo email se user dhoonde, bcrypt.compare() se password verify kare, aur JWT token return kare.
4. Registration controller me kya-kya validations lagane chahiye? List karo.

## 15. Coding Exercises

**Exercise 1:** Password Hashing Practice
- Ek simple script banao jo command line argument se password le, hash kare, verify kare.

**Exercise 2:** Complete Registration Endpoint
- User model, controller, aur route banao — validation + bcrypt hashing ke saath.

**Exercise 3:** Login Endpoint
- findOne se user dhoondo, bcrypt.compare(), jwt.sign() — complete login flow implement karo.

## 16. Mini Projects

**Mini Project: Complete Auth System**
- Routes: `POST /auth/register` aur `POST /auth/login`
- Register: Validation → bcrypt hash → MongoDB save
- Login: Find user → bcrypt compare → JWT generate → Send response
- Postman se test karo: pehle register karo (correct aur incorrect data dono se), phir login karo, received JWT ko https://jwt.io pe paste karke decode karo aur payload verify karo.

## 17. Summary

Is module me humne **Authentication (login/registration)** aur **Authorization (permissions)** ka farak samjha. Humne **bcrypt** se passwords ka secure hashing seekha (irreversible, salt-rounds se brute-force resistant), **JWT (JSON Web Token)** ka 3-part structure (Header, Payload, Signature) samjha aur `jwt.sign()` se generate karna. Complete **Registration API** (validation + hashing + MongoDB save) aur **Login API** (find user + bcrypt.compare() + JWT generate + send) implement ki. **Cookies vs localStorage** ka token-storage security comparison bhi cover kiya.

## 18. Keywords

Authentication, Authorization, bcrypt, password hashing, salt rounds, one-way hash, JSON Web Token (JWT), Header, Payload, Signature, SECRET_TOKEN, jwt.sign, jwt.verify, bcrypt.hash, bcrypt.compare, httpOnly cookie, token expiry, User Registration, Login API, findOne.

## 19. Tags
`#authentication` `#authorization` `#jwt` `#bcrypt` `#password-security` `#backend` `#expressjs` `#security` `#advanced`

## 20. Suggested Next Topics
- Authorization & Protected Routes — Middleware for token verification
- Frontend-Backend Auth Integration (connecting React login form to this backend)

## 21. Related Topics
- Module 28: MongoDB & Mongoose (user model used here)
- Module 27: Express Controllers & Middleware
- Module 24: Local Storage (frontend token storage alternative discussed here)

---
*End of Module 29. Continuing sequentially to Module 30: Authorization Middleware & Protected Routes in the next part.*
