// الاستخدام في ملف آخر:

import { APIHandler } from "../apiHandler";

 

const apiHandler = new APIHandler();
 



const authEndpoints = {
  login: async (data) => {
    return await apiHandler.post('/auth/login', data);
  },
  register: async (data) => {
    return await apiHandler.post('/auth/register', data);
  },
  fetchUser: async () => {
    return await apiHandler.get('/user');
  },
  logout: async () => {
    return await apiHandler.post('/auth/logout');
  },
};

export default authEndpoints;

 

 
 



