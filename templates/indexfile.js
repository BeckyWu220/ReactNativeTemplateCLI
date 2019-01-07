import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class ComponentName extends Component {
    static propTypes = {}

    static defaultProps = {}

    render() {
        return (
            <View style={styles.container}></View>
        );
    }
}