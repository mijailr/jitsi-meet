/* @flow */

import React, { Component } from 'react';

import { Toolbox } from '../../toolbox';

/**
 * Implements a React {@link Component} which represents the filmstrip on
 * Web/React.
 *
 * @extends Component
 */
export default class Filmstrip extends Component {
    static propTypes = {
        /**
         * Whether or not the toolbox should be displayed within the filmstrip.
         */
        displayToolbox: React.PropTypes.bool
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div className = 'filmstrip'>
                { this.props.displayToolbox ? <Toolbox /> : null }
                <div
                    className = 'filmstrip__videos'
                    id = 'remoteVideos'>
                    <div
                        className = 'filmstrip__videos'
                        id = 'filmstripLocalVideo'>
                        <span
                            className = 'videocontainer'
                            id = 'localVideoContainer'>
                            <div className = 'videocontainer__background' />
                            <span id = 'localVideoWrapper' />
                            <audio
                                autoPlay = { true }
                                id = 'localAudio'
                                muted = { true } />
                            <div className = 'videocontainer__toolbar' />
                            <div className = 'videocontainer__toptoolbar' />
                            <div className = 'videocontainer__hoverOverlay' />
                            <div className = 'displayNameContainer' />
                            <div className = 'avatar-container' />
                        </span>
                    </div>
                    <div
                        className = 'filmstrip__videos'
                        id = 'filmstripRemoteVideos'>
                        {/*
                          * This extra video container is needed for scrolling
                          * thumbnails in Firefox; otherwise, the flex
                          * thumbnails resize instead of causing overflow.
                          */}
                        <div
                            className = 'remote-videos-container'
                            id = 'filmstripRemoteVideosContainer' />
                    </div>
                    <audio
                        id = 'userJoined'
                        preload = 'auto'
                        src = 'sounds/joined.wav' />
                    <audio
                        id = 'userLeft'
                        preload = 'auto'
                        src = 'sounds/left.wav' />
                </div>
            </div>
        );
    }
}
