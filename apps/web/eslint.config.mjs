import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextConfig = require("eslint-config-next");

/** @type {import("eslint").Linter.Config[]} */
export default [...nextConfig, { ignores: ["generated/**"] }];
