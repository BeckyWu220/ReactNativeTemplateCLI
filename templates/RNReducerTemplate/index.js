import { createActions, createReducer } from 'reduxsauce';
export { default as thunks } from './thunks.js';

/* ------------- Initial State ------------- */
export const INITIAL_STATE = {
    loading : false
};

/* ------------- Types and Action Creators ------------- */
export const { Types, Creators } = createActions({
    setLoading     : ['loading']
});

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_LOADING]: (state, { loading }) => {
        return {
            ...state,
            loading: loading
        };
    }
});

export default Creators;