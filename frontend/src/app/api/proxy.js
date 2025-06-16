import { apiHandler } from './apiHandler';

export default async function handler(req, res) {
  const { endpoint, data, params, headers, token } = req.body;

  try {
    let result;
    switch (req.method) {
      case 'GET':
        result = await apiHandler.get(endpoint, params, headers, token);
        break;
      case 'POST':
        result = await apiHandler.post(endpoint, data, params, headers, token);
        break;
      case 'PUT':
        result = await apiHandler.put(endpoint, data, params, headers, token);
        break;
      case 'DELETE':
        result = await apiHandler.delete(endpoint, params, headers, token);
        break;
      default:
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}