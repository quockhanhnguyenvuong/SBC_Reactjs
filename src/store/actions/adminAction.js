import actionTypes from "./actionTypes";
import {
  getAllDoctors,
  saveDetailDoctorService,
  getAllCodeService,
} from "../../services/userService";
import { toast } from "react-toastify";

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
