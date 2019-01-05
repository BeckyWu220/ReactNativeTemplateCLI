import Actions from './index';

export const sampleAction = () => {
    return (dispatch) => {
        dispatch(Actions.setLoading(true));
    }
};

export default {
    sampleAction
};
