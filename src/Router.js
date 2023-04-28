import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Stake from './containers/Stake';
import Proposals from './containers/Proposals';
import * as PropTypes from 'prop-types';

import { config as mainnet } from './config';
import { config as testnet } from './testConfig';
import { connect, useDispatch } from 'react-redux';
import { fetchValidatorImage, getValidators } from './actions/stake';
import { fetchProposalDetails, fetchProposalTally, fetchVoteDetails, getProposals } from './actions/proposals';

const Router = (props) => {
    const dispatch = useDispatch();
    const [network, setNetwork] = useState(mainnet);

    const changeNetwork = () => {
        const newState = network.NETWORK_TYPE === 'mainnet' ? { ...testnet } : { ...mainnet };
        setNetwork(newState);
        props.getValidators(newState.REST_URL, (data) => {
            if (data) {
                data.map((value) => {
                    if (value && value.description && value.description.identity) {
                        props.fetchValidatorImage(value.description.identity);
                    }

                    return null;
                });
            }
        });
        props.getProposals(newState.REST_URL, (result) => {
            if (result && result.length) {
                const proposalDetails = props.proposalDetails;
                result.map((val) => {
                    const filter = proposalDetails && Object.keys(proposalDetails).length &&
                    Object.keys(proposalDetails).find((key) => key === val.id);
                    if (!filter) {
                        props.fetchProposalDetails(newState.REST_URL, val.id);
                    }
                    if (val.status === 2) {
                        props.fetchProposalTally(newState.REST_URL, val.id);
                    }

                    return null;
                });
            }
        });
        props.fetchVoteDetails(newState.REST_URL, props.dialog.id, props.address);
    };

    return (
        <div className="main_content">
            <div className="content_div scroll_bar">
                <Switch>
                    <Route
                        key="/"
                        exact
                        path="/"
                        render={() => <Home changeNetwork={changeNetwork} network={network} />}/>
                    <Route
                        key="/stake"
                        exact
                        path="/stake"
                        render={() => <Stake changeNetwork={changeNetwork} network={network} />}/>
                    <Route
                        key="/proposals"
                        exact
                        path="/proposals"
                        render={() => <Proposals changeNetwork={changeNetwork} network={network} />}/>
                    <Route
                        exact
                        component={Home}
                        path="*"/>
                </Switch>
            </div>
        </div>
    );
};

Router.propTypes = {
    fetchProposalDetails: PropTypes.func.isRequired,
    fetchProposalTally: PropTypes.func.isRequired,
    fetchValidatorImage: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    getProposals: PropTypes.func.isRequired,
    getValidators: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    network: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    proposalDetails: PropTypes.object.isRequired,
    address: PropTypes.string,
    dialog: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        dialog: state.proposals.dialog.value,
        address: state.accounts.address.value,
        proposalsDetails: state.proposals.proposalDetails,
    };
};

const actionToProps = {
    fetchVoteDetails,
    getValidators,
    fetchValidatorImage,
    fetchProposalDetails,
    fetchProposalTally,
    getProposals,
};

export default connect(stateToProps, actionToProps)(Router);