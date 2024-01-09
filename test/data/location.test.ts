import { expect, test } from "bun:test";
import {
  defaultLocation,
  deleteLocation,
  getLocation,
  setLocation,
} from "../../src/data/location";

test("get user location", async () => {
  const key = "test";
  const worked = await setLocation(key, defaultLocation);
  const location = await getLocation("test");
  expect(location).toBe(defaultLocation);
});

test("set user location", async () => {
  const key = "test";
  const value = "outer_space";

  const worked = await setLocation(key, value);
  expect(worked).toBeTruthy();

  const location = await getLocation(key);
  expect(location).toBe(value);
});

test("delete location", async () => {
  const key = "test";

  const worked = await deleteLocation(key);
  expect(worked).toBeTruthy();

  const location = await getLocation("test");
  expect(location).toBe(defaultLocation);
});
