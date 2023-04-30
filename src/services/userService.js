import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/login", { email, password });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`, { id: inputId });
};

const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userID) => {
  return axios.delete("/api/delete-user", { data: { id: userID } });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`, { id: inputType });
};

const getAllDoctors = () => {
  return axios.get(`/api/get-all-doctors`);
};
// const getAllDoctors = (inputId) => {
//   return axios.get(`/api/get-all-doctors?id=${inputId}`, { id: inputId });
// };

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const saveDetailDoctorService = (data) => {
  return axios.post(`/api/save-infor-doctors`, data);
};

const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};

const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`);
};

const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};
<<<<<<< HEAD
const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctors?id=${inputId}`);
}
const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
}
=======

const createNewPasswordService = (data) => {
  return axios.post("/api/create-new-password", data);
};

//
const getscheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId} & date=${date}`,
  );
};

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};

const getDetailInforDoctor = () => {};

>>>>>>> f7295d5b9998ed59319f896bf6c6de3a2b47ee4c
export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getAllDoctors,
  saveDetailDoctorService,
  createNewSpecialty,
  getAllSpecialty,
  saveBulkScheduleDoctor,
<<<<<<< HEAD
  getDetailInforDoctor,
  getExtraInforDoctorById
=======
  createNewPasswordService,
  //
  getscheduleDoctorByDate,
  getProfileDoctorById,
  postPatientBookAppointment,
  getDetailInforDoctor,
  getTopDoctorHomeService,
>>>>>>> f7295d5b9998ed59319f896bf6c6de3a2b47ee4c
};
