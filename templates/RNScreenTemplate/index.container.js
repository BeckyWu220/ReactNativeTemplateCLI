import React, { Component } from 'react';
import ScreenComponent from './index.component';
import { connect } from 'react-redux';

class ScreenContainer extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle: 'Nav Header Title'
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScreenComponent/>
        )
    }
}

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreenContainer);