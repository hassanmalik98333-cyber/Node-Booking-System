import * as availabilityWindowService from '../services/availabilityWindowService.js';
import { success } from '../utils/response.js';

export async function listAvailabilityWindows(req, res) {
  const queryParams = req.validated.query;

  const { data, pagination } =
    await availabilityWindowService.listAvailabilityWindows(queryParams);

  return res.status(200).json(success({ data, pagination }));
}

export async function getAvailabilityWindowById(req, res) {
  const availabilityWindowId = req.validated.params.availabilityWindowId;

  const { data } =
    await availabilityWindowService.getAvailabilityWindowById(
      availabilityWindowId,
    );

  return res.status(200).json(success({ data }));
}
