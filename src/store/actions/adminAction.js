import actionTypes from "./actionTypes";
import {
  getAllDoctors,
  saveDetailDoctorService,
  getAllCodeService,
  getTopDoctorHomeService,
} from "../../services/userService";
import { toast } from "react-toastify";

export const fetchGenderStart = () => ({
  type: actionTypes.FETCH_GENDER_START,
});
export const fetchGenderSucces = () => ({
  type: actionTypes.FETCH_GENDER_SUCCES,
});
export const fetchGenderFaided = () => ({
  type: actionTypes.FETCH_GENDER_FAIDED,
});

export const fetchAllDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctors();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_FAILDED,
        });
      }
    } catch (e) {
      console.log("FETCH_ALL_DOCTOR_FAILDED: ", e);
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTOR_FAILDED,
      });
    }
  };
};

export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      if (res && res.errCode === 0) {
        toast.success("Lưu thông tin thành công!");
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
        });
      } else {
        toast.error("Lưu thông tin không thành công!");

        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_FAILDED,
        });
      }
    } catch (e) {
      toast.error("Lưu thông tin không thành công!");

      console.log("SAVE_DETAIL_DOCTOR_FAILDED: ", e);
      dispatch({
        type: actionTypes.SAVE_DETAIL_DOCTOR_FAILDED,
      });
    }
  };
};

export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED,
        });
      }
    } catch (e) {
      console.log("FETCH_ALLCODE_SCHEDULE_TIME_FAILDED: ", e);
      dispatch({
        type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED,
      });
    }
  };
};
export const fetchTopDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_FAILDED,
        });
      }
    } catch (e) {
      console.log("FETCH_TOP_DOCTOR_FAILDED: ", e);
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTOR_FAILDED,
      });
    }
  };
};

// export const getRequiredDoctorInfor = () => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START });
//       let resPrice = await getAllCodeService("PRICE");
//       let resPayment = await getAllCodeService("PAYMENT");
//       let resProvince = await getAllCodeService("PROVINCE");
//       if (
//         resPrice &&
//         resPrice.errCode === 0 &&
//         resPayment &&
//         resPayment.errCode === 0 &&
//         resProvince &&
//         resProvince.errCode === 0
//       ) {
//         let data = {
//           resPrice: resPrice.data,
//           resPayment: resPayment.data,
//           resProvince: resProvince.data,
//         };
//         dispatch(fetchRequiredDoctorInforSuccess(data));
//       } else {
//         dispatch(fetchRequiredDoctorInforFailed());
//       }
//     } catch (e) {
//       dispatch(fetchRequiredDoctorInforFailed());
//     }
//   };
// };

// export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
//   type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
//   data: allRequiredData,
// });

// export const fetchRequiredDoctorInforFailed = () => ({
//   type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
// });
