# Tradegen Data Feeds Subgraph

This subgraph dynamically tracks the data feeds and updates in the [Tradegen data platform](https://github.com/Tradegen/data-feeds).

- aggregated data across pools,
- data on individual pools,
- data on individual transactions,
- data on each user's positions and aggregated performance,
- data on each position in a pool,
- historical data on each pool and position

## Running Locally

Make sure to update package.json settings to point to your own graph account.

## Queries

Below are a few ways to show how to query the [data-feeds subgraph](https://thegraph.com/hosted-service/subgraph/tradegen/data-feeds) for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

## Key Entity Overviews

#### Tradegen

Contains data feed count and request count by data feed type, as well as the total revenue generated across data feeds.

#### CandlestickDataFeed

Contains data on a specific candlestick data feed. Tracks the data feed's asset (symbol and current price), timeframe, and candlestick history.

#### BotPerformanceDataFeed

Contains data on a specific bot performance data feed. Tracks the data feed's trading bot address, usage fee, revenue, bot performance history, and data request history.

#### VTEDataFeed

Contains data on a specific VTE (virtual trading environment) data feed. Tracks the data feed's VTE address, usage fee, reenue, VTE performance history, and data request history.

## Example Queries

### Querying Aggregated Data

This query fetches aggredated data from all data feeds.

```graphql
{
  tradegens(first: 1) {
    candlestickDataFeedCount
    botPerformanceDataFeedCount
    candlestickDataFeedUpdateCount
    candlestickDataFeedRequestCount
    totalRevenue
  }
}
```
