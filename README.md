# Pokémon App

A React application for browsing and managing a list of Pokémon, viewing their details, and saving favorites.

## 🚀 Overview

This project is a simple Pokémon explorer built with React and TypeScript. It allows users to:

- View a list of Pokémon.
- Click on a Pokémon to view detailed information.
- Mark Pokémon as favorites and view them in a dedicated Favorites page.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) (v19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Code Formatting**: [Prettier](https://prettier.io/)

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd pokemon-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🏃‍♂️ Usage

- **Start the development server:**

  ```bash
  npm run dev
  ```

  Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **Run tests:**

  ```bash
  npm run test
  ```

  Launches the test runner in interactive watch mode.

- **Build for production:**

  ```bash
  npm run build
  ```

  Builds the app for production to the `dist` folder.

- **Preview production build:**

  ```bash
  npm run preview
  ```

  Preview the production build locally.

- **Format code:**

  ```bash
  npm run format
  ```

  Formats the code using Prettier.

- **Deploy to GitHub Pages:**
  
  The application is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.
  
  Access the deployed app at: [http://rubencanovaca.github.io/pokemon-app](http://rubencanovaca.github.io/pokemon-app)

## 📂 Project Structure

```
pokemon-app/
├── .vscode/
│   └── settings.json
├── dist/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── FavoriteButton.tsx
│   │   ├── PokemonCard.tsx
│   │   └── ShowMessage.tsx
│   ├── context/
│   │   ├── FavoritesContext.tsx
│   │   └── MessageContext.tsx
│   ├── hooks/
│   │   ├── useFavorites.ts
│   │   └── useMessage.ts
│   ├── pages/
│   │   ├── DetailPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── PokemonList.tsx
│   ├── utils/
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tests/
│   ├── DetailPage.test.tsx
│   ├── FavoriteButton.test.tsx
│   ├── FavoritesPage.test.tsx
│   ├── PokemonCard.test.tsx
│   ├── PokemonList.test.tsx
│   ├── ShowMessage.test.tsx
│   └── setupTests.ts
├── .gitignore
├── .prettierignore
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
