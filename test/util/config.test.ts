import { test, expect } from "bun:test";
import { rmSync } from "fs";
import { loadConfig } from "../../src/util/config";

interface TestConfig {
  apples: number;
  supply: {
    carrots: number;
  };
}

const testConfigPath = "./test.yml";

test("Default config loading", () => {
  const config = loadConfig<TestConfig>(testConfigPath, {
    apples: 1,
    supply: {
      carrots: 12,
    },
  });

  expect(config.apples).toBe(1);
  expect(config.supply).toBeDefined();
  expect(config.supply.carrots).toBe(12);
});

test("Config loading", () => {
  const config = loadConfig<TestConfig>(testConfigPath, {
    apples: 2,
    supply: {
      carrots: 18,
    },
  });

  expect(config.apples).toBe(1);
  expect(config.supply).toBeDefined();
  expect(config.supply.carrots).toBe(12);

  rmSync(testConfigPath);
});
