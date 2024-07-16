import { FangoClient } from "@fango/client";
import {
  createConnection,
  getConnections,
  updateConnection,
} from "@/lib/database";
import { findChannelsAction, sendMessageToChannelAction } from "@/action/slack";
import {
  deleteSheetRowAction,
  findSheetNameAction,
  findSheetRowAction,
  findSheetsAction,
  findSpreadsheetsAction,
  getSheetValuesAction,
  insertSheetRowAction,
  updateSheetRowAction,
} from "@/action/google-sheets";

const fangoClient = new FangoClient(
  process.env.NANGO_HOST!,
  process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY!
);

fangoClient.setConnectionDatabase({
  getConnections,
  updateConnection,
  createConnection,
});

fangoClient.setServerActions("slack", {
  findChannelsAction,
  sendMessageToChannelAction,
});

fangoClient.setServerActions("google-sheets", {
  insertSheetRowAction,
  findSheetRowAction,
  updateSheetRowAction,
  deleteSheetRowAction,
  findSheetsAction,
  findSpreadsheetsAction,
  findSheetNameAction,
  getSheetValuesAction,
});

export { fangoClient };
