import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import nodePlugin from "eslint-plugin-n";
import importX from "eslint-plugin-import-x";
import security from "eslint-plugin-security";

export default defineConfig([
  // ── Ignore patterns (replaces .eslintignore) ─────────────────────
  globalIgnores(["dist/**", "node_modules/**", "coverage/**", "*.d.ts"]),

  // ── Base JS rules (applies to ALL files) ─────────────────────────
  {
    files: ["**/*.{js,cjs,mjs,ts}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...globals.node,
      },
    },
    rules:{
      "no-useless-catch": "off",
    }
  },

  // ── TypeScript rules ──────────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ── Node.js specific rules ────────────────────────────────────────
  {
    files: ["**/*.{js,ts}"],
    plugins: { n: nodePlugin },
    rules: {
      // "n/no-process-exit": "error",           // use throw/next(err) instead
      "n/no-deprecated-api": "error",         // catch deprecated Node APIs
      "n/prefer-promises/fs": "warn",         // prefer fs.promises over callbacks
      "n/no-sync": "warn",                    // avoid sync methods (blocks event loop)
    },
  },

  // ── Import hygiene ────────────────────────────────────────────────
  {
    files: ["**/*.{js,ts}"],
    plugins: { "import-x": importX },
    rules: {
      "import-x/no-duplicates": "error",      // no duplicate imports
      "import-x/no-self-import": "error",     // no file importing itself
      "import-x/no-cycle": "warn",            // warn on circular dependencies
      "import-x/no-useless-path-segments": "warn",
    },
  },

  // ── Security rules (critical for Express) ────────────────────────
  {
    files: ["**/*.{js,ts}"],
    plugins: { security },
    rules: {
      // "security/detect-object-injection": "warn",   // obj[userInput] vulnerabilities
      "security/detect-non-literal-regexp": "warn", // ReDoS vulnerabilities
      "security/detect-non-literal-fs-filename": "warn", // path traversal
      "security/detect-possible-timing-attacks": "warn", // timing attacks in auth
      "security/detect-eval-with-expression": "error",   // no eval()
    },
  },

  // ── TypeScript + Express specific overrides ───────────────────────
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",           // enables type-aware rules
      },
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      // Unused vars — allow underscore-prefixed and Express next()
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_|^next",
        varsIgnorePattern: "^_",
      }],

      // Express error handlers need explicit any sometimes
      "@typescript-eslint/no-explicit-any": "warn",

      // Async Express handlers must be awaited or caught
      "@typescript-eslint/no-floating-promises": "error",

      // Safer type assertions
      "@typescript-eslint/consistent-type-assertions": ["error", {
        assertionStyle: "as",
      }],

      // Enforce explicit return types on route handlers
      "@typescript-eslint/explicit-function-return-type": ["warn", {
        allowExpressions: true,               // allows inline arrow functions
      }],

      "no-console": "off",                   // console.log is fine in backend
      "eqeqeq": ["error", "always"],
    },
  },

  // ── Test file overrides (if using Jest/Vitest) ────────────────────
  {
    files: ["**/*.{test,spec}.{js,ts}", "**/__tests__/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "n/no-sync": "off",
    },
  },
]);