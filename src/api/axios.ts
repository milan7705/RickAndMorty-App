import axios from 'axios';

export const rickApi = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});
