import re
import os

translations = {
    "03": "This module covers the practical foundation of CSS, including selectors, the Box Model, the display property, and the crucial concept of box-sizing.",
    "04": "This module covers CSS layout techniques by building a responsive design using Flexbox and viewport-relative units.",
    "05": "This module introduces JavaScript history, setup, core concepts of variables, and basic data types for building interactive websites.",
    "06": "This module covers JavaScript Control Flow statements, including decision-making with conditionals (if-else) and execution loops (for).",
    "07": "This module covers JavaScript Functions, focusing on how to define, invoke, pass arguments, and return values using traditional and arrow functions.",
    "08": "This module covers JavaScript Arrays, explaining how to store collections of data and manipulate them using essential built-in array methods.",
    "09": "This module covers advanced JavaScript array iteration techniques, variable hoisting, and the rest operator.",
    "10": "This module covers fundamental JavaScript Objects, including object syntax, property manipulation, and key-value iteration techniques.",
    "11": "This module covers advanced JavaScript object concepts, including get/set keywords and the critical difference between Value and Reference types.",
    "12": "This module covers essential built-in JavaScript objects like Math, String, and Date, along with standard error handling using try-catch blocks.",
    "13": "This module covers DOM Manipulation, demonstrating how to bridge JavaScript and HTML to select elements, update content, and listen to user events.",
    "14": "This module introduces Git and GitHub, explaining the essential version control workflow for tracking code changes and collaborating remotely.",
    "15": "This module covers Asynchronous JavaScript concepts, including the Event Loop, Promises, and data fetching techniques using async/await and Axios.",
    "16": "This module introduces React, covering its history, Component-Based Architecture, the Virtual DOM, and the foundational setup of a React environment.",
    "17": "This module covers core daily React development patterns, including creating components, rendering elements, and passing data securely using Props.",
    "18": "This module covers Conditional Rendering in React, using if-else statements, ternary operators, and logical AND operators to control UI state dynamically.",
    "19": "This module covers practical project architecture for React, separating components from pages, and introduces CSS Modules to avoid class name collisions.",
    "20": "This module covers the two most critical React Hooks: useState for managing component state and useEffect for handling side effects like data fetching.",
    "21": "This module covers form handling techniques in React, comparing Controlled Components using state against Uncontrolled Components using the useRef hook.",
    "22": "This module covers advanced React state architecture concepts like Lifting State Up for sharing data, and demonstrates the limitations of Prop Drilling.",
    "23": "This module covers React Router, enabling multi-page URL navigation and routing architecture within Single Page Applications.",
    "24": "This module covers Browser Storage methods like localStorage and sessionStorage for persisting client-side data, and introduces programmatic navigation.",
    "25": "This module introduces Redux Toolkit for scalable global state management, demonstrating its implementation alongside a traditional React application.",
    "26": "This module introduces backend development with Node.js and Express.js, covering server architecture, the Request-Response cycle, and API testing with Postman.",
    "27": "This module covers structured Express.js architecture, demonstrating the separation of routes and controllers alongside essential JSON parsing middleware.",
    "28": "This module covers MongoDB and Mongoose, focusing on cloud database setup, Schema modeling, and performing CRUD operations in a full-stack environment.",
    "29": "This module covers essential backend security, implementing User Registration with password hashing, and Login APIs using JSON Web Tokens (JWT).",
    "30": "This module covers Authorization Middleware, creating reusable functions to automatically verify JWT tokens and secure protected API routes.",
    "31": "This module culminates the course by integrating the frontend, backend, database, and authentication into a Full-Stack application deployed to production."
}

with open("src/lib/curriculumData.js", "r", encoding="utf-8") as f:
    content = f.read()

def replacer(match):
    block = match.group(0)
    number_match = re.search(r"\"number\":\s*\"(\d+)\"", block)
    if number_match:
        mod_num = number_match.group(1)
        if mod_num in translations:
            new_desc = translations[mod_num].replace("\"", "\\\"")
            block = re.sub(r"\"description\":\s*\".*?\",", f"\"description\": \"{new_desc}\",", block, flags=re.DOTALL)
    return block

new_content = re.sub(r"\{[^{}]*\"number\":\s*\"\d+\"[^{}]*\}", replacer, content)

with open("src/lib/curriculumData.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated curriculumData.js successfully with shortened descriptions.")
