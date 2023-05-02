import { SigningStargateClient } from '@cosmjs/stargate';
import { SigningCosmosClient } from '@cosmjs/launchpad';
import { makeSignDoc } from '@cosmjs/amino';
import { mainnetChainConfig } from './exportConfig';
import { testnetChainConfig } from './exportTestnetConfig';

export const initializeChain = (chainId, cb) => {
    (async () => {
        if (!window.getOfflineSignerOnlyAmino || !window.keplr) {
            const error = 'Please install keplr extension';
            cb(error);
        } else {
            if (window.keplr.experimentalSuggestChain) {
                try {
                    if (chainId === 'titan-1') {
                        await window.keplr.experimentalSuggestChain(mainnetChainConfig);
                    } else {
                        await window.keplr.experimentalSuggestChain(testnetChainConfig);
                    }
                } catch (_) {
                    const chainError = 'Failed to suggest the chain';
                    cb(chainError);
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                cb(versionError);
            }
        }

        if (window.keplr) {
            await window.keplr.enable(chainId);

            const offlineSigner = window.getOfflineSignerOnlyAmino(chainId);
            const accounts = await offlineSigner.getAccounts();
            cb(null, accounts);
        } else {
            return null;
        }
    })();
};

export const signTxAndBroadcast = (chainId, rpcUrl, tx, address, cb) => {
    (async () => {
        await window.keplr && window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
        const client = await SigningStargateClient.connectWithSigner(
            rpcUrl,
            offlineSigner,
        );
        client.signAndBroadcast(
            address,
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            tx.memo,
        ).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
};

export const cosmosSignTxAndBroadcast = (chainId, restUrl, tx, address, cb) => {
    (async () => {
        await window.keplr && window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
        const cosmJS = new SigningCosmosClient(
            restUrl,
            address,
            offlineSigner,
        );

        cosmJS.signAndBroadcast(tx.msg, tx.fee, tx.memo).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
};

export const aminoSignTxAndBroadcast = (chainId, rpcUrl, restUrl, tx, address, cb) => {
    (async () => {
        await window.keplr && window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);

        const client = new SigningCosmosClient(
            restUrl,
            address,
            offlineSigner,
        );

        const client2 = await SigningStargateClient.connectWithSigner(
            rpcUrl,
            offlineSigner,
        );
        const account = {};
        try {
            const {
                accountNumber,
                sequence,
            } = await client2.getSequence(address);
            account.accountNumber = accountNumber;
            account.sequence = sequence;
        } catch (e) {
            account.accountNumber = 0;
            account.sequence = 0;
        }

        const signDoc = makeSignDoc(
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            chainId,
            tx.memo,
            account.accountNumber,
            account.sequence,
        );

        const {
            signed,
            signature,
        } = await offlineSigner.signAmino(address, signDoc);

        const msg = signed.msgs ? signed.msgs : [signed.msg];
        const fee = signed.fee;
        const memo = signed.memo;

        const voteTx = {
            msg,
            fee,
            memo,
            signatures: [signature],
        };

        client.broadcastTx(voteTx).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
};

export const aminoSignTx = (chainId, rpcUrl, tx, address, cb) => {
    (async () => {
        await window.keplr && window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);

        const client = await SigningStargateClient.connectWithSigner(
            rpcUrl,
            offlineSigner,
        );

        const account = {};
        try {
            const {
                accountNumber,
                sequence,
            } = await client.getSequence(address);
            account.accountNumber = accountNumber;
            account.sequence = sequence;
        } catch (e) {
            account.accountNumber = 0;
            account.sequence = 0;
        }
        const signDoc = makeSignDoc(
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            chainId,
            tx.memo,
            account.accountNumber,
            account.sequence,
        );

        offlineSigner.signAmino(address, signDoc).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
};
