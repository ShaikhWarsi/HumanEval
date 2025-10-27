---

## About the Project: Humval

### Inspiration

Humval was born from a desire to explore and enhance cognitive abilities through engaging and accessible digital tools. The inspiration stemmed from observing the growing interest in brain training and cognitive assessment, coupled with the understanding that traditional methods can often be dry or inaccessible. We aimed to create a platform that not only measures various cognitive functions but also makes the process enjoyable and insightful for users of all backgrounds. The idea was to gamify cognitive assessment, making it a journey of self-discovery and improvement rather than a mere test.

### What I Learned

Throughout the development of Humval, I gained significant experience in several key areas:

*   **Frontend Development with Next.js and React:** I deepened my understanding of Next.js for server-side rendering and static site generation, and honed my React skills in building interactive and responsive user interfaces. This included mastering component-based architecture, state management, and efficient data fetching.
*   **TypeScript for Robustness:** Implementing TypeScript across the project was crucial for catching errors early, improving code readability, and facilitating collaboration. I learned to leverage its type-checking capabilities to build more robust and maintainable codebases.
*   **UI/UX Design Principles:** Designing intuitive and engaging user interfaces for cognitive games presented unique challenges. I learned to prioritize user experience, ensuring that the games were easy to understand, visually appealing, and provided clear feedback.
*   **Dependency Management and Troubleshooting:** Dealing with dependency conflicts, particularly with `npm install` and `vaul` requiring specific React versions, was a valuable learning experience. It reinforced the importance of careful dependency management and the use of tools like `npm install --force` (with caution) for resolving complex versioning issues.
*   **Git Workflow and Conflict Resolution:** Managing version control with Git, including handling merge conflicts, stashing changes, and rebasing, became a routine part of the development process. This experience was vital for maintaining a clean and collaborative codebase.

### How I Built My Project

Humval was built using a modern web development stack, primarily focusing on:

*   **Next.js:** As the foundational framework, Next.js provided a robust structure for the application, enabling efficient routing, API routes, and optimized performance.
*   **React:** All interactive UI components were developed using React, leveraging its declarative nature to create dynamic and responsive user experiences.
*   **TypeScript:** The entire codebase was written in TypeScript, ensuring type safety and improving code quality and maintainability.
*   **Shadcn/ui:** This component library was utilized to accelerate UI development, providing pre-built, accessible, and customizable components that adhere to modern design principles.
*   **Tailwind CSS:** For styling, Tailwind CSS was employed for its utility-first approach, allowing for rapid and consistent styling across the application.
*   **Git:** Version control was managed using Git, with a focus on regular commits, branching for features, and merging changes.

The development process involved:

1.  **Initial Setup:** Setting up the Next.js project with TypeScript and integrating Shadcn/ui and Tailwind CSS.
2.  **Game Development:** Implementing individual cognitive games as React components, each with its own logic, state management, and UI.
3.  **Routing and Navigation:** Establishing clear routing for different games and information pages using Next.js's routing capabilities.
4.  **Deployment:** Deploying the application to Vercel, which provided seamless integration with Next.js.

### Challenges I Faced

Several challenges arose during the development of Humval, each providing valuable learning opportunities:

*   **Dependency Conflicts:** One of the most significant hurdles was resolving `npm` dependency conflicts, particularly with `vaul` and `react` versions. This required careful examination of `package.json`, understanding peer dependencies, and sometimes resorting to `npm install --force` after thorough consideration. This experience highlighted the complexities of managing a large number of packages and their interdependencies.
*   **Syntax Errors and Debugging:** Initial deployment failures due to "Unexpected token `default`" errors in `app/tests/[testId]/page.tsx` required meticulous debugging. This involved carefully inspecting the code for unclosed objects and ensuring correct JavaScript/TypeScript syntax.
*   **Git Merge Conflicts:** As the project evolved, managing Git branches and merging changes led to occasional conflicts, especially with files like `.gitignore` and `LICENSE`. Learning to effectively use `git status`, `git stash`, and `git pull` to resolve these conflicts was crucial for maintaining a smooth development workflow.
*   **Optimizing Performance:** Ensuring that the cognitive games ran smoothly and responsively required attention to performance optimization, including efficient state updates and rendering.
*   **Designing Engaging UI:** Crafting a user interface that was both functional and aesthetically pleasing for a diverse set of cognitive games was an iterative process, requiring constant refinement based on user feedback and design principles.

---