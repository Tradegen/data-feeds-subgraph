import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  TradingBotDayData,
  TradingBotHourData,
  VTEDayData,
  VTEHourData,
  TradegenDayData,
  Tradegen,
} from "../types/schema";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
  ONE_BI,
  ZERO_BD,
  ZERO_BI } from "./helpers";

export function updateTradegenDayData(event: ethereum.Event): TradegenDayData {
  let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let tradegenDayData = TradegenDayData.load(dayID.toString());
  if (tradegenDayData === null)
  {
    tradegenDayData = new TradegenDayData(dayID.toString());
    tradegenDayData.date = dayStartTimestamp;
    tradegenDayData.botPerformanceDataFeedUpdateCount = 0;
    tradegenDayData.candlestickDataFeedUpdateCount = 0;
    tradegenDayData.VTEDataFeedUpdateCount = 0;
    tradegenDayData.botDataRequestCount = 0;
    tradegenDayData.VTEDataRequestCount = 0;
    tradegenDayData.revenue = ZERO_BI;
  }

  tradegenDayData.save();

  return tradegenDayData as TradegenDayData;
}

export function updateTradingBotDayData(event: ethereum.Event, isDataRequest: boolean, botPrice: BigInt, fee: BigInt): TradingBotDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let dayTradingBotID = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());
  let tradingBotDayData = TradingBotDayData.load(dayTradingBotID);
  if (tradingBotDayData === null) {
    tradingBotDayData = new TradingBotDayData(dayTradingBotID);
    tradingBotDayData.date = dayStartTimestamp;
    tradingBotDayData.botPerformanceDataFeed = event.address.toHexString();
    tradingBotDayData.numberOfUpdates = 0;
    tradingBotDayData.numberOfDataRequests = 0;
    tradingBotDayData.botPrice = ZERO_BI;
    tradingBotDayData.revenue = ZERO_BI;
  }

  tradingBotDayData.botPrice = botPrice;
  tradingBotDayData.numberOfUpdates = isDataRequest ? tradingBotDayData.numberOfUpdates : tradingBotDayData.numberOfUpdates + 1;
  tradingBotDayData.numberOfDataRequests = isDataRequest ? tradingBotDayData.numberOfDataRequests + 1 : tradingBotDayData.numberOfDataRequests;
  tradingBotDayData.revenue = isDataRequest ? tradingBotDayData.revenue.plus(BigInt.fromString(fee.toString())) : tradingBotDayData.revenue;
  tradingBotDayData.save();

  return tradingBotDayData as TradingBotDayData;
}

export function updateTradingBotHourData(event: ethereum.Event, isDataRequest: boolean, botPrice: BigInt, fee: BigInt): TradingBotHourData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  let hourTradingBotID = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(hourIndex).toString());
  let tradingBotHourData = TradingBotHourData.load(hourTradingBotID);
  if (tradingBotHourData === null) {
    tradingBotHourData = new TradingBotHourData(hourTradingBotID);
    tradingBotHourData.hourStartUnix = hourStartUnix;
    tradingBotHourData.botPerformanceDataFeed = event.address.toHexString();
    tradingBotHourData.numberOfUpdates = 0;
    tradingBotHourData.numberOfDataRequests = 0;
    tradingBotHourData.botPrice = ZERO_BI;
    tradingBotHourData.revenue = ZERO_BI;
  }

  tradingBotHourData.botPrice = botPrice;
  tradingBotHourData.numberOfUpdates = isDataRequest ? tradingBotHourData.numberOfUpdates : tradingBotHourData.numberOfUpdates + 1;
  tradingBotHourData.numberOfDataRequests = isDataRequest ? tradingBotHourData.numberOfDataRequests + 1 : tradingBotHourData.numberOfDataRequests;
  tradingBotHourData.revenue = isDataRequest ? tradingBotHourData.revenue.plus(BigInt.fromString(fee.toString())) : tradingBotHourData.revenue;
  tradingBotHourData.save();

  return tradingBotHourData as TradingBotHourData;
}

export function updateVTEDayData(event: ethereum.Event, isDataRequest: boolean, VTEPrice: BigInt, fee: BigInt): VTEDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let dayVTEID = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());
  let vteDayData = VTEDayData.load(dayVTEID);
  if (vteDayData === null) {
    vteDayData = new VTEDayData(dayVTEID);
    vteDayData.date = dayStartTimestamp;
    vteDayData.VTEDataFeed = event.address.toHexString();
    vteDayData.numberOfUpdates = 0;
    vteDayData.numberOfDataRequests = 0;
    vteDayData.VTEPrice = ZERO_BI;
    vteDayData.revenue = ZERO_BI;
  }

  vteDayData.VTEPrice = VTEPrice;
  vteDayData.numberOfUpdates = isDataRequest ? vteDayData.numberOfUpdates : vteDayData.numberOfUpdates + 1;
  vteDayData.numberOfDataRequests = isDataRequest ? vteDayData.numberOfDataRequests + 1 : vteDayData.numberOfDataRequests;
  vteDayData.revenue = isDataRequest ? vteDayData.revenue.plus(BigInt.fromString(fee.toString())) : vteDayData.revenue;
  vteDayData.save();

  return vteDayData as VTEDayData;
}

export function updateVTEHourData(event: ethereum.Event, isDataRequest: boolean, VTEPrice: BigInt, fee: BigInt): VTEHourData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  let hourVTEID = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(hourIndex).toString());
  let vteHourData = VTEHourData.load(hourVTEID);
  if (vteHourData === null) {
    vteHourData = new VTEHourData(hourVTEID);
    vteHourData.hourStartUnix = hourStartUnix;
    vteHourData.VTEDataFeed = event.address.toHexString();
    vteHourData.numberOfUpdates = 0;
    vteHourData.numberOfDataRequests = 0;
    vteHourData.VTEPrice = ZERO_BI;
    vteHourData.revenue = ZERO_BI;
  }

  vteHourData.VTEPrice = VTEPrice;
  vteHourData.numberOfUpdates = isDataRequest ? vteHourData.numberOfUpdates : vteHourData.numberOfUpdates + 1;
  vteHourData.numberOfDataRequests = isDataRequest ? vteHourData.numberOfDataRequests + 1 : vteHourData.numberOfDataRequests;
  vteHourData.revenue = isDataRequest ? vteHourData.revenue.plus(BigInt.fromString(fee.toString())) : vteHourData.revenue;
  vteHourData.save();

  return vteHourData as VTEHourData;
}