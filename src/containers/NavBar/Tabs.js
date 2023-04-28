import { AppBar, FormControl, InputLabel, MenuItem, Select, Tab, ThemeProvider, createMuiTheme } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { withRouter } from 'react-router';
import { hideSideBar } from '../../actions/navBar';
import { hideProposalDialog } from '../../actions/proposals';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#white',
        },
    },
});

class Tabs extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleNetworkName = this.handleNetworkName.bind(this);
        this.state = {
            value: '',
        };
    }

    componentDidMount () {
        const route = this.props.location.pathname && this.props.location.pathname.split('/') &&
            this.props.location.pathname.split('/')[1];

        if (this.state.value !== route && (route === '' || route === 'stake' || route === 'proposals')) {
            this.setState({
                value: route,
            });
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.location.pathname !== this.props.location.pathname) {
            const value = this.props.location.pathname.split('/')[1];

            if (value !== this.state.value && (value === '' || value === 'stake' || value === 'proposals')) {
                this.setState({
                    value: value,
                });
            }
        }
    }

    handleChange (newValue) {
        this.props.handleClose();
        if (this.props.open) {
            this.props.hideProposalDialog();
        }
        if (newValue === this.state.value) {
            return;
        }

        this.props.history.push('/' + newValue);
        this.setState({
            value: newValue,
        });
    }

    handleNetworkName (newValue) {
        if (this.props.network !== newValue) {
            this.props.changeNetwork();
        }
    }

    render () {
        const a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        };

        return (
            <AppBar className="horizontal_tabs" position="static">
                <div className="tabs_content">
                    <ThemeProvider theme={theme}>
                        <FormControl >
                            <InputLabel id="demo-simple-select-label" style={{ color: 'whitesmoke' }}>Network</InputLabel>
                            <Select
                                id="demo-simple-select"
                                label="Age"
                                labelId="demo-simple-select-label"
                                style={{ color: 'whitesmoke' }}
                                value={this.props.network}
                                onChange={this.handleNetworkName}
                            >
                                <MenuItem value={'mainnet'}>mainnet</MenuItem>
                                <MenuItem value={'testnet'}>testnet</MenuItem>
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                    <Tab
                        className={'tab ' + (this.state.value === '' ? 'active_tab' : '')}
                        label={variables[this.props.lang].dashboard}
                        value=""
                        onClick={() => this.handleChange('')}
                        {...a11yProps(0)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'stake' ? 'active_tab' : '')}
                        label={variables[this.props.lang].stake}
                        value="stake"
                        onClick={() => this.handleChange('stake')}
                        {...a11yProps(1)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'proposals' ? 'active_tab' : '')}
                        label={variables[this.props.lang].proposals}
                        value="proposals"
                        onClick={() => this.handleChange('proposals')}
                        {...a11yProps(1)} />
                </div>
            </AppBar>
        );
    }
}

Tabs.propTypes = {
    changeNetwork: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    hideProposalDialog: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    network: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.proposals.dialog.open,
    };
};

const actionToProps = {
    handleClose: hideSideBar,
    hideProposalDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(Tabs));
