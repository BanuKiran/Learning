import axios, { AxiosResponse } from 'axios';
import authHeader from './auth-header';
export const API_URL = `http://localhost:8080/api`;

class UserService {
  parseJwt(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    const user = localStorage.getItem('user');
    if (user) {
      return axios.get(API_URL + 'user/current', { headers: authHeader() });
    }
    return new Promise<AxiosResponse>(() => {});
  }

  getUsers(selectedOrg?: string) {
    let orgQuery = '';
    if (selectedOrg && selectedOrg !== '-1') {
      orgQuery = '?orgId=' + selectedOrg;
    }
    return axios.get(API_URL + 'user/' + orgQuery, { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  createUser(
    firstName: string,
    lastName: string,
    email: string,
    organizationId: string,
    role: string
  ) {
    const data: any = {
      firstName,
      lastName,
      email,
      role,
    };
    if (organizationId && organizationId !== '-1') {
      data.organizationId = organizationId;
    }
    return axios.post(API_URL + 'user/', data, { headers: authHeader() });
  }

  updateUser(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    organizationId: string
  ) {
    return axios.put(
      API_URL + 'user/' + id,
      {
        firstName,
        lastName,
        email,
        role,
        organizationId,
      },
      { headers: authHeader() }
    );
  }

  disableUsers(ids: Array<string>) {
    return axios.put(API_URL + 'user/disable', ids, { headers: authHeader() });
  }

  enableUsers(ids: Array<string>) {
    return axios.put(API_URL + 'user/enable', ids, { headers: authHeader() });
  }

  deleteUser(id: string) {
    return axios.delete(API_URL + 'user/' + id, { headers: authHeader() });
  }
}

export default new UserService();
