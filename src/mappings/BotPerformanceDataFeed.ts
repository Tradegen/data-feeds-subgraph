import { BigInt } from "@graphprotocol/graph-ts";
import {
  Order,
  DataRequest,
  Tradegen,
  BotPerformanceDataFeed
} from "../types/schema";
import {
  UpdatedData,
  GetTokenPrice,
  UpdatedUsageFee
} from "../types/templates/BotPerformanceDataFeed/BotPerformanceDataFeed";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
} from "./helpers";
import {
    updateTradegenDayData,
    updateTradingBotDayData,
    updateTradingBotHourData
} from "./dayUpdates";

export function handleUpdatedData(event: UpdatedData): void {
    let botPerformanceDataFeed = BotPerformanceDataFeed.load(event.address.toHexString());

    // Update the BotPerformanceDataFeed entity.
    botPerformanceDataFeed.numberOfUpdates = botPerformanceDataFeed.numberOfUpdates + 1;
    botPerformanceDataFeed.lastUpdated = event.block.timestamp;
    botPerformanceDataFeed.save();
    
    // Update global values.
    let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.botPerformanceDataFeedUpdateCount = tradegen.botPerformanceDataFeedUpdateCount + 1;
    tradegen.save();
    
    // Create an Order entity.
    let orderID = botPerformanceDataFeed.tradingBot.concat("-").concat(event.params.index.toString());
    let order = new Order(orderID);
    order.timestamp = event.block.timestamp;
    order.botPerformanceDataFeed = event.address.toHexString();
    order.symbol = event.params.asset;
    order.isBuy = event.params.isBuy;
    order.orderTimestamp = event.block.timestamp;
    order.assetPrice = event.params.assetPrice;
    order.botPrice = event.params.botPrice;
    order.index = event.params.index;
    order.save();
    
    // Update day entities.
    let tradegenDayData = updateTradegenDayData(event);
    tradegenDayData.botPerformanceDataFeedUpdateCount = tradegenDayData.botPerformanceDataFeedUpdateCount + 1;
    tradegenDayData.save();

    let tradingBotDayData = updateTradingBotDayData(event, false, event.params.botPrice, botPerformanceDataFeed.usageFee);
    let tradingBotHourData = updateTradingBotHourData(event, false, event.params.botPrice, botPerformanceDataFeed.usageFee);
}

export function handleUpdatedUsageFee(event: UpdatedUsageFee): void {
    let botPerformanceDataFeed = BotPerformanceDataFeed.load(event.address.toHexString());
    botPerformanceDataFeed.usageFee = event.params.newFee;
    botPerformanceDataFeed.save();
}

export function handleGetTokenPrice(event: GetTokenPrice): void {
    let botPerformanceDataFeed = BotPerformanceDataFeed.load(event.address.toHexString());

    // Update the BotPerformanceDataFeed entity.
    botPerformanceDataFeed.numberOfDataRequests = botPerformanceDataFeed.numberOfDataRequests + 1;
    botPerformanceDataFeed.revenue = botPerformanceDataFeed.revenue.plus(BigInt.fromString(event.params.amountPaid.toString()))
    botPerformanceDataFeed.save();

    // Update global values.
    let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.botDataRequestCount = tradegen.botDataRequestCount + 1;
    tradegen.totalRevenue = tradegen.totalRevenue.plus(BigInt.fromString(event.params.amountPaid.toString()))
    tradegen.save();

    // Create a DataRequest entity.
    let dataRequestID = botPerformanceDataFeed.tradingBot.concat("-").concat(event.params.caller.toHexString()).concat("-").concat(event.block.timestamp.toString());
    let dataRequest = new DataRequest(dataRequestID);
    dataRequest.timestamp = event.block.timestamp;
    dataRequest.botPerformanceDataFeed = event.address.toHexString();
    dataRequest.requestor = event.params.caller.toHexString();
    dataRequest.feePaid = event.params.amountPaid;
    dataRequest.botPrice = event.params.tokenPrice;
    dataRequest.save();

    // Update day entities.
    let tradegenDayData = updateTradegenDayData(event);
    tradegenDayData.botDataRequestCount = tradegenDayData.botDataRequestCount + 1;
    tradegenDayData.save();

    let tradingBotDayData = updateTradingBotDayData(event, true, event.params.tokenPrice, event.params.amountPaid);
    let tradingBotHourData = updateTradingBotHourData(event, true, event.params.tokenPrice, event.params.amountPaid);
}