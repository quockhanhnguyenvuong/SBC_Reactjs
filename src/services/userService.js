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
};
