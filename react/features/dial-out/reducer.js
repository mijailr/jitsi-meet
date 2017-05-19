import {
    ReducerRegistry
} from '../base/redux';

import {
    CHECK_PHONE_NUMBER_FAILED,
    CHECK_PHONE_NUMBER_REQUEST,
    CHECK_PHONE_NUMBER_SUCCESS,
    DIAL_OUT_CANCELED,
    UPDATE_DIAL_OUT_CODES_FAILED,
    UPDATE_DIAL_OUT_CODES_REQUEST,
    UPDATE_DIAL_OUT_CODES_SUCCESS
} from './actionTypes';

const DEFAULT_STATE = {
    isDialNumberAllowed: true,
    dialOutCodes: null
};

ReducerRegistry.register(
    'features/dial-out',
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {
        case CHECK_PHONE_NUMBER_FAILED: {
            return {
                ...state,
                error: action.error
            };
        }

        case CHECK_PHONE_NUMBER_REQUEST: {
            return {
                ...state,
                error: null
            };
        }
        case CHECK_PHONE_NUMBER_SUCCESS: {
            return {
                ...state,
                error: null,
                isDialNumberAllowed: action.response.allow
            };
        }
        case DIAL_OUT_CANCELED: {
            return DEFAULT_STATE;
        }
        case UPDATE_DIAL_OUT_CODES_FAILED: {
            return {
                ...state,
                error: action.error
            };
        }

        case UPDATE_DIAL_OUT_CODES_REQUEST: {
            return {
                ...state,
                error: null
            };
        }
        case UPDATE_DIAL_OUT_CODES_SUCCESS: {
            return {
                ...state,
                error: null,
                dialOutCodes: action.response
            };
        }
        }

        return state;
    });
