import axios from 'axios';
import authHeader from './auth-header';

export const API_URL = `http://localhost:8080/api`;

class OrgService {
  getOrganizations(selectedOrg?: string) {
    let orgQuery = '';
    if (selectedOrg && selectedOrg !== '-1') {
      orgQuery = '?orgId=' + selectedOrg;
    }

    return axios.get(API_URL + 'organization/' + orgQuery, { headers: authHeader() });
  }

  createOrganization(name: string, description: string, domain: string, logoImgSrc: string) {
    return axios.post(
      API_URL + 'organization/',
      {
        name,
        description,
        domain,
        logoImgSrc,
      },
      { headers: authHeader() }
    );
  }

  updateOrganization(
    id: string,
    name: string,
    description: string,
    domain: string,
    logoImgSrc: string
  ) {
    return axios.put(
      API_URL + 'organization/' + id,
      {
        name,
        description,
        domain,
        logoImgSrc,
      },
      { headers: authHeader() }
    );
  }

  disableOrgs(ids: Array<string>) {
    return axios.put(API_URL + 'organization/disable', ids, { headers: authHeader() });
  }

  enableOrgs(ids: Array<string>) {
    return axios.put(API_URL + 'organization/enable', ids, { headers: authHeader() });
  }

  deleteOrganization(id: string) {
    return axios.delete(API_URL + 'user/' + id, { headers: authHeader() });
  }
}

export default new OrgService();
