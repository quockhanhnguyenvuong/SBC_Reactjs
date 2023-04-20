import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            console.log('smartbookingcare:', action)
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            console.log('smartbookingcare2:', action)
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_FAIDED:
            console.log('smartbookingcare3:', action)
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;