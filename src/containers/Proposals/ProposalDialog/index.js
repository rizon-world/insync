import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import './index.css';
import { fetchVoteDetails, hideProposalDialog } from '../../../actions/proposals';
import Icon from '../../../components/Icon';
import Voting from './Voting';
import moment from 'moment';
import ClassNames from 'classnames';
import { tally } from '../../../utils/numberFormats';

class ProposalDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            show: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.VoteCalculation = this.VoteCalculation.bind(this);
    }

    componentDidMount () {
        const votedOption = this.props.voteDetails && this.props.voteDetails.length && this.props.proposal && this.props.proposal.id &&
            this.props.voteDetails.filter((vote) => vote.proposal_id === this.props.proposal.id)[0];

        if (!votedOption && this.props.proposal && this.props.proposal.id && this.props.address) {
            const { REST_URL } = this.props.network;
            this.props.fetchVoteDetails(REST_URL, this.props.proposal.id, this.props.address);
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.network.NETWORK_TYPE !== this.props.network.NETWORK_TYPE) {
            this.props.handleClose();
        }
    }

    handleChange () {
        this.setState((prev) => ({
            ...prev,
            show: !this.state.show,
        }));
    }

    VoteCalculation (val) {
        const { proposal } = this.props;

        if (proposal.status === 2) {
            const value = this.props.tallyDetails && this.props.tallyDetails[proposal.id];
            const sum = value && value.yes && value.no && value.no_with_veto && value.abstain &&
                (parseInt(value.yes) + parseInt(value.no) + parseInt(value.no_with_veto) + parseInt(value.abstain));

            return (this.props.tallyDetails && this.props.tallyDetails[proposal.id] && this.props.tallyDetails[proposal.id][val]
                ? tally(this.props.tallyDetails[proposal.id][val], sum) : '0%');
        } else {
            const sum = proposal.final_tally_result && proposal.final_tally_result.yes &&
                proposal.final_tally_result.no && proposal.final_tally_result.no_with_veto &&
                proposal.final_tally_result.abstain &&
                (parseInt(proposal.final_tally_result.yes) + parseInt(proposal.final_tally_result.no) +
                    parseInt(proposal.final_tally_result.no_with_veto) + parseInt(proposal.final_tally_result.abstain));

            return (proposal && proposal.final_tally_result &&
            proposal.final_tally_result[val]
                ? tally(proposal.final_tally_result[val], sum) : '0%');
        }
    }

    render () {
        let votedOption = this.props.voteDetails && this.props.voteDetails.length &&
            this.props.proposal && this.props.proposal.id &&
            this.props.voteDetails.filter((vote) => vote.proposal_id === this.props.proposal.id)[0];
        let proposer = this.props.proposal && this.props.proposal.proposer;

        this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
        Object.keys(this.props.proposalDetails).filter((key) => {
            if (key === this.props.proposal.id) {
                if (this.props.proposalDetails[key] &&
                    this.props.proposalDetails[key][0] &&
                    this.props.proposalDetails[key][0].tx &&
                    this.props.proposalDetails[key][0].tx.value &&
                    this.props.proposalDetails[key][0].tx.value.msg[0] &&
                    this.props.proposalDetails[key][0].tx.value.msg[0].value &&
                    this.props.proposalDetails[key][0].tx.value.msg[0].value.proposer) {
                    proposer = this.props.proposalDetails[key][0].tx.value.msg[0].value.proposer;
                }
            }

            return null;
        });

        if (votedOption && votedOption.options && votedOption.options.length) {
            votedOption = votedOption.options[0];
        }

        return (
            this.props.open &&
            <div className="proposal_dialog padding">
                <div className="content">
                    <IconButton className="close_button" onClick={this.props.handleClose}>
                        <Icon className="close" icon="close"/>
                    </IconButton>
                    <div className="proposal_dialog_section1">
                        <div
                            className="proposal_dialog_section1_header">{this.props.proposal && this.props.proposal.content &&
                        this.props.proposal.content.value && this.props.proposal.content.value.title}</div>
                        <div className={ClassNames('proposal_dialog_section1_status', this.props.proposal.status === 2
                            ? 'voting_period'
                            : this.props.proposal.status === 4
                                ? 'rejected'
                                : null)}> Proposal
                            Status: &nbsp;{this.props.proposal && this.props.proposal.status
                                ? this.props.proposal.status === 0 ? 'Nil'
                                    : this.props.proposal.status === 1 ? 'DepositPeriod'
                                        : this.props.proposal.status === 2 ? 'VotingPeriod'
                                            : this.props.proposal.status === 3 ? 'Passed'
                                                : this.props.proposal.status === 4 ? 'Rejected'
                                                    : this.props.proposal.status === 5 ? 'Failed' : ''
                                : ''}</div>
                    </div>
                    <div className="proposal_dialog_section2">
                        <pre
                            className={ClassNames('proposal_dialog_section2_content', this.state.show ? 'show_more' : '')}>
                            {this.props.proposal && this.props.proposal.content &&
                            this.props.proposal.content.value && this.props.proposal.content.value.description}
                        </pre>
                        <div
                            className="proposal_dialog_section2_more"
                            onClick={this.handleChange}>
                            {this.state.show
                                ? 'Read Less...'
                                : 'Read More...'}
                        </div>
                    </div>
                    <div className="proposal_dialog_section3">
                        <div className="proposal_dialog_section3_left">
                            <div className="pds3l_c">
                                <p className="pds3l_c1">Proposer</p>
                                {proposer && <div className="pds3l_c2 hash_text" title={proposer}>
                                    <p className="name">{proposer}</p>
                                    {proposer &&
                                    proposer.slice(proposer.length - 6, proposer.length)}
                                </div>}
                            </div>
                            <div className="pds3l_c">
                                <p className="pds3l_c1">Submitted on</p>
                                <p className="pds3l_c2">{this.props.proposal && this.props.proposal.submit_time
                                    ? moment(this.props.proposal.submit_time).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                            </div>
                            <div className="pds3l_c">
                                <p className="pds3l_c1">Voting Period</p>
                                <div className="pds3l_c2 vp_cards">
                                    <p>{this.props.proposal && this.props.proposal.voting_start_time
                                        ? moment(this.props.proposal.voting_start_time).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                                    <p>{this.props.proposal && this.props.proposal.voting_end_time
                                        ? moment(this.props.proposal.voting_end_time).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                                </div>
                            </div>
                            <div className="pds3l_c">
                                <p className="pds3l_c1">Voting Status</p>
                                <div className={ClassNames('pds3l_c2 vote_details',
                                    this.props.proposal && this.props.proposal.status === 2 ? 'vote_in_progress' : '')}>
                                    <div className="yes">
                                        <span/>
                                        <p>YES ({this.VoteCalculation('yes')})</p>
                                    </div>
                                    <div className="no">
                                        <span/>
                                        <p>NO ({this.VoteCalculation('no')})</p>
                                    </div>
                                    <div className="option3">
                                        <span/>
                                        <p>NoWithVeto ({this.VoteCalculation('no_with_veto')})</p>
                                    </div>
                                    <div className="option4">
                                        <span/>
                                        <p>Abstain ({this.VoteCalculation('abstain')})</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pds3l_c">
                                <p className="pds3l_c1">Type</p>
                                <p className="pds3l_c2 type">{this.props.proposal && this.props.proposal.content &&
                                this.props.proposal.content.type}</p>
                            </div>
                        </div>
                        {this.props.proposal && this.props.proposal.status === 2 && !this.props.voteDetailsInProgress
                            ? <Voting network={this.props.network} proposalId={this.props.proposal && this.props.proposal.id}/>
                            : null}
                    </div>
                    {votedOption
                        ? <div className="already_voted">
                            <Icon className="right-arrow" icon="right-arrow"/>
                            <p>{`you voted “${
                                votedOption && (votedOption.option === 1 || votedOption.option === 'VOTE_OPTION_YES') ? 'Yes'
                                    : votedOption && (votedOption.option === 2 || votedOption.option === 'VOTE_OPTION_ABSTAIN') ? 'Abstain'
                                        : votedOption && (votedOption.option === 3 || votedOption.option === 'VOTE_OPTION_NO') ? 'No'
                                            : votedOption && (votedOption.option === 4 || votedOption.option === 'VOTE_OPTION_NO_WITH_VETO') ? 'NoWithVeto'
                                                : votedOption && votedOption.option
                            }” for this proposal`}</p>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}

ProposalDialog.propTypes = {
    fetchVoteDetails: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    network: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    proposalDetails: PropTypes.object.isRequired,
    tallyDetails: PropTypes.object.isRequired,
    voteDetails: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    proposal: PropTypes.object,
    votes: PropTypes.arrayOf(
        PropTypes.shape({
            proposal_id: PropTypes.string.isRequired,
            voter: PropTypes.string.isRequired,
            option: PropTypes.number,
        }),
    ),
};

const stateToProps = (state) => {
    return {
        open: state.proposals.dialog.open,
        proposalDetails: state.proposals.proposalDetails.value,
        proposal: state.proposals.dialog.value,
        votes: state.proposals.votes.list,
        address: state.accounts.address.value,
        voteDetails: state.proposals.voteDetails.value,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
        tallyDetails: state.proposals.tallyDetails.value,
    };
};

const actionToProps = {
    handleClose: hideProposalDialog,
    fetchVoteDetails,
};

export default connect(stateToProps, actionToProps)(ProposalDialog);
