import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from '../../base/i18n';
import { Dialog } from '../../base/dialog';

import { cancel, checkDialNumber, dial } from '../actions';
import DialOutNumbersForm from './DialOutNumbersForm';

/**
 * Implements a React Component which allows the user to dial out from the
 * conference.
 */
class DialOutDialog extends Component {

    /**
     * {@code DialOutDialog} component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * The function performing the cancel action.
         */
        _cancel: React.PropTypes.func,

        /**
         * The function performing the phone number validity check.
         */
        _checkDialNumber: React.PropTypes.func,

        /**
         * The function performing the dial action.
         */
        _dial: React.PropTypes.func,

        /**
         * Property indicating if a dial number is allowed.
         */
        _isDialNumberAllowed: React.PropTypes.bool,

        /**
         * Invoked to obtain translated strings.
         */
        t: React.PropTypes.func
    }

    /**
     * Initializes a new {@code DialOutNumbersForm} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            /**
             * The number to dial.
             */
            dialNumber: ''
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onDialNumberChange = this._onDialNumberChange.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                okTitleKey = 'dialOut.dial'
                onCancel = { this._onCancel }
                onSubmit = { this._onSubmit }
                titleKey = 'dialOut.dialOut'
                width = 'small'>
                { this._renderContent() }
            </Dialog>);
    }

    /**
     * Renders the dialog content.
     *
     * @returns {XML}
     * @private
     */
    _renderContent() {
        const { _isDialNumberAllowed } = this.props;

        return (
            <div className = 'dial-out-content'>
                { _isDialNumberAllowed ? '' : this._renderErrorMessage() }
                <DialOutNumbersForm
                    onChange = { this._onDialNumberChange } />
            </div>);
    }

    /**
     * Renders the error message to display if the dial phone number is not
     * allowed.
     *
     * @returns {XML}
     * @private
     */
    _renderErrorMessage() {
        const { t } = this.props;

        return (
            <div className = 'dial-out-error'>
                { t('dialOut.phoneNotAllowed') }
            </div>);
    }

    /**
     * Cancel the dial out.
     *
     * @private
     * @returns {boolean} - Returns true to indicate that the dialog should be
     * closed.
     */
    _onCancel() {
        this.props._cancel();

        return true;
    }

    /**
     * Dials the number.
     *
     * @private
     * @returns {boolean} - Returns true to indicate that the dialog should be
     * closed.
     */
    _onSubmit() {
        const dialNumber = this.state.dialNumber;

        if (this.props._isDialNumberAllowed) {
            this.props._dial(dialNumber);
        }

        return true;
    }

    /**
     * Updates the dialNumber and check for validity.
     *
     * @param {string} dialNumber - The new value of the dialNumber property.
     * @private
     * @returns {void}
     */
    _onDialNumberChange(dialNumber) {
        this.setState({
            dialNumber
        });

        if (dialNumber && dialNumber.length > 0) {
            this.props._checkDialNumber(dialNumber);
        }
    }
}

/**
 * Maps parts of Redux actions to component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @returns {{
 *     _cancel: Function,
 *     _dial: Function,
 *     _checkDialNumber: Function
 * }}
 * @private
 */
function _mapDispatchToProps(dispatch: Function): Object {
    return {
        _cancel() {
            dispatch(cancel());
        },

        /**
         * Dispatches a (redux) action to set the default toolbar buttons.
         *
         * @param {string} dialNumber - The number to dial.
         * @returns {Object} Dispatched action.
         */
        _dial(dialNumber) {
            dispatch(dial(dialNumber));
        },

        /**
         * Dispatches a (redux) action to check if a dial number is allowed.
         *
         * @param {string} dialNumber - The number to check.
         * @returns {Object} Dispatched action.
         */
        _checkDialNumber(dialNumber) {
            dispatch(checkDialNumber(dialNumber));
        }
    };
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code DialOutDialog}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _isDialNumberAllowed: React.PropTypes.bool
 * }}
 */
function _mapStateToProps(state) {
    const { isDialNumberAllowed } = state['features/dial-out'];

    return {
        /**
         * Property indicating if a dial number is allowed.
         *
         * @private
         * @type {boolean}
         */
        _isDialNumberAllowed: isDialNumberAllowed
    };
}

export default translate(
    connect(_mapStateToProps, _mapDispatchToProps)(DialOutDialog));
