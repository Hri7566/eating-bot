import { MPPChatMessage } from "../commands/commands";
import { LocationalItem } from "../location/locations";
import { Bot } from "../mpp/bot";

export const bhvPick = new Map<
  LocationalItem["id"],
  (msg: MPPChatMessage, bot: Bot) => boolean
>();

export function canPick(_id: string, itemId: string) {}

bhvPick.set("lemon", (msg, bot) => {
  return true;
});
