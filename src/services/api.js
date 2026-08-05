// src/services/api.js
import axios from 'axios';
import api_url from '../config/apiConfig';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${api_url}Event/get`);
    return response.data.response; // make sure your API returns an array of events
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};


export const load = async (url) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${api_url}${url}`;
    const { data } = await axios.get(fullUrl);
    return data.response;
  } catch (error) {
    console.error(`Error loading data from ${url}:`, error.response?.data || error.message);
    return null;
  }
};

/**
 * Save data to a given URL using POST.
 * @param {string} url - API endpoint (relative or absolute)
 * @param {object} payload - Data to send in POST request
 * @returns {Promise<any>} - Response from the API or null if failed
 */
export const saveNormal = async (url, payload) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${api_url}${url}`;
    const { data } = await axios.post(fullUrl, payload);
    return data;
  } catch (error) {
    console.error(`Error saving data to ${url}:`, error.response?.data || error.message);
    return null;
  }
};

export const save = async (url, data) => {
  try {
    let payload = data;

    // If file upload is present, use FormData
    if (data instanceof FormData === false && Object.values(data).some(v => v instanceof File)) {
      payload = new FormData();
      Object.keys(data).forEach(key => {
        payload.append(key, data[key]);
      });
    }

    const fullUrl = url.startsWith('http') ? url : `${api_url}${url}`;
    const { data: res } = await axios.post(fullUrl, payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return res;
  } catch (error) {
    console.error(`Error saving data to ${url}:`, error.response?.data || error.message);
    return null;
  }
};
