import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  CandlestickDataFeed,
  Candlestick,
  Tradegen,
  BotPerformanceDataFeed
} from "../types/schema";
import {
  UpdatedData
} from "../types/templates/CandlestickDataFeed/CandlestickDataFeed";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
  ONE_BI,
  ZERO_BD,
  ZERO_BI
} from "./helpers";
import {
    updateTradegenDayData,
} from "./dayUpdates";

export function handleUpdatedData(event: UpdatedData): void {
    let candlestickDataFeed = CandlestickDataFeed.load(event.address.toHexString());

    // Update the CandlestickDataFeed entity.
    candlestickDataFeed.numberOfUpdates = candlestickDataFeed.numberOfUpdates + 1;
    candlestickDataFeed.lastUpdated = event.block.timestamp;
    candlestickDataFeed.currentPrice = event.params.close;

    candlestickDataFeed.save();
    
    // Update global values.
    let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.candlestickDataFeedUpdateCount = tradegen.candlestickDataFeedUpdateCount + 1;
    tradegen.save();
    
    // Create a Candlestick entity.
    let candlestickID = candlestickDataFeed.symbol.concat("-").concat(candlestickDataFeed.timeframe.toString()).concat("-").concat(event.block.timestamp.toString());
    let candlestick = new Candlestick(candlestickID);
    candlestick.timestamp = event.block.timestamp;
    candlestick.candlestickDataFeed = event.address.toHexString();
    candlestick.symbol = candlestickDataFeed.symbol;
    candlestick.high = event.params.high;
    candlestick.low = event.params.low;
    candlestick.open = event.params.open;
    candlestick.close = event.params.close;
    candlestick.volume = event.params.volume;
    candlestick.startingTimestamp = event.params.startingTimestamp;
    candlestick.index = event.params.index;
    candlestick.save();
    
    // Update day entities.
    let tradegenDayData = updateTradegenDayData(event);
    tradegenDayData.candlestickDataFeedUpdateCount = tradegenDayData.candlestickDataFeedUpdateCount + 1;
    tradegenDayData.save();
}