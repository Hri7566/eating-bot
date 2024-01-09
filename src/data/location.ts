import db from "./db";

export const locdb = db.sublevel("locations");
export const defaultLocation = "home";

export async function getLocation(_id: string) {
  // Get location of user
  let location: string;

  try {
    location = await locdb.get(_id);
  } catch (err) {
    location = defaultLocation;
  }

  return location;
}

export async function setLocation(_id: string, location: string) {
  // Set location of user
  try {
    await locdb.put(_id, location);
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteLocation(_id: string) {
  try {
    await locdb.del(_id);
    return true;
  } catch (err) {
    return false;
  }
}
