import { RegisteredDataFeed } from "../types/BotPerformanceDataFeedRegistry/BotPerformanceDataFeedRegistry";
import {
  log
} from "@graphprotocol/graph-ts";
import {
  BotPerformanceDataFeed,
  Tradegen,
} from "../types/schema";
import { BotPerformanceDataFeed as BotPerformanceDataFeedTemplate } from "../types/templates";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
  ZERO_BI,
} from "./helpers";

export function handleNewBotPerformanceDataFeed(event: RegisteredDataFeed): void {
  log.error("start of BotPerformanceDataFeedRegistry", []);
  // Load Tradegen (create if first bot performance data feed).
  let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
  if (tradegen === null)
  {
    tradegen = new Tradegen(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.candlestickDataFeedCount = 0;
    tradegen.botPerformanceDataFeedCount = 0;
    tradegen.VTEDataFeedCount = 0;
    tradegen.candlestickDataFeedUpdateCount = 0;
    tradegen.botPerformanceDataFeedUpdateCount = 0;
    tradegen.VTEDataFeedUpdateCount = 0;
    tradegen.botDataRequestCount = 0;
    tradegen.VTEDataRequestCount = 0;
    tradegen.totalRevenue = ZERO_BI;
  }
  
  log.error("BotPerformanceDataFeedRegistry: created Tradegen", [CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS]);
  
  tradegen.botPerformanceDataFeedCount = tradegen.botPerformanceDataFeedCount + 1;
  tradegen.save();
  
  log.error("BotPerformanceDataFeedRegistry: saved Tradegen", []);
  
  // Create the BotPerformanceDataFeed.
  let botPerformanceDataFeed = new BotPerformanceDataFeed(event.params.dataFeed.toHexString());
  botPerformanceDataFeed.createdOn = event.block.timestamp;
  botPerformanceDataFeed.isHalted = false;
  botPerformanceDataFeed.dataProvider = event.params.dedicatedDataProvider.toHexString();
  botPerformanceDataFeed.tradingBot = event.params.tradingBot.toHexString();
  botPerformanceDataFeed.usageFee = event.params.usageFee;
  botPerformanceDataFeed.lastUpdated = ZERO_BI;
  botPerformanceDataFeed.numberOfDataRequests = 0;
  botPerformanceDataFeed.numberOfUpdates = 0;
  botPerformanceDataFeed.revenue = ZERO_BI;

  botPerformanceDataFeed.save();

  log.error("BotPerformanceDataFeedRegistry: created bot performance data feed", [event.params.dataFeed.toHexString()]);
  
  // Create the tracked contract based on the template.
  BotPerformanceDataFeedTemplate.create(event.params.dataFeed);

  log.error("BotPerformanceDataFeedRegistry: created bot performance data feed template", [event.params.dataFeed.toHexString()]);
}