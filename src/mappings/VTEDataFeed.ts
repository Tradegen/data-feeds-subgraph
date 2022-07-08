import { BigInt } from "@graphprotocol/graph-ts";
import {
  VTEOrder,
  DataRequest,
  Tradegen,
  VTEDataFeed
} from "../types/schema";
import {
  UpdatedData,
  GetTokenPrice,
  UpdatedUsageFee
} from "../types/templates/VTEDataFeed/VTEDataFeed";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
} from "./helpers";
import {
    updateTradegenDayData,
    updateVTEDayData,
    updateVTEHourData
} from "./dayUpdates";

export function handleUpdatedData(event: UpdatedData): void {
    let vteDataFeed = VTEDataFeed.load(event.address.toHexString());

    // Update the VTEDataFeed entity.
    vteDataFeed.numberOfUpdates = vteDataFeed.numberOfUpdates + 1;
    vteDataFeed.lastUpdated = event.block.timestamp;
    vteDataFeed.save();
    
    // Update global values.
    let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.VTEDataFeedUpdateCount = tradegen.VTEDataFeedUpdateCount + 1;
    tradegen.save();
    
    // Create an Order entity.
    let orderID = vteDataFeed.VTE.concat("-").concat(event.params.index.toString());
    let order = new VTEOrder(orderID);
    order.timestamp = event.block.timestamp;
    order.VTEDataFeed = event.address.toHexString();
    order.symbol = event.params.asset;
    order.isBuy = event.params.isBuy;
    order.orderTimestamp = event.block.timestamp;
    order.assetPrice = event.params.assetPrice;
    order.leverageFactor = event.params.leverageFactor;
    order.index = event.params.index;
    order.save();
    
    // Update day entities.
    let tradegenDayData = updateTradegenDayData(event);
    tradegenDayData.VTEDataFeedUpdateCount = tradegenDayData.VTEDataFeedUpdateCount + 1;
    tradegenDayData.save();

    updateVTEDayData(event, false, event.params.VTEPrice, vteDataFeed.usageFee);
    updateVTEHourData(event, false, event.params.VTEPrice, vteDataFeed.usageFee);
}

export function handleUpdatedUsageFee(event: UpdatedUsageFee): void {
    let vteDataFeed = VTEDataFeed.load(event.address.toHexString());
    vteDataFeed.usageFee = event.params.newFee;
    vteDataFeed.save();
}

export function handleGetTokenPrice(event: GetTokenPrice): void {
    let vteDataFeed = VTEDataFeed.load(event.address.toHexString());

    // Update the VTEDataFeed entity.
    vteDataFeed.numberOfDataRequests = vteDataFeed.numberOfDataRequests + 1;
    vteDataFeed.revenue = vteDataFeed.revenue.plus(BigInt.fromString(event.params.amountPaid.toString()))
    vteDataFeed.save();

    // Update global values.
    let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.VTEDataRequestCount = tradegen.VTEDataRequestCount + 1;
    tradegen.totalRevenue = tradegen.totalRevenue.plus(BigInt.fromString(event.params.amountPaid.toString()))
    tradegen.save();

    // Create a DataRequest entity.
    let dataRequestID = vteDataFeed.VTE.concat("-").concat(event.params.caller.toHexString()).concat("-").concat(event.block.timestamp.toString());
    let dataRequest = new DataRequest(dataRequestID);
    dataRequest.timestamp = event.block.timestamp;
    dataRequest.VTEDataFeed = event.address.toHexString();
    dataRequest.requestor = event.params.caller.toHexString();
    dataRequest.feePaid = event.params.amountPaid;
    dataRequest.VTEPrice = event.params.tokenPrice;
    dataRequest.save();

    // Update day entities.
    let tradegenDayData = updateTradegenDayData(event);
    tradegenDayData.VTEDataRequestCount = tradegenDayData.VTEDataRequestCount + 1;
    tradegenDayData.save();

    updateVTEDayData(event, true, event.params.tokenPrice, event.params.amountPaid);
    updateVTEHourData(event, true, event.params.tokenPrice, event.params.amountPaid);
}