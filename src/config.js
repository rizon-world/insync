export const config = {
    RPC_URL: 'http://seed-1.mainnet.rizon.world:26657', // TBD
    REST_URL: 'http://seed-1.mainnet.rizon.world:1317', // TBD
    EXPLORER_URL: 'https://www.mintscan.io/rizon',
    NETWORK_NAME: 'RIZON',
    NETWORK_TYPE: 'mainnet',
    CHAIN_ID: 'titan-1',
    CHAIN_NAME: 'RIZON',
    COIN_DENOM: 'ATOLO',
    COIN_MINIMAL_DENOM: 'uatolo',
    COIN_DECIMALS: 6,
    PREFIX: 'rizon',
    COIN_TYPE: 118,
    COINGECKO_ID: 'rizon',
    DEFAULT_GAS: 200000,
    GAS_PRICE_STEP_LOW: 0.0025,
    GAS_PRICE_STEP_AVERAGE: 0.025,
    GAS_PRICE_STEP_HIGH: 0.04,
    FEATURES: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
};
