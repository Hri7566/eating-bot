import YAML from "yaml";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path/posix";

export function loadConfig<T = unknown>(path: string, defaultConfig: T) {
  // Load config file from disk

  // If it doesn't exist, create it first
  if (!existsSync(path)) createConfig(path, defaultConfig);

  // Load the config file in all cases
  const raw = readFileSync(path);
  const config = YAML.parse(raw.toString());

  // Cast as defaultConfig for completion
  return config as T;
}

export function createConfig<T = unknown>(path: string, config: T) {
  // Force-create config file

  // Make sure directory exists first
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir);

  // Write config file
  writeFileSync(path, YAML.stringify(config));
}
