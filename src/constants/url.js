import { config } from '../config';

export const REST_URL = config.REST_URL;
export const RPC_URL = config.RPC_URL;

export const urlFetchDelegations = (rest, address) => `${rest}/staking/delegators/${address}/delegations`;
export const urlFetchBalance = (rest, address) => `${rest}/bank/balances/${address}`;
export const urlFetchVestingBalance = (rest, address) => `${rest}/auth/accounts/${address}`;
export const urlFetchUnBondingDelegations = (rest, address) => `${rest}/staking/delegators/${address}/unbonding_delegations`;

export const urlFetchRewards = (rest, address) => `${rest}/distribution/delegators/${address}/rewards`;
export const urlFetchVoteDetails = (rest, proposalId, address) => `${rest}/gov/proposals/${proposalId}/votes/${address}`;

export const VALIDATORS_LIST_URL = (rest) => `${rest}/staking/validators`;
export const getValidatorURL = (rest, address) => `${rest}/staking/validators/${address}`;
export const PROPOSALS_LIST_URL = (rest) => `${rest}/gov/proposals`;
export const getDelegatedValidatorsURL = (rest, address) => `${rest}/staking/delegators/${address}/validators`;
export const urlFetchProposalVotes = (rest, id) => `${rest}/gov/proposals/${id}/votes`;
export const urlFetchTallyDetails = (rest, id) => `${rest}/gov/proposals/${id}/tally`;
export const urlFetchProposalDetails = (rest, id) => `${rest}/txs?message.module=governance&submit_proposal.proposal_id=${id}`;

export const validatorImageURL = (address) => {
    return `https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/moniker/rizon/${address}.png`;
};
