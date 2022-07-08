import { RegisteredDataFeed } from "../types/VTEDataFeedRegistry/VTEDataFeedRegistry";
import {
  VTEDataFeed,
  Tradegen,
} from "../types/schema";
import { VTEDataFeed as VTEDataFeedTemplate } from "../types/templates";
import {
  CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS,
  ZERO_BI,
} from "./helpers";

export function handleNewVTEDataFeed(event: RegisteredDataFeed): void {
  // Load Tradegen (create if VTE data feed).
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
    
  tradegen.VTEDataFeedCount = tradegen.VTEDataFeedCount + 1;
  tradegen.save();
    
  // Create the VTEDataFeed.
  let vteDataFeed = new VTEDataFeed(event.params.dataFeed.toHexString());
  vteDataFeed.createdOn = event.block.timestamp;
  vteDataFeed.dataProvider = event.params.dedicatedDataProvider.toHexString();
  vteDataFeed.VTE = event.params.VTE.toHexString();
  vteDataFeed.usageFee = event.params.usageFee;
  vteDataFeed.lastUpdated = ZERO_BI;
  vteDataFeed.numberOfDataRequests = 0;
  vteDataFeed.numberOfUpdates = 0;
  vteDataFeed.revenue = ZERO_BI;

  vteDataFeed.save();
  
  // Create the tracked contract based on the template.
  VTEDataFeedTemplate.create(event.params.dataFeed);
}