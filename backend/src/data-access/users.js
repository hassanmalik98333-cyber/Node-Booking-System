import * as sqlUserQueries from './sql/userQueries.js';

// service imports from this file, this is to make the prisma transition easier

export const listActiveUsers = sqlUserQueries.listActiveUsers;
export const countActiveUsers = sqlUserQueries.countActiveUsers;
export const getActiveUserById = sqlUserQueries.getActiveUserById;
export const createUser = sqlUserQueries.createUser;
export const updateUser = sqlUserQueries.updateUser;
