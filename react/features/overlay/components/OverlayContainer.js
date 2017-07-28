import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CallOverlay } from '../../jwt';

import PageReloadFilmstripOnlyOverlay from './PageReloadFilmstripOnlyOverlay';
import PageReloadOverlay from './PageReloadOverlay';
import SuspendedFilmstripOnlyOverlay from './SuspendedFilmstripOnlyOverlay';
import SuspendedOverlay from './SuspendedOverlay';
import UserMediaPermissionsFilmstripOnlyOverlay
    from './UserMediaPermissionsFilmstripOnlyOverlay';
import UserMediaPermissionsOverlay from './UserMediaPermissionsOverlay';

declare var APP: Object;
declare var interfaceConfig: Object;

/**
 * Implements a React Component that will display the correct overlay when
 * needed.
 */
class OverlayContainer extends Component {
    /**
     * OverlayContainer component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * The browser which is used currently.
         *
         * NOTE: Used by UserMediaPermissionsOverlay only.
         *
         * @private
         * @type {string}
         */
        _browser: React.PropTypes.string,

        /**
         * The indicator which determines whether the {@link CallOverlay} is
         * displayed/visible.
         *
         * @private
         * @type {boolean}
         */
        _callOverlayVisible: React.PropTypes.bool,

        /**
         * The indicator which determines whether the status of the
         * JitsiConnection object has been "established" or not.
         *
         * NOTE: Used by PageReloadOverlay only.
         *
         * @private
         * @type {boolean}
         */
        _connectionEstablished: React.PropTypes.bool,

        /**
         * The indicator which determines whether a critical error for reload
         * has been received.
         *
         * NOTE: Used by PageReloadOverlay only.
         *
         * @private
         * @type {boolean}
         */
        _haveToReload: React.PropTypes.bool,

        /**
         * The indicator which determines whether the GUM permissions prompt is
         * displayed or not.
         *
         * NOTE: Used by UserMediaPermissionsOverlay only.
         *
         * @private
         * @type {boolean}
         */
        _isMediaPermissionPromptVisible: React.PropTypes.bool,

        /**
         * The indicator which determines whether the reload was caused by
         * network failure.
         *
         * NOTE: Used by PageReloadOverlay only.
         *
         * @private
         * @type {boolean}
         */
        _isNetworkFailure: React.PropTypes.bool,

        /**
         * The reason for the error that will cause the reload.
         *
         * NOTE: Used by PageReloadOverlay only.
         *
         * @private
         * @type {string}
         */
        _reason: React.PropTypes.string,

        /**
         * The indicator which determines whether the GUM permissions prompt is
         * displayed or not.
         *
         * NOTE: Used by SuspendedOverlay only.
         *
         * @private
         * @type {string}
         */
        _suspendDetected: React.PropTypes.bool
    };

    /**
     * Initializes a new ReloadTimer instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     * @public
     */
    constructor(props) {
        super(props);

        this.state = {
            /**
             * The indicator which determines whether filmstrip-only mode is
             * enabled.
             *
             * @type {boolean}
             */
            filmstripOnly:
                typeof interfaceConfig === 'object'
                    && interfaceConfig.filmStripOnly
        };
    }

    /**
     * React Component method that executes once component is updated.
     *
     * @inheritdoc
     * @returns {void}
     * @protected
     */
    componentDidUpdate() {
        if (typeof APP === 'object') {
            APP.UI.overlayVisible
                = (this.props._connectionEstablished
                        && this.props._haveToReload)
                    || this.props._suspendDetected
                    || this.props._isMediaPermissionPromptVisible;
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     * @public
     */
    render() {
        const { filmstripOnly } = this.state;
        let overlayComponent, props;

        if (this.props._connectionEstablished && this.props._haveToReload) {
            overlayComponent
                = filmstripOnly
                    ? PageReloadFilmstripOnlyOverlay
                    : PageReloadOverlay;
            props = {
                isNetworkFailure: this.props._isNetworkFailure,
                reason: this.props._reason
            };
        } else if (this.props._suspendDetected) {
            overlayComponent
                = filmstripOnly
                    ? SuspendedFilmstripOnlyOverlay
                    : SuspendedOverlay;
        } else if (this.props._isMediaPermissionPromptVisible) {
            overlayComponent
                = filmstripOnly
                    ? UserMediaPermissionsFilmstripOnlyOverlay
                    : UserMediaPermissionsOverlay;
            props = {
                browser: this.props._browser
            };
        } else if (this.props._callOverlayVisible) {
            overlayComponent = CallOverlay;
        }

        return (
            overlayComponent
                ? React.createElement(overlayComponent, props)
                : null);
    }
}

/**
 * Maps (parts of) the redux state to the associated OverlayContainer's props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _browser: string,
 *     _callOverlayVisible: boolean,
 *     _connectionEstablished: boolean,
 *     _haveToReload: boolean,
 *     _isNetworkFailure: boolean,
 *     _isMediaPermissionPromptVisible: boolean,
 *     _reason: string,
 *     _suspendDetected: boolean
 * }}
 * @private
 */
function _mapStateToProps(state) {
    const stateFeaturesOverlay = state['features/overlay'];

    return {
        /**
         * The browser which is used currently.
         *
         * NOTE: Used by {@link UserMediaPermissionsOverlay} only.
         *
         * @private
         * @type {string}
         */
        _browser: stateFeaturesOverlay.browser,

        /**
         * The indicator which determines whether the {@link CallOverlay} is
         * displayed/visible.
         *
         * @private
         * @type {boolean}
         */
        _callOverlayVisible: Boolean(state['features/jwt'].callOverlayVisible),

        /**
         * The indicator which determines whether the status of the
         * JitsiConnection object has been "established" or not.
         *
         * NOTE: Used by {@link PageReloadOverlay} only.
         *
         * @private
         * @type {boolean}
         */
        _connectionEstablished: stateFeaturesOverlay.connectionEstablished,

        /**
         * The indicator which determines whether a critical error for reload
         * has been received.
         *
         * NOTE: Used by {@link PageReloadOverlay} only.
         *
         * @private
         * @type {boolean}
         */
        _haveToReload: stateFeaturesOverlay.haveToReload,

        /**
         * The indicator which determines whether the GUM permissions prompt is
         * displayed or not.
         *
         * NOTE: Used by {@link UserMediaPermissionsOverlay} only.
         *
         * @private
         * @type {boolean}
         */
        _isMediaPermissionPromptVisible:
            stateFeaturesOverlay.isMediaPermissionPromptVisible,

        /**
         * The indicator which determines whether the reload was caused by
         * network failure.
         *
         * NOTE: Used by {@link PageReloadOverlay} only.
         *
         * @private
         * @type {boolean}
         */
        _isNetworkFailure: stateFeaturesOverlay.isNetworkFailure,

        /**
         * The reason for the error that will cause the reload.
         *
         * NOTE: Used by {@link PageReloadOverlay} only.
         *
         * @private
         * @type {string}
         */
        _reason: stateFeaturesOverlay.reason,

        /**
         * The indicator which determines whether the GUM permissions prompt is
         * displayed or not.
         *
         * NOTE: Used by {@link SuspendedOverlay} only.
         *
         * @private
         * @type {string}
         */
        _suspendDetected: stateFeaturesOverlay.suspendDetected
    };
}

export default connect(_mapStateToProps)(OverlayContainer);
