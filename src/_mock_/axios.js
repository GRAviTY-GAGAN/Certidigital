
import { fireEvent, render, screen } from "../../test-utils";
import axios from 'axios';
const axiosInstance = axios.create();


jest.mock('axios', () => ({
    ...jest.requireActual('axios'),
    create: jest.fn(() => axiosInstance),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  }));