# RIZON - OmniFlix

-   You can use omniflix for rizon blockchain.
-   Live : [OmniFlix for RIZON Blockchain](http://omniflix.rizon.world/)

# inSync by OmniFlix (for Communities)

inSync is a collaborative interface for an entire community (or) blockchain network to:

-   identify stakeholders such as validator node hosts (will expand to other types of node hosts depending on the network)
-   discover proposals & more!

Currently, the aim of inSync is to be the default/defacto interface when bootstrapping community activities of a
specific chain (on testnet or mainnet).

# Requirements

yarn

# Instructions

1. clone repository and install packages

```sh
git clone https://github.com/rizon-world/insync.git
cd insync
yarn
```

2. update chain config

`NOTE:` below is the chain config for omniflix testnet

`src/config.js`

```js
export const config = {
    RPC_URL: 'http://seed-1.mainnet.rizon.world:26657',
    REST_URL: 'http://seed-1.mainnet.rizon.world:1317',
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
```

3. start app

```sh
yarn start
```
