import {
    Address,
    BigDecimal,
    BigInt
  } from "@graphprotocol/graph-ts";
import { CandlestickDataFeedRegistry } from "../types/CandlestickDataFeedRegistry/CandlestickDataFeedRegistry";
import { BotPerformanceDataFeedRegistry } from "../types/BotPerformanceDataFeedRegistry/BotPerformanceDataFeedRegistry";
import { VTEDataFeedRegistry } from "../types/VTEDataFeedRegistry/VTEDataFeedRegistry";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS = "0x1f19A758382F51811C5D429F30Ad78192C377383";
export const BOT_PERFORMANCE_DATA_FEED_REGISTRY_ADDRESS = "0x8F51B3Ce8c8752077c81873d2CAd65a1b8e1156d";
export const VTE_DATA_FEED_REGISTRY_ADDRESS = "0xD5ac9fBe8Ae711bf228Ed9a9B9B76D6731808dD5";

export const cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export let candlestickDataFeedRegistryContract = CandlestickDataFeedRegistry.bind(
    Address.fromString(CANDLESTICK_DATA_FEED_REGISTRY_ADDRESS)
);

export let botPerformanceDataFeedContract = BotPerformanceDataFeedRegistry.bind(
    Address.fromString(BOT_PERFORMANCE_DATA_FEED_REGISTRY_ADDRESS)
);

export let VTEDataFeedContract = VTEDataFeedRegistry.bind(
    Address.fromString(VTE_DATA_FEED_REGISTRY_ADDRESS)
);

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString("1");
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString("10"));
    }
    return bd;
}

export function bigDecimalExp18(): BigDecimal {
    return BigDecimal.fromString("1000000000000000000");
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
    return eth.toBigDecimal().div(exponentToBigDecimal(new BigInt(18)));
}

export function convertTokenToDecimal(
    tokenAmount: BigInt,
    exchangeDecimals: BigInt
    ): BigDecimal {
        if (exchangeDecimals == ZERO_BI) {
            return tokenAmount.toBigDecimal();
        }
        return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: BigDecimal): boolean {
    const formattedVal = parseFloat(value.toString());
    const zero = parseFloat(ZERO_BD.toString());
    if (zero == formattedVal) {
        return true;
    }
    return false;
}

export function isNullEthValue(value: string): boolean {
    return (
        value ==
        "0x0000000000000000000000000000000000000000000000000000000000000001"
    );
}