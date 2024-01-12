import { MPPChatMessage } from "../commands/commands";
import { getInventory, getItemCount } from "../data/inventory";
import { LocationalItem } from "../location/locations";
import { Bot } from "../mpp/bot";

export const bhvPick = new Map<
  LocationalItem["id"],
  (
    msg: MPPChatMessage,
    bot: Bot | false
  ) => Promise<[boolean, string | undefined]>
>();

bhvPick.set("lemon", async (msg, bot) => {
  const inv = await getInventory(msg.p._id);
  const count = getItemCount(inv, "lemon");
  if (count < 10) return [true, undefined];
  return [false, undefined];
});
