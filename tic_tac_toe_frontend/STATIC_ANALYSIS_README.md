# Static Analysis Setup Guide (tic_tac_toe_frontend)

This frontend container currently lacks application source files and linting/formatting configuration. Follow these steps to enable static analysis:

1) Initialize the project (choose one)
   - Vite (recommended):
     - npm create vite@latest . -- --template react
     - npm install
   - Create React App (if preferred):
     - npx create-react-app . 
     - npm install

2) Install linting and formatting tools:
   npm install -D eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier prettier

3) Create the following files (if not already present):
   - .eslintrc.cjs (see example in this repository under config examples if added)
   - .prettierrc.json
   - .prettierignore
   - Add scripts in package.json:
     {
       "scripts": {
         "lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\"",
         "lint:fix": "eslint \"src/**/*.{js,jsx,ts,tsx}\" --fix",
         "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
         "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\""
       }
     }

4) Optional TypeScript:
   npm install -D typescript @types/react @types/react-dom
   - Add tsconfig.json and update ESLint parser for TS.

5) Run checks:
   - npm run lint
   - npm run format:check
   - If TS: npx tsc --noEmit

6) Environment variables:
   The existing .env contains REACT_APP_* variables; ensure your bundler (Vite/Cra) reads them appropriately.

Once these steps are completed and the app code is present in src/, static analysis can be run, and issues will be reported with file locations and line numbers.
