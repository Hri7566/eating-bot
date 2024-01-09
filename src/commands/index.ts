import { getInventory, getInventoryDetails } from "../data/inventory";
import { getLocation, setLocation } from "../data/location";
import {
  findLocationFuzzy,
  findNearby,
  getLocationFromTable,
  getLocationItemDetails,
  isNearby,
} from "../location/locations";
import { Command, commands } from "./commands";

export const prefixes = ["--"];

export function addCommands() {
  new Command(
    ["help", "h", "commands", "cmds"],
    "Show help menu and get command usage",
    "help [command]",
    (msg, bot) => {
      if (msg.args[1]) {
        let found: Command | undefined;

        for (const command of commands) {
          if (command.aliases.includes(msg.args[1])) {
            found = command;
            break;
          }
        }

        if (!found) return `No such command "${msg.args[1]}".`;
        return `Description: ${found.description} | Usage: ${found.usage}`;
      } else {
        return `Commands: ` + commands.map((cmd) => cmd.aliases[0]).join(" | ");
      }
    }
  );

  new Command(["about", "a"], "About the bot", "about", (msg, bot) => {
    return `This bot was made by Hri7566.`;
  });

  new Command(
    ["inventory", "inv"],
    "List your items (or someone else's)",
    "inventory [user_id]",
    async (msg, bot) => {
      let _id = msg.p._id;
      if (msg.args[1]) _id = msg.args[1];

      let inv = await getInventory(_id);
      return getInventoryDetails(inv) + ` (also a Map)`;
    }
  );

  const whereAnswers = [
    "You look at a map and find yourself at {LOCATION}.",
    "According to your map, you are at {LOCATION}.",
    "The map says you are at {LOCATION}.",
    "Your map indicates you are at {LOCATION}.",
    "Reading the map, your location is approximately at {LOCATION}.",
    "As you run your fingers down the map, you come across the name {LOCATION}. Looking at local landmarks, this must be where you are at.",
    "You stare at the map for a few minutes and recognize some landmarks. You appear to be at {LOCATION}.",
  ];

  new Command(
    ["whereami", "where", "w"],
    "Find your approximate location on the map",
    "whereami",
    async (msg, bot) => {
      let locid = await getLocation(msg.p._id);
      let loc = getLocationFromTable(locid);
      let r = Math.floor(Math.random() * whereAnswers.length);
      return whereAnswers[r].split("{LOCATION}").join(loc?.displayName);
    }
  );

  const goAnswers = [
    "You go to {LOCATION}.",
    "You travel to {LOCATION}.",
    "You transport yourself to {LOCATION}.",
    "You decide to travel to {LOCATION}.",
    "You decided that {LOCATION} is a better place for you right now, so you go there.",
    "You are now at {LOCATION}.",
    "You find yourself at {LOCATION}.",
    "Having enough of {CURR_LOCATION}, you travel to {LOCATION}.",
  ];

  new Command(
    ["go"],
    "Go somewhere nearby",
    "go <location>",
    async (msg, bot) => {
      const currentLocationId = await getLocation(msg.p._id);
      const currentLocation = getLocationFromTable(currentLocationId);

      const argcat = msg.args.slice(1).join(" ");
      const wantToGoFuzzy = argcat;

      const wantToGo = findLocationFuzzy(wantToGoFuzzy);
      if (!wantToGo) return `There's no such thing as ${wantToGoFuzzy}`;

      if (!isNearby(currentLocationId, wantToGo.id))
        return `That place isn't close enough, you should try to ${msg.usedPrefix}${msg.usedCommand.aliases[0]} somewhere ${msg.usedPrefix}nearby.`;

      const loc = getLocationFromTable(wantToGo.id);
      const worked = await setLocation(msg.p._id, wantToGo.id);
      if (!worked) return `You can't go to ${msg.args[1]}.`;
      let r = Math.floor(Math.random() * goAnswers.length);
      return goAnswers[r]
        .split("{LOCATION}")
        .join(loc.displayName)
        .split("{CURR_LOCATION}")
        .join(currentLocation.displayName);
    }
  );

  new Command(
    ["nearby"],
    "Look around to find nearby places.",
    "nearby",
    async (msg, bot) => {
      const currentLocationId = await getLocation(msg.p._id);
      const nearby = findNearby(currentLocationId);

      return `Nearby places to visit: ${nearby
        .map((id) => getLocationFromTable(id).displayName)
        .join(", ")}`;
    }
  );

  new Command(
    ["look"],
    "Look around for things that might be useful.",
    "look",
    async (msg, bot) => {
      const locid = await getLocation(msg.p._id);
      return `You see: ${getLocationItemDetails(locid)}`;
    }
  );
}
