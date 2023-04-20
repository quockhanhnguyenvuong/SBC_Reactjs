import actionTypes from './actionTypes';
import { getAllCodeService, getTopDoctorHomeService 
} from "../../services/userService";
import {toast} from "react-toastify"
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try{
            let res = await getAllCodeService("GENDER");
            if(res && res.errCode === 0){
                dispatch(fetchGenderSuccess(res.data));
            }
            else{
                dispatch(fetchGenderFaided());
            }
        } catch (e){
            dispatch(fetchGenderFaided());
            console.log('fetchGenderStart error',e)
        }
    }
}
export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try{
            let res = await getAllCodeService("ALL");
            let res1 = await getTopDoctorHomeService('');
            console.log('Check respon1:',res1)
            if(res && res.errCode === 0){
                dispatch(fetchGenderSuccess(res.data));
            }
            else{
                dispatch(fetchGenderFaided());
            }
        } catch (e){
            dispatch(fetchGenderFaided());
            console.log('fetchGenderStart error',e)
        }
    }
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFaided = () => ({
    type: actionTypes.FETCH_GENDER_FAIDED
})