# HumanEval Website

This is the frontend for the HumanEval website, a platform designed to test and improve various cognitive skills through a series of interactive games and challenges.

## Created By

- **Shaikh Mohammad Warsi**: [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shaikh-mohammad-warsi-141532271/)

## Features

- **Chimp Test**: A memory game where you recall the sequence of numbers.
- **Number Memory Test**: Test your ability to remember long sequences of numbers.
- **Reaction Time Test**: Measure your reaction speed.
- **Sequence Memory Test**: Memorize and reproduce sequences of illuminated buttons.
- **Aim Trainer**: Improve your aiming accuracy and speed.
- **Verbal Memory Test**: Keep as many words in short term memory as possible.
- **Visual Memory Test**: Remember an increasingly large board of squares.
- **Typing Test**: How many words per minute can you type?
- **Reading Comprehension Test**: Test your reading speed and comprehension skills.

## Tech Stack

- **Next.js**: React framework for building performant applications.
- **TypeScript**: Strongly typed JavaScript that enhances code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Shadcn/ui**: Re-usable components built using Radix UI and Tailwind CSS.

## Project Structure

```
.gitignore
README.md
app/
├── about/             # About page
├── api/               # API routes
├── dashboard/         # User dashboard
├── feedback/          # Feedback page
├── globals.css        # Global CSS styles
├── help-center/       # Help Center page
├── layout.tsx         # Root layout for the application
├── page.tsx           # Home page
├── profile/           # User profile page
└── tests/             # Dynamic test pages
    └── [testId]/page.tsx
components.json
components/
├── TestCard.tsx       # Component for displaying test cards
├── footer.tsx         # Footer component
├── tests/             # Individual test components
│   ├── aim-trainer-test.tsx
│   ├── chimp-test.tsx
│   ├── number-memory-test.tsx
│   ├── reaction-time-test.tsx
│   ├── reading-comprehension-test.tsx
│   ├── sequence-memory-test.tsx
│   ├── typing-test.tsx
│   ├── verbal-memory-test.tsx
│   └── visual-memory-test.tsx
├── theme-provider.tsx # Theme provider for dark/light mode
├── theme-toggle.tsx   # Theme toggle button
└── ui/                # Shadcn/ui components
hooks/
├── use-mobile.ts      # Custom hook for mobile detection
└── use-toast.ts       # Custom hook for toast notifications
lib/
├── score-context.tsx  # React context for managing scores
└── utils.ts           # Utility functions
next.config.mjs
package-lock.json
package.json
pnpm-lock.yaml
postcss.config.mjs
public/                # Static assets
styles/                # Additional styles
tsconfig.json
```

## Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm or pnpm
- Git

### Steps

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/ShaikhWarsi/HumanEval.git
    cd HumanEval
    ```

2.  **Install dependencies**:

    ```bash
    pnpm install
    # or npm install
    ```

3.  **Run the development server**:

    ```bash
    pnpm dev
    # or npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

Navigate to the `/tests` route to explore the various cognitive games available. Each game is designed to challenge a specific cognitive skill.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/ShaikhWarsi/HumanEval](https://github.com/ShaikhWarsi/HumanEval)
