import axios from "axios";

// const PRODUCT_SERVICE_URL = 'http://127.0.0.1:3000/products-queue'; // IN process.env in future
const PRODUCT_SERVICE_URL = 'https://4dxuphplo9.execute-api.eu-west-1.amazonaws.com/prod/products-queue'; // IN process.env in future

export const PullData = async (requestData: Record<string, unknown>) => {
    return axios.post(PRODUCT_SERVICE_URL, requestData);
};