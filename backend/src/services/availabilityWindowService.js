import * as availabilityWindowQueries from '../data-access/availabilityWindows.js';
import AppError from '../errors/AppError.js';
import ERROR_CODES from '../errors/errorCodes.js';
import caughtError from '../errors/caughtError.js';
import {
  getLimitAndOffset,
  derivePagination,
} from './helpers/paginationHelpers.js';

function mapAvailabilityWindow(window) {
  return {
    id: window.id,
    resourceId: window.resource_id,
    startTime: window.start_time,
    endTime: window.end_time,
    cancellationNoticeMinutes: window.cancellation_notice_minutes,
    createdAt: window.created_at,
    updatedAt: window.updated_at,
    deletedAt: window.deleted_at,
    allowedDurations: window.allowed_durations,
  };
}

export async function listAvailabilityWindows(queryParams) {
  try {
    const {
      page,
      pageSize,
      sortBy,
      sortDirection,
      status = 'active',
      resourceId,
      ownerId,
    } = queryParams;

    const { limit, offset } = getLimitAndOffset({ page, pageSize });

    const filters = {
      limit,
      offset,
      sortBy,
      sortDirection,
      status,
      resourceId,
      ownerId,
    };

    const [availabilityWindows, total] = await Promise.all([
      availabilityWindowQueries.listAvailabilityWindows(filters),
      availabilityWindowQueries.countAvailabilityWindows(filters),
    ]);

    return {
      data: availabilityWindows.map(mapAvailabilityWindow),
      pagination: derivePagination({ page, pageSize, total }),
    };
  } catch (error) {
    throw caughtError(error);
  }
}

export async function getAvailabilityWindowById(windowId) {
  try {
    const availabilityWindow =
      await availabilityWindowQueries.getAvailabilityWindowById(windowId);

    if (!availabilityWindow) {
      throw AppError.notFound('Availability window not found.', {
        code: ERROR_CODES.AVAILABILITY_WINDOW_NOT_FOUND,
      });
    }

    return {
      data: mapAvailabilityWindow(availabilityWindow),
    };
  } catch (error) {
    throw caughtError(error);
  }
}
