import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettier from "eslint-config-prettier"
import pluginPrettier from "eslint-plugin-prettier"

export default [
  {
    files: ["**/*.ts", "eslint.config.mjs"]
  },
  // eslint.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier: pluginPrettier
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module"
    },

    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"]
        }
      ],

      curly: "warn",
      eqeqeq: "warn",
      "no-throw-literal": "warn",
      semi: "warn",
      "prettier/prettier": "error"
    }
  },
  prettier
]
