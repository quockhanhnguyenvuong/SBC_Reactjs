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

// const getAllDoctors = () => {
//   return axios.get(`/api/get-all-doctors`);
// };
const getAllDoctors = (inputId) => {
  return axios.get(`/api/get-all-doctors?id=${inputId}`, { id: inputId });
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

const getDetailInforDoctor = (inpuId) => {
  return axios.get(`/api/get-detail-by-id?id=${inpuId}`);
};

const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};

const getscheduleDoctorByDate = (doctorId, date) => {
  return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId} & date=${date}`);
};
// có 1 getExtraInforDoctorById ở đây

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookAppointment = (data) =>{
  return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) =>{
  return axios.post('/api/verify-book-appointment', data)
}

const getAllPatientForDoctor = (data) => {
  return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
};

const postSendRemedy = (data) => {
  return axios.get(`/api/send-remedy`, data);
};

const postSendRefuse = (data) => {
  return axios.get(`/api/send-refuse`, data);
};


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
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getscheduleDoctorByDate,
  getProfileDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment, getAllPatientForDoctor,
  postSendRemedy, postSendRefuse,
};
