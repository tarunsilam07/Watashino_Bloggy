import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", // Next.js core recommendations
    "next/typescript" // TypeScript-specific rules for Next.js
  ),
  {
    rules: {
      // Disable TypeScript's no-explicit-any rule to prevent blocking valid code
      "@typescript-eslint/no-explicit-any": "off",
      // Allow the usage of img tags (next/image preferred but not enforced)
      "@next/next/no-img-element": "off",
      // Suppress dependency array warnings for useEffect
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];

export default eslintConfig;
