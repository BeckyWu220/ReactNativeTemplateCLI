import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class ScreenComponent extends Component {

    static propTypes = {}

    static defaultProps = {}

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}></View>
        );
    }
}