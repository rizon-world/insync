import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import monikerImage from '../../assets/moniker.png';

const ValidatorName = (props) => {
    const image = props.value && props.value.description && props.validatorImages &&
        props.validatorImages.length && props.value.operator_address &&
        props.validatorImages.filter((imageObj) => imageObj._id === props.value.operator_address.toString());

    return (
        <div className="validator">
            {image && image.length && image[0] && image[0].url &&
                <img
                    alt={props.value.description && props.value.description.moniker}
                    className="image"
                    src={image[0].url} onError={({ target }) => { target.src = monikerImage; }}/>}
            <p className="heading_text1">{props.name}</p>
        </div>
    );
};

ValidatorName.propTypes = {
    name: PropTypes.string.isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        validatorImages: state.stake.validators.images,
    };
};

export default connect(stateToProps)(ValidatorName);
