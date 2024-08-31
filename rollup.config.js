import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import alias from "rollup-plugin-alias";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";

const config = [
  {
    input: "index.ts",
    output: [
      {
        file: "build/index.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      peerDepsExternal(),
      alias({
        applicationRoot: `${__dirname}`,
      }),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: "tsconfig-rollup.json",
      }),
    ],
  },
];

export default config;
