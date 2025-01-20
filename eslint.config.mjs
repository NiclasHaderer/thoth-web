import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import eslint from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default tseslint.config(
  compat.extends("next/core-web-vitals"),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": 1,
      "@typescript-eslint/no-misused-promises": 0,
      "@typescript-eslint/no-unused-expressions": 0,
      "@next/next/no-img-element": 0,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  }
)
