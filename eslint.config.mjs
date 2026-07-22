import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Tighten the Rules of React / React Compiler checks that eslint-config-next
  // enables (via eslint-plugin-react-hooks' `recommended` config) but leaves soft.
  {
    rules: {
      // Missing deps are a correctness bug, not a style nit.
      "react-hooks/exhaustive-deps": "error",
      // In `recommended-latest` but not `recommended`: flags useMemo whose
      // result is discarded (i.e. used for side effects).
      "react-hooks/void-use-memo": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
