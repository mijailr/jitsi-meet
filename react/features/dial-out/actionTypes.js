import { Symbol } from '../base/react';

/**
 * The type of the action which signals a check for a dial-out phone number has
 * failed.
 *
 * {
 *     type: CHECK_PHONE_NUMBER_FAILED,
 *     response: Object
 * }
 */
export const CHECK_PHONE_NUMBER_FAILED
    = Symbol('CHECK_PHONE_NUMBER_FAILED');

/**
 * The type of the action which signals a request for dial-out phone number
 * check.
 *
 * {
 *     type: CHECK_PHONE_NUMBER_REQUEST,
 *     error: Object
 * }
 */
export const CHECK_PHONE_NUMBER_REQUEST
    = Symbol('CHECK_PHONE_NUMBER_REQUEST');

/**
 * The type of the action which signals a check for a dial-out phone number has
 * succeeded.
 *
 * {
 *     type: CHECK_PHONE_NUMBER_SUCCESS,
 *     response: Object
 * }
 */
export const CHECK_PHONE_NUMBER_SUCCESS
    = Symbol('CHECK_PHONE_NUMBER_SUCCESS');

/**
 * The type of the action which signals a cancel of the dial-out operation.
 *
 * {
 *     type: DIAL_OUT_CANCELED,
 *     response: Object
 * }
 */
export const DIAL_OUT_CANCELED
    = Symbol('DIAL_OUT_CANCELED');

/**
 * The type of the action which signals an error occurred while requesting
 * dial-out country codes.
 *
 * {
 *     type: UPDATE_DIAL_OUT_CODES_FAILED,
 *     error: Object
 * }
 */
export const UPDATE_DIAL_OUT_CODES_FAILED
    = Symbol('UPDATE_DIAL_OUT_CODES_FAILED');

/**
 * The type of the action which signals a request for dial-out country codes
 * has been started.
 *
 * {
 *     type: UPDATE_DIAL_OUT_CODES_REQUEST
 * }
 */
export const UPDATE_DIAL_OUT_CODES_REQUEST
    = Symbol('UPDATE_DIAL_OUT_CODES_REQUEST');

/**
 * The type of the action which signals a request for dial-out country codes has
 * succeeded.
 *
 * {
 *     type: UPDATE_DIAL_OUT_CODES_SUCCESS,
 *     response: Object
 * }
 */
export const UPDATE_DIAL_OUT_CODES_SUCCESS
    = Symbol('UPDATE_DIAL_OUT_CODES_SUCCESS');
