export const projects = [
  {
    id: 1,
    number: "01",
    title: "About Me Website",
    slug: "01_about_me_website",
    description: "Build a structured personal introductory webpage using core HTML elements.",
    difficulty: "Beginner",
    estimatedScope: "1-2 Hours",
    techStack: ["HTML"],
    prerequisites: "Basic understanding of HTML tags and structure.",
    whatYouWillLearn: "Creating proper HTML document structure, using semantic tags, building tables, and creating forms.",
    projectGoal: "Create a simple, well-structured 'About Me' page entirely in HTML.",
    coreFeatures: [
      "headings/name",
      "paragraphs",
      "skills/experience table",
      "contact/feedback form",
      "internal and external links"
    ],
    architectureFlow: "Single HTML file (index.html) loaded directly in the browser.",
    stepByStepMilestones: [
      "1. Set up the HTML5 boilerplate.",
      "2. Add your name and a brief bio using headings and paragraphs.",
      "3. Structure your skills and experience using an HTML table.",
      "4. Create a basic contact/feedback form with input fields.",
      "5. Add internal section links and external links to your social profiles."
    ],
    relatedModules: [
      { number: "01", title: "Introduction to Web Development & HTML Fundamentals" },
      { number: "02", title: "HTML Deep Dive — Forms, Semantic Tags, Favicon & Multimedia" }
    ],
    testingChecklist: [
      "Page renders without broken tags.",
      "Links successfully open target URLs.",
      "Form displays inputs and submit button properly."
    ],
    completionCriteria: "The page must use proper semantic HTML and include all requested features.",
    optionalChallenge: "Try adding a favicon to your project."
  },
  {
    id: 2,
    number: "02",
    title: "Interactive Light Switch",
    slug: "02_interactive_light_switch",
    description: "Use JavaScript DOM manipulation to toggle a lightbulb image on and off.",
    difficulty: "Beginner",
    estimatedScope: "1-2 Hours",
    techStack: ["HTML", "CSS", "JavaScript DOM"],
    prerequisites: "Basic HTML/CSS, basic JavaScript syntax.",
    whatYouWillLearn: "Selecting DOM elements and modifying their attributes and styles using JavaScript.",
    projectGoal: "Build an interactive UI element that reacts to button clicks.",
    coreFeatures: [
      "bulb off/on image",
      "Turn On button",
      "Turn Off button",
      "getElementById()",
      "setAttribute()",
      "optional status text"
    ],
    architectureFlow: "HTML UI with JavaScript event listeners targeting specific DOM element IDs.",
    stepByStepMilestones: [
      "1. Create the HTML layout with an image tag and two buttons.",
      "2. Write basic CSS to center the content.",
      "3. Write JavaScript to select the image and buttons using getElementById().",
      "4. Add click event listeners to the buttons.",
      "5. Use setAttribute() inside the listeners to swap the image source."
    ],
    relatedModules: [
      { number: "13", title: "DOM Manipulation — Selectors, Content Changes & Basic Events" }
    ],
    testingChecklist: [
      "Clicking 'Turn On' changes image to bulb-on.",
      "Clicking 'Turn Off' changes image to bulb-off.",
      "Status text updates correctly (if implemented)."
    ],
    completionCriteria: "Both buttons successfully alter the DOM to reflect the state.",
    optionalChallenge: "Use a single toggle button instead of two separate buttons."
  },
  {
    id: 3,
    number: "03",
    title: "Weather App",
    slug: "03_weather_app",
    description: "Fetch and display real-time weather data for a searched city using an external API.",
    difficulty: "Beginner+",
    estimatedScope: "2-4 Hours",
    techStack: ["JavaScript", "APIs", "async/await", "Fetch/Axios"],
    prerequisites: "Understanding of JS Promises, async/await, and DOM manipulation.",
    whatYouWillLearn: "Making asynchronous network requests and handling JSON data.",
    projectGoal: "Create a dynamic app that interacts with a public weather REST API.",
    coreFeatures: [
      "search/use a city",
      "fetch current weather data",
      "show temperature",
      "city name",
      "weather condition",
      "optional icon",
      "loading state",
      "error state"
    ],
    architectureFlow: "User inputs city -> JS async fetch request -> API -> JSON response parsed -> DOM updated.",
    stepByStepMilestones: [
      "1. Build the search input and display UI.",
      "2. Write an async function to fetch data from a weather API.",
      "3. Handle the loading state while waiting for the response.",
      "4. Parse the JSON and update the DOM with temperature and conditions.",
      "5. Implement error handling for invalid cities."
    ],
    relatedModules: [
      { number: "15", title: "Asynchronous JavaScript — Promises, Fetch API, Async/Await & Axios" }
    ],
    testingChecklist: [
      "Valid city returns correct weather data.",
      "Invalid city shows a friendly error message.",
      "Loading indicator is visible during fetch."
    ],
    completionCriteria: "Successfully retrieves and displays weather data from a live API.",
    optionalChallenge: "Fetch and display a 5-day forecast."
  },
  {
    id: 4,
    number: "04",
    title: "Personal Portfolio",
    slug: "04_personal_portfolio",
    description: "Set up a personal portfolio repository using React and Git version control.",
    difficulty: "Intermediate",
    estimatedScope: "3-5 Hours",
    techStack: ["React", "Git", "GitHub"],
    prerequisites: "Basic React setup knowledge, Git CLI basics.",
    whatYouWillLearn: "Managing source code with Git and structuring a React application.",
    projectGoal: "Initialize a React portfolio project and establish a Git workflow.",
    coreFeatures: [
      "personal portfolio UI",
      "Git repository",
      "commits",
      "dev/feature branch",
      "GitHub push",
      "Pull Request / merge workflow"
    ],
    architectureFlow: "Local React app tracked by Git -> pushed to GitHub remote repository.",
    stepByStepMilestones: [
      "1. Initialize a new React project and a Git repository.",
      "2. Create the basic portfolio UI components.",
      "3. Make initial commits to the main branch.",
      "4. Create a feature branch, make UI changes, and commit.",
      "5. Push branches to GitHub and merge via Pull Request."
    ],
    relatedModules: [
      { number: "14", title: "Git & GitHub — Version Control Fundamentals" },
      { number: "16", title: "React.js Fundamentals — History, Virtual DOM & Setup" }
    ],
    testingChecklist: [
      "React app runs locally without errors.",
      "GitHub repo shows commit history.",
      "PR is successfully merged on GitHub."
    ],
    completionCriteria: "A working React app with a verifiable Git history and merged PR.",
    optionalChallenge: "Deploy the portfolio using GitHub Pages."
  },
  {
    id: 5,
    number: "05",
    title: "Multi-Page Company Website",
    slug: "05_multi_page_company_website",
    description: "Build a multi-page React application using React Router.",
    difficulty: "Intermediate",
    estimatedScope: "2-3 Hours",
    techStack: ["React", "React Router"],
    prerequisites: "React components, props, state.",
    whatYouWillLearn: "Implementing client-side routing in a Single Page Application.",
    projectGoal: "Create a website with multiple distinct views navigated without page reloads.",
    coreFeatures: [
      "Home page",
      "About page",
      "Services page",
      "Contact page",
      "BrowserRouter",
      "Routes / Route",
      "Navbar with Link",
      "direct URL navigation test"
    ],
    architectureFlow: "React Router intercepts URL changes and renders mapped components dynamically.",
    stepByStepMilestones: [
      "1. Install react-router-dom.",
      "2. Wrap the app in BrowserRouter.",
      "3. Create the Page components (Home, About, etc.).",
      "4. Define Routes mapping URLs to components.",
      "5. Build a Navbar using Link components."
    ],
    relatedModules: [
      { number: "23", title: "React Router — Multi-Page Navigation" }
    ],
    testingChecklist: [
      "Clicking nav links changes the view instantly.",
      "URL updates correctly in the browser.",
      "Typing a URL directly loads the correct page."
    ],
    completionCriteria: "Smooth navigation between at least 4 pages using React Router.",
    optionalChallenge: "Add a '404 Not Found' wildcard route."
  },
  {
    id: 6,
    number: "06",
    title: "Persistent Login App",
    slug: "06_persistent_login_app",
    description: "Simulate a login flow that remembers the user across page reloads using localStorage.",
    difficulty: "Intermediate",
    estimatedScope: "2-4 Hours",
    techStack: ["React", "localStorage", "useEffect", "useNavigate"],
    prerequisites: "React state, effects, and router.",
    whatYouWillLearn: "Persisting application state in the browser storage.",
    projectGoal: "Build a login mechanism that survives browser refreshes.",
    coreFeatures: [
      "login form",
      "save login information/token-like state in localStorage",
      "welcome-back behavior",
      "check storage on page load",
      "logout",
      "clear storage",
      "navigate after logout"
    ],
    architectureFlow: "Form submit -> update React State & localStorage -> Navigate. On load, useEffect checks storage.",
    stepByStepMilestones: [
      "1. Build the login form UI.",
      "2. On submit, save a mock token or username to localStorage.",
      "3. Use useEffect on app load to check for existing storage data.",
      "4. Conditionally render a 'Welcome' screen or the login form.",
      "5. Implement logout to clear storage and navigate back."
    ],
    relatedModules: [
      { number: "24", title: "Local Storage, Session Storage & useNavigate" }
    ],
    testingChecklist: [
      "Login updates the UI to logged-in state.",
      "Refreshing the page maintains logged-in state.",
      "Logout clears data and redirects to login form."
    ],
    completionCriteria: "State correctly synchronizes with localStorage across sessions.",
    optionalChallenge: "Use sessionStorage instead and observe the difference."
  },
  {
    id: 7,
    number: "07",
    title: "Personal Info / User REST API",
    slug: "07_personal_info_api",
    description: "Create a basic backend server with Node.js and Express to serve personal data.",
    difficulty: "Intermediate",
    estimatedScope: "3-5 Hours",
    techStack: ["Node.js", "Express.js", "REST API"],
    prerequisites: "JavaScript fundamentals, basic understanding of servers.",
    whatYouWillLearn: "Building an HTTP server, defining routes, and sending JSON responses.",
    projectGoal: "Develop a functional REST API using Express and test it with Postman.",
    coreFeatures: [
      "Express server setup",
      "GET / (welcome route)",
      "GET /info (JSON data)",
      "GET /skills (array of skills)",
      "Organized router/controller architecture",
      "Postman testing"
    ],
    architectureFlow: "Client (Postman) -> HTTP GET -> Express Router -> Express Controller -> JSON Response.",
    stepByStepMilestones: [
      "1. Initialize a Node project and install Express.",
      "2. Create the basic Express server listening on a port.",
      "3. Define the root, /info, and /skills routes.",
      "4. Refactor routes and logic into separate Router and Controller files.",
      "5. Test all endpoints using Postman."
    ],
    relatedModules: [
      { number: "26", title: "Node.js & Express.js Fundamentals — Backend Development Introduction" },
      { number: "27", title: "Express.js Routing, HTTP Methods, Controllers & Middleware" }
    ],
    testingChecklist: [
      "Server starts without crashing.",
      "/info returns valid JSON object.",
      "Controllers are correctly separated from route definitions."
    ],
    completionCriteria: "A structured Express app successfully responding to GET requests.",
    optionalChallenge: "Add a POST route that accepts JSON data and logs it."
  },
  {
    id: 8,
    number: "08",
    title: "User Registration System",
    slug: "08_user_registration_system",
    description: "Build a full-stack user registration form that saves data to MongoDB Atlas.",
    difficulty: "Intermediate+",
    estimatedScope: "4-6 Hours",
    techStack: ["React", "Axios", "Express", "Mongoose", "MongoDB Atlas"],
    prerequisites: "React forms, Express API, basic MongoDB knowledge.",
    whatYouWillLearn: "Connecting a frontend form to a backend database using Mongoose.",
    projectGoal: "Persist user registration data from a React frontend into a cloud database.",
    coreFeatures: [
      "React registration form (name, email, age, course)",
      "Axios POST request",
      "Express backend setup",
      "Mongoose User model",
      "POST /register endpoint",
      "GET /users endpoint",
      "MongoDB Atlas persistence",
      "MongoDB Compass verification"
    ],
    architectureFlow: "React form -> Axios POST -> Express controller -> Mongoose User.create() -> MongoDB Atlas -> Success response.",
    stepByStepMilestones: [
      "1. Set up the MongoDB Atlas cluster and connect via Mongoose.",
      "2. Define the User Mongoose schema and model.",
      "3. Build the Express POST /register endpoint.",
      "4. Create the React form and submit data via Axios.",
      "5. Verify data insertion using MongoDB Compass or Atlas UI."
    ],
    relatedModules: [
      { number: "28", title: "MongoDB & Mongoose — Schema, Models, CRUD Operations & .env Setup" }
    ],
    testingChecklist: [
      "React form submits without errors.",
      "Backend returns a success status code.",
      "Document appears in MongoDB Atlas."
    ],
    completionCriteria: "End-to-end data flow from client to cloud database is functional.",
    optionalChallenge: "Add a React page to display all registered users by fetching from GET /users."
  },
  {
    id: 9,
    number: "09",
    title: "Complete Auth System",
    slug: "09_complete_auth_system",
    description: "Implement secure backend authentication using bcrypt and JWT.",
    difficulty: "Advanced",
    estimatedScope: "5-7 Hours",
    techStack: ["Express", "MongoDB", "bcrypt", "JWT"],
    prerequisites: "Express routes, Mongoose, REST principles.",
    whatYouWillLearn: "Password hashing, comparing passwords, and generating secure JWT tokens.",
    projectGoal: "Create a secure, token-based authentication API.",
    coreFeatures: [
      "POST /auth/register",
      "POST /auth/login",
      "input validation",
      "bcrypt password hashing",
      "MongoDB save",
      "bcrypt.compare()",
      "JWT generation",
      "token response",
      "Postman testing",
      "JWT payload inspection"
    ],
    architectureFlow: "Client POSTs credentials -> Express hashes password / verifies -> generates JWT -> Returns token.",
    stepByStepMilestones: [
      "1. Implement user registration with bcrypt to hash passwords.",
      "2. Create the login endpoint using bcrypt.compare().",
      "3. Generate a JSON Web Token (JWT) upon successful login.",
      "4. Test both endpoints using Postman.",
      "5. Inspect the generated JWT structure at jwt.io."
    ],
    relatedModules: [
      { number: "29", title: "Authentication — bcrypt, JWT & Cookies" }
    ],
    testingChecklist: [
      "Passwords are saved as hashes, not plain text.",
      "Login with incorrect password fails.",
      "Login with correct password returns a valid JWT."
    ],
    completionCriteria: "A fully functional, secure authentication API ready for frontend integration.",
    optionalChallenge: "Store the JWT in an HTTP-only cookie instead of returning it in the JSON body."
  },
  {
    id: 10,
    number: "10",
    title: "My Notes Maker — Full-Stack Capstone",
    slug: "10_my_notes_maker",
    description: "Build and deploy a complete, authenticated full-stack application.",
    difficulty: "Advanced / Capstone",
    estimatedScope: "10-15 Hours",
    techStack: ["React", "Express", "MongoDB", "JWT", "Axios", "Netlify", "Render"],
    prerequisites: "Completion of all previous curriculum modules.",
    whatYouWillLearn: "Integrating all full-stack technologies and deploying them to production.",
    projectGoal: "Create a production-ready Notes app with full CRUD capabilities and user authentication.",
    coreFeatures: [
      "Login & Signup pages",
      "Notes dashboard",
      "view, add, and delete notes",
      "JWT-based authentication",
      "persistent login / auto-login after refresh",
      "frontend & backend validation",
      "error handling",
      "CORS & environment variables",
      "protected notes CRUD routes",
      "frontend deployment on Netlify",
      "backend deployment on Render"
    ],
    architectureFlow: "React App (Netlify) <-> Axios + JWT <-> Express API (Render) <-> MongoDB Atlas.",
    stepByStepMilestones: [
      "1. Develop the backend API with protected CRUD routes for notes.",
      "2. Build the React frontend with routing, forms, and Axios integration.",
      "3. Implement the JWT token storage and auto-login logic in React.",
      "4. Connect frontend and backend, testing full end-to-end flows.",
      "5. Configure CORS and environment variables for production.",
      "6. Deploy backend to Render and frontend to Netlify."
    ],
    relatedModules: [
      { number: "30", title: "Authorization Middleware & Protected Routes" },
      { number: "31", title: "Full-Stack Integration, Capstone Project & Deployment" }
    ],
    testingChecklist: [
      "Users can register, login, and stay logged in after a refresh.",
      "Users can only see and delete their own notes.",
      "Production URLs communicate successfully without CORS errors."
    ],
    completionCriteria: "A fully functional, deployed web app accessible via public URLs.",
    optionalChallenge: "Implement an 'Edit Note' feature."
  }
];
