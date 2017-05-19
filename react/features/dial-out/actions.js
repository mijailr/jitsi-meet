import { openDialog } from '../../features/base/dialog';

import {
    CHECK_PHONE_NUMBER_FAILED,
    CHECK_PHONE_NUMBER_REQUEST,
    CHECK_PHONE_NUMBER_SUCCESS,
    DIAL_OUT_CANCELED,
    UPDATE_DIAL_OUT_CODES_FAILED,
    UPDATE_DIAL_OUT_CODES_REQUEST,
    UPDATE_DIAL_OUT_CODES_SUCCESS
} from './actionTypes';

import { DialOutDialog } from './components';

declare var $: Function;
declare var config: Object;

/**
 * Dials the given number.
 *
 * @returns {Function}
 */
export function cancel() {
    return dispatch => {
        dispatch({
            type: DIAL_OUT_CANCELED
        });
    };
}

/**
 * Dials the given number.
 *
 * @param {string} dialNumber - The number to dial.
 * @returns {Function}
 */
export function dial(dialNumber) {
    return (dispatch, getState) => {
        const { conference } = getState()['features/base/conference'];

        conference.dial(dialNumber);
    };
}

/**
 * Sends an ajax request for dial-out country codes.
 *
 * @param {string} dialNumber - The dial number to check for validity.
 * @returns {Function}
 */
export function checkDialNumber(dialNumber) {
    const fullUrl = `${config.dialOutAuthUrl}?phone=${dialNumber}`;

    return dispatch => {
        dispatch({
            type: CHECK_PHONE_NUMBER_REQUEST
        });

        $.getJSON(fullUrl)
            .success(response =>
                dispatch({
                    type: CHECK_PHONE_NUMBER_SUCCESS,
                    response
                }))
            .error(error =>
                dispatch({
                    type: CHECK_PHONE_NUMBER_FAILED,
                    error
                }));
    };
}


/**
 * Opens the dial-out dialog.
 *
 * @returns {Function}
 */
export function openDialOutDialog() {
    return openDialog(DialOutDialog);
}

/**
 * Sends an ajax request for dial-out country codes.
 *
 * @returns {Function}
 */
export function updateDialOutCodes() {
    return dispatch => {
        dispatch({
            type: UPDATE_DIAL_OUT_CODES_REQUEST
        });

        $.getJSON(config.dialOutCodesUrl)
            .success(response =>
                dispatch({
                    type: UPDATE_DIAL_OUT_CODES_SUCCESS,
                    response
                }))
            .error(error =>
                dispatch({
                    type: UPDATE_DIAL_OUT_CODES_FAILED,
                    error
                }));
    };
}
