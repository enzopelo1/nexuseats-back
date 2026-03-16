const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  modulePathIgnorePatterns: [
    "livrable-tp1-tests",
    "livrable-tp1-swagger",
    "livrable-tp2-events",
    "livrable-t1-docker",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/livrable-tp1-tests/",
    "/livrable-tp1-swagger/",
    "/livrable-tp2-events/",
    "/livrable-t1-docker/",
    "/src/restaurants/v2/restaurants-v2.service.spec.ts",
  ],
};