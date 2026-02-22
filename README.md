# Popsicle Stand

A web-based management simulation game where you run your own popsicle stand! Manage your inventory, set prices, and try to maximize your daily profit while dealing with changing weather conditions and customer demand.

## Tech Stack
This project was originally built with Vanilla TypeScript and Webpack, and has recently been refactored into a modern, reactive web application using:
- **[Svelte](https://svelte.dev/)**: For a reactive, component-based UI and built-in transition animations.
- **[TypeScript](https://www.typescriptlang.org/)**: For robust type-safe game logic.
- **[Vite](https://vitejs.dev/)**: For lightning-fast development and optimized production builds.

## Getting Started

To run the game locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (which includes `npm`).

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd popsicle-stand
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Game
Start the local Vite development server:
```bash
npm run dev
```
Then, open your browser and navigate to the URL provided in your terminal (usually `http://localhost:5173/`).

### Building for Production
To create an optimized production build of the game:
```bash
npm run build
```
This will compile the app and output the static files into the `dist/` directory.

## Future Plans
- **Capacitor Integration**: The app's layout is responsive and designed to be easily wrapped into a native iOS app using Capacitor in the future.
