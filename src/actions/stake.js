import {
    CLAIM_REWARDS_DIALOG_HIDE,
    CLAIM_REWARDS_DIALOG_SHOW,
    CLAIM_REWARDS_VALIDATOR_SET,
    DELEGATE_DIALOG_HIDE,
    DELEGATE_DIALOG_SHOW,
    DELEGATE_FAILED_DIALOG_HIDE,
    DELEGATE_FAILED_DIALOG_SHOW,
    DELEGATE_PROCESSING_DIALOG_HIDE,
    DELEGATE_PROCESSING_DIALOG_SHOW,
    DELEGATE_SUCCESS_DIALOG_HIDE,
    DELEGATE_SUCCESS_DIALOG_SHOW,
    DELEGATED_VALIDATORS_FETCH_ERROR,
    DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    DELEGATED_VALIDATORS_FETCH_SUCCESS,
    SEARCH_LIST_SET,
    TO_VALIDATOR_SET,
    TOKENS_SET,
    VALIDATOR_FETCH_ERROR,
    VALIDATOR_FETCH_IN_PROGRESS,
    VALIDATOR_FETCH_SUCCESS,
    // VALIDATOR_IMAGE_FETCH_ERROR,
    VALIDATOR_IMAGE_FETCH_IN_PROGRESS,
    VALIDATOR_IMAGE_FETCH_SUCCESS,
    VALIDATOR_SET,
    VALIDATORS_FETCH_ERROR,
    VALIDATORS_FETCH_IN_PROGRESS,
    VALIDATORS_FETCH_SUCCESS,
} from '../constants/stake';
import Axios from 'axios';
import { getDelegatedValidatorsURL, getValidatorURL, validatorImageURL, VALIDATORS_LIST_URL } from '../constants/url';

const fetchValidatorsInProgress = () => {
    return {
        type: VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorsSuccess = (list) => {
    return {
        type: VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchValidatorsError = (message) => {
    return {
        type: VALIDATORS_FETCH_ERROR,
        message,
    };
};

export const getValidators = (url, cb) => (dispatch) => {
    dispatch(fetchValidatorsInProgress());
    Axios.get(VALIDATORS_LIST_URL(url), {
        headers: {
            Accept: 'application/json, text/plain, */*',
            // Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchValidatorsSuccess(res.data && res.data.result));
            cb(res.data && res.data.result);
        })
        .catch((error) => {
            dispatch(fetchValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const setSearch = (value) => {
    return {
        type: SEARCH_LIST_SET,
        value,
    };
};

export const showDelegateDialog = (name, address) => {
    return {
        type: DELEGATE_DIALOG_SHOW,
        name,
        address,
    };
};

export const hideDelegateDialog = () => {
    return {
        type: DELEGATE_DIALOG_HIDE,
    };
};

export const showDelegateSuccessDialog = (value) => {
    return {
        type: DELEGATE_SUCCESS_DIALOG_SHOW,
        value,
    };
};

export const hideDelegateSuccessDialog = () => {
    return {
        type: DELEGATE_SUCCESS_DIALOG_HIDE,
    };
};

export const showDelegateProcessingDialog = () => {
    return {
        type: DELEGATE_PROCESSING_DIALOG_SHOW,
    };
};

export const hideDelegateProcessingDialog = () => {
    return {
        type: DELEGATE_PROCESSING_DIALOG_HIDE,
    };
};

export const showDelegateFailedDialog = () => {
    return {
        type: DELEGATE_FAILED_DIALOG_SHOW,
    };
};

export const hideDelegateFailedDialog = () => {
    return {
        type: DELEGATE_FAILED_DIALOG_HIDE,
    };
};

export const setValidator = (value) => {
    return {
        type: VALIDATOR_SET,
        value,
    };
};

export const setToValidator = (value) => {
    return {
        type: TO_VALIDATOR_SET,
        value,
    };
};

export const setTokens = (value) => {
    return {
        type: TOKENS_SET,
        value,
    };
};

const fetchValidatorInProgress = () => {
    return {
        type: VALIDATOR_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorSuccess = (value) => {
    return {
        type: VALIDATOR_FETCH_SUCCESS,
        value,
    };
};

const fetchValidatorError = (message) => {
    return {
        type: VALIDATOR_FETCH_ERROR,
        message,
    };
};

export const getValidatorDetails = (address, cb) => (dispatch) => {
    dispatch(fetchValidatorInProgress());
    const URL = getValidatorURL(address);
    Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            // Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchValidatorSuccess(res.data && res.data.result));
            cb(res.data && res.data.result);
        })
        .catch((error) => {
            dispatch(fetchValidatorError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchDelegatedValidatorsInProgress = () => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchDelegatedValidatorsSuccess = (list) => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchDelegatedValidatorsError = (message) => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_ERROR,
        message,
    };
};

export const getDelegatedValidatorsDetails = (_url, address) => (dispatch) => {
    dispatch(fetchDelegatedValidatorsInProgress());
    const URL = getDelegatedValidatorsURL(_url, address);
    Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            // Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchDelegatedValidatorsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchDelegatedValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const showClaimRewardsDialog = () => {
    return {
        type: CLAIM_REWARDS_DIALOG_SHOW,
    };
};

export const hideClaimRewardsDialog = () => {
    return {
        type: CLAIM_REWARDS_DIALOG_HIDE,
    };
};

export const setClaimRewardsValidator = (value) => {
    return {
        type: CLAIM_REWARDS_VALIDATOR_SET,
        value,
    };
};

const fetchValidatorImageInProgress = () => {
    return {
        type: VALIDATOR_IMAGE_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorImageSuccess = (value) => {
    return {
        type: VALIDATOR_IMAGE_FETCH_SUCCESS,
        value,
    };
};

// const fetchValidatorImageError = (message) => {
//     return {
//         type: VALIDATOR_IMAGE_FETCH_ERROR,
//         message,
//     };
// };

// Testnet matched address
const existImageAddress = {
    rizonvaloper12p7w938nwkhehj7j69zkgtk5j76hdtan7j52m0: 'rizonvaloper1fshqmgvtm0s8t6t9lc4eexs2kaz6lwzy60dwgm', // DELIGHT-testnet
    rizonvaloper1mtn9ltgucnlavnlagcxs5lq3zda05dzs98t8v8: 'rizonvaloper1u4285azprzlrqpq45azsw7464ymmw4juqww8em', // Active Nodes testnet
};

export const fetchValidatorImage = (id) => (dispatch) => {
    dispatch(fetchValidatorImageInProgress());
    if (existImageAddress[id] !== undefined) {
        dispatch(fetchValidatorImageSuccess({
            url: validatorImageURL(existImageAddress[id]),
            _id: id,
        }));
    } else {
        dispatch(fetchValidatorImageSuccess({
            url: validatorImageURL(id),
            _id: id,
        }));
    }
};
