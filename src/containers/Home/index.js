import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import variables from '../../utils/variables';
import * as PropTypes from 'prop-types';
import TokenDetails from './TokenDetails';
import DelegateDialog from '../Stake/DelegateDialog';
import SuccessDialog from '../Stake/DelegateDialog/SuccessDialog';
import UnSuccessDialog from '../Stake/DelegateDialog/UnSuccessDialog';
import ClaimDialog from './ClaimDialog';
import Table from '../Stake/Table';
import { Button } from '@material-ui/core';
import Cards from '../Proposals/Cards';
import ProposalDialog from '../Proposals/ProposalDialog';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PendingDialog from '../Stake/DelegateDialog/PendingDialog';
import { fetchRewards, getBalance, fetchVestingBalance, getUnBondingDelegations, getDelegations } from '../../actions/accounts';
import { sleep } from '../../utils/sleep';

import { TbRefresh } from 'react-icons/tb';

class Home extends Component {
    constructor (props) {
        super(props);

        this.state = {
            active: 1,
            isLoading: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    componentDidMount () {
        if ((this.props.address !== '') && (this.state.active !== 2)) {
            this.setState((p) => ({ ...p, active: 2 }));
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) &&
            (this.props.address !== '') && (this.state.active !== 2)) {
            this.setState((p) => ({ ...p, active: 2 }));
        }
        if ((pp.address !== this.props.address) &&
            (this.props.address === '') && (this.state.active !== 1)) {
            this.setState((p) => ({ ...p, active: 1 }));
        }
    }

    handleChange (value) {
        if (this.state.active === value) {
            return;
        }

        this.setState((p) => ({ ...p, active: value }));
    }

    handleRedirect (value) {
        this.props.history.push(value);
    }

    render () {
        const { active } = this.state;
        const filteredProposals = this.props.proposals && this.props.proposals.filter((item) => item.status === 2);

        const { network, changeNetwork } = this.props;

        return (
            <>
                <NavBar changeNetwork={changeNetwork} network={network} />
                <div className="home padding">
                    <div className="card">
                        {this.props.address !== '' &&
                        <Button
                            style={{ maxWidth: '30px', position: 'absolute', top: '10px', right: '10px', backgroundColor: `${this.state.isLoading ? '#ffffffc9' : 'white'}`, borderRadius: '50%' }}
                            onClick={() => {
                                if (this.state.isLoading === false) {
                                    this.setState((p) => ({ ...p, isLoading: true }));
                                    Promise.all([
                                        this.props.fetchRewards(this.props.network.REST_URL, this.props.address),
                                        this.props.getBalance(this.props.network.REST_URL, this.props.address),
                                        this.props.fetchVestingBalance(this.props.network.REST_URL, this.props.address),
                                        this.props.getUnBondingDelegations(this.props.network.REST_URL, this.props.address),
                                        this.props.getDelegations(this.props.network.REST_URL, this.props.address),
                                        sleep(2000),
                                    ]).then(() => this.setState((p) => ({ ...p, isLoading: false })));
                                }
                            }}>
                            <TbRefresh className={this.state.isLoading ? 'rotate' : ''}/>
                        </Button>}
                        <div className="left_content">
                            <h2>{variables[this.props.lang].welcome}</h2>
                            <p className="info">{variables[this.props.lang].participate}</p>
                        </div>
                        <TokenDetails lang={this.props.lang} network={network}/>
                    </div>
                </div>
                <div className="stake">
                    <div className="stake_content padding">
                        <div className="heading">
                            <div className="tabs">
                                <p className={active === 2 ? 'active' : ''} onClick={() => this.handleChange(2)}>
                                    {variables[this.props.lang]['staked_validators']}
                                </p>
                                <span/>
                                <p className={active === 1 ? 'active' : ''} onClick={() => this.handleChange(1)}>
                                    {variables[this.props.lang]['all_validators']}
                                </p>
                            </div>
                            <Button className="view_all" onClick={() => this.handleRedirect('/stake')}>
                                {variables[this.props.lang]['view_all']}
                            </Button>
                        </div>
                        <Table active={active} home={true} network={network}/>
                    </div>
                </div>
                <div className="proposals">
                    {!this.props.open
                        ? <div className="proposals_content padding">
                            <div className="heading">
                                <div className="tabs">
                                    <p className="active">
                                        {variables[this.props.lang]['top_active_proposals']}
                                    </p>
                                </div>
                                <Button className="view_all" onClick={() => this.handleRedirect('/proposals')}>
                                    {variables[this.props.lang]['view_all']}
                                </Button>
                            </div>
                            {this.props.proposalsInProgress || this.props.voteDetailsInProgress
                                ? <div className="cards_content">Loading...</div>
                                : filteredProposals && filteredProposals.length
                                    ? <Cards home={true} network={network} proposals={filteredProposals}/>
                                    : <div className="cards_content">{variables[this.props.lang]['no_data_found']}</div>}
                        </div>
                        : <ProposalDialog network={network} />}
                </div>
                <DelegateDialog network={network} />
                <SuccessDialog network={network} />
                <UnSuccessDialog network={network} />
                <PendingDialog network={network} />
                <ClaimDialog network={network} />
            </>
        );
    }
}

Home.propTypes = {
    changeNetwork: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    network: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    proposals: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    proposalsInProgress: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        open: state.proposals.dialog.open,
        proposals: state.proposals._.list,
        proposalsInProgress: state.proposals._.inProgress,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
    };
};

const actionToProps = {
    fetchRewards,
    getBalance,
    fetchVestingBalance,
    getUnBondingDelegations,
    getDelegations,
};

export default withRouter(connect(stateToProps, actionToProps)(Home));
