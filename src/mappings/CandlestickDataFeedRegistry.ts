import { RegisteredDataFeed } from "../types/CandlestickDataFeedRegistry/CandlestickDataFeedRegistry";
import {
  log
} from "@graphprotocol/graph-ts";
import {
  CandlestickDataFeed,
  Tradegen,
} from "../types/schema";
import { CandlestickDataFeed as CandlestickDataFeedTemplate } from "../types/templates";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
  ZERO_BI,
} from "./helpers";

export function handleNewCandlestickDataFeed(event: RegisteredDataFeed): void {
  log.error("start of CandlestickDataFeedRegistry", []);
  // Load Tradegen (create if first candlestick data feed).
  let tradegen = Tradegen.load(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
  if (tradegen === null)
  {
    tradegen = new Tradegen(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS);
    tradegen.candlestickDataFeedCount = 0;
    tradegen.botPerformanceDataFeedCount = 0;
    tradegen.candlestickDataFeedUpdateCount = 0;
    tradegen.botPerformanceDataFeedUpdateCount = 0;
    tradegen.dataRequestCount = 0;
    tradegen.totalRevenue = ZERO_BI;
  }
  
  log.error("CandlestickDataFeedRegistry: created Tradegen", [CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS]);
  
  tradegen.candlestickDataFeedCount = tradegen.candlestickDataFeedCount + 1;
  tradegen.save();
  
  log.error("CandlestickDataFeedRegistry: saved Tradegen", []);
  
  // Create the CandlestickDataFeed.
  let candlestickDataFeed = new CandlestickDataFeed(event.params.dataFeed.toHexString());
  candlestickDataFeed.createdOn = event.block.timestamp;
  candlestickDataFeed.isHalted = false;
  candlestickDataFeed.dataProvider = event.params.dedicatedDataProvider.toHexString();
  candlestickDataFeed.symbol = event.params.asset;
  candlestickDataFeed.timeframe = event.params.timeframe;
  candlestickDataFeed.lastUpdated = ZERO_BI;
  candlestickDataFeed.currentPrice = ZERO_BI;
  candlestickDataFeed.numberOfUpdates = 0;

  candlestickDataFeed.save();

  log.error("CandlestickDataFeedRegistry: created candlestick data feed", [event.params.dataFeed.toHexString()]);
  
  // Create the tracked contract based on the template.
  CandlestickDataFeedTemplate.create(event.params.dataFeed);

  log.error("CandlestickDataFeedRegistry: created candlestick data feed template", [event.params.dataFeed.toHexString()]);
}