import React, { Component } from 'react';
import { connect } from 'react-redux';
import ExpandIcon from '@atlaskit/icon/glyph/expand';
import { StatelessDropdownMenu } from '@atlaskit/dropdown-menu';

import { translate } from '../../base/i18n';
import CountryIcon from './CountryIcon';
import { updateDialOutCodes } from '../actions';

const EXPAND_ICON = <ExpandIcon label = 'expand' />;

/**
 * React {@code Component} responsible for fetching and displaying dial-out
 * country codes, as well as dialing a phone number.
 *
 * @extends Component
 */
class DialOutNumbersForm extends Component {
    /**
     * {@code DialOutNumbersForm}'s property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * The redux state representing the list of dial-out codes.
         */
        _dialOutCodes: React.PropTypes.array,

        /**
         * Invoked to send an ajax request for dial-out codes.
         */
        dispatch: React.PropTypes.func,

        /**
         *
         */
        onChange: React.PropTypes.func,

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
            dialInput: '',

            /**
             * Whether or not the dropdown should be open.
             *
             * @type {boolean}
             */
            isDropdownOpen: false,

            /**
             *
             *
             * @type {string}
             */
            selectedCode: ''
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onInputChange = this._onInputChange.bind(this);
        this._onOpenChange = this._onOpenChange.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t, _dialOutCodes } = this.props;

        const items
            = _dialOutCodes ? this._formatCountryCodes(_dialOutCodes) : [];

        let selectedCode = '';

        if (this.state.selectedCode
            && this.state.selectedCode.country) {
            selectedCode = this.state.selectedCode.country;
        }

        return (
            <div className = 'form-control'>
                { this._createDropdownMenu(items, selectedCode) }
                <div className = 'dial-out-input'>
                    <input
                        className = 'input-control'
                        label = ''
                        onChange = { this._onInputChange }
                        placeholder = { t('dialOut.enterPhone') } />
                </div>
            </div>
        );
    }

    /**
     * Dispatches a request for dial out codes if not already present in the
     * redux store. If dial out codes are present, sets a default code to
     * display in the dropdown trigger.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount() {
        const dialOutCodes = this.props._dialOutCodes;

        if (dialOutCodes) {
            this._setDefaultCode(dialOutCodes);
        } else {
            this.props.dispatch(
                updateDialOutCodes());
        }
    }

    /**
     * Monitors for dial out code updates and sets a default code to display in
     * the dropdown trigger if not already set.
     *
     * @inheritdoc
     * returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (!this.state.selectedCode && nextProps._dialOutCodes) {
            this._setDefaultCode(nextProps._dialOutCodes);
        }
    }

    /**
     * Creates a {@code StatelessDropdownMenu} instance.
     *
     * @param {Array} items - The content to display within the dropdown.
     * @param {Object} selectedCode - The selected country.
     * @returns {ReactElement}
     */
    _createDropdownMenu(items, selectedCode) {
        return (
            <StatelessDropdownMenu
                isOpen = { this.state.isDropdownOpen }
                items = { [ { items } ] }
                onItemActivated = { this._onSelect }
                onOpenChange = { this._onOpenChange }
                shouldFitContainer = { true }>
                { this._createDropdownTrigger(
                    selectedCode.dialCode,
                    selectedCode.code) }
            </StatelessDropdownMenu>
        );
    }

    /**
     * Creates a React {@code Component} with a readonly HTMLInputElement as a
     * trigger for displaying the dropdown menu. The {@code Component} will also
     * display the currently selected number.
     *
     * @param {string} dialCode -
     * @param {string} countryCode -
     * @private
     * @returns {ReactElement}
     */
    _createDropdownTrigger(dialCode, countryCode) {
        return (
            <div className = 'dropdown'>
                <CountryIcon
                    className = 'dial-out-flag-icon'
                    countryCode = { `${countryCode}` } />
                <input
                    className = 'input-control dial-out-code'
                    readOnly = { true }
                    type = 'text'
                    value = { dialCode || '' } />
                <span className = 'dropdown-trigger-icon'>
                    { EXPAND_ICON }
                </span>
            </div>
        );
    }

    /**
     * Updates the dialInput state when the input changes.
     *
     * @param {Object} e - The event notifying us of the change.
     * @private
     * @returns {void}
     */
    _onInputChange(e) {
        this.setState({
            dialInput: e.target.value
        }, () => {
            this._onDialNumberChange();
        });
    }

    /**
     * Updates the dialNumber when changes to the dial text or code happen.
     *
     * @private
     * @returns {void}
     */
    _onDialNumberChange() {
        const dialInput = this.state.dialInput;

        const dialNumber
            = this.state.selectedCode
            ? this.state.selectedCode.content
                + this._formatDialInput(dialInput)
            : dialInput;

        const formattedNumber = this._formatDialNumber(dialNumber);

        this.props.onChange(formattedNumber);
    }

    /**
     * Formats the dial input text.
     *
     * @param {string} dialInput - The text input for dial number.
     * @private
     * @returns {string} - The formatted phone number.
     */
    _formatDialInput(dialInput) {
        let startIndex = 0;

        if (dialInput.startsWith('00')) {
            startIndex = 2;
        } else if (dialInput.startsWith('0') || dialInput.startsWith('+')) {
            startIndex = 1;
        }

        return dialInput.substring(startIndex);
    }

    /**
     * Formats the dial number and country code as a whole.
     *
     * @param {string} dialNumber - The phone number to format.
     * @private
     * @returns {string} - The formatted phone number.
     */
    _formatDialNumber(dialNumber) {
        let formattedNumber = dialNumber.replace(/\s+/g, '');

        if (formattedNumber.startsWith('+')) {
            formattedNumber = formattedNumber.substring(1);
        }

        return formattedNumber;
    }

    /**
     * Sets the internal state to either open or close the dropdown. If the
     * dropdown is disabled, the state will always be set to false.
     *
     * @param {Object} dropdownEvent - The even returned from clicking on the
     * dropdown trigger.
     * @private
     * @returns {void}
     */
    _onOpenChange(dropdownEvent) {
        this.setState({
            isDropdownOpen: dropdownEvent.isOpen
        });
    }

    /**
     * Updates the internal state of the currently selected country code.
     *
     * @param {Object} selection - Event from choosing an dropdown option.
     * @private
     * @returns {void}
     */
    _onSelect(selection) {
        this.setState({
            isDropdownOpen: false,
            selectedCode: selection.item
        }, () => {
            this._onDialNumberChange();
        });
    }

    /**
     * Updates the internal state of the currently selected number by defaulting
     * to the first available number.
     *
     * @param {Object} countryCodes - The list of country codes to choose from
     * for setting a default code.
     * @private
     * @returns {void}
     */
    _setDefaultCode(countryCodes) {
        this.setState({
            selectedCode: this._formatCountryCodes(countryCodes)[0]
        });
    }

    /**
     * Transforms the passed in numbers object into an array of objects that can
     * be parsed by {@code StatelessDropdownMenu}.
     *
     * @param {Object} countryCodes -
     * @private
     * @returns {Array<Object>}
     */
    _formatCountryCodes(countryCodes) {

        return countryCodes.map(country => {
            const countryIcon
                = <CountryIcon countryCode = { `${country.code}` } />;

            const countryElement
                = <span>{countryIcon} { country.name }</span>;

            return {
                content: `${country.dialCode}`,
                elemBefore: countryElement,
                country
            };
        });
    }
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code DialOutNumbersForm}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _dialOutCodes: React.PropTypes.object
 * }}
 */
function _mapStateToProps(state) {
    const { dialOutCodes } = state['features/dial-out'];

    return {
        _dialOutCodes: dialOutCodes
    };
}

export default translate(connect(_mapStateToProps)(DialOutNumbersForm));
