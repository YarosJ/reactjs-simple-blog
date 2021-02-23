/* eslint-disable no-param-reassign */

import { PayloadAction } from '@reduxjs/toolkit';
import { requestStatuses } from '../../../constants/api';
import { handleDefaultRequestStatuses, ExtraReducersConfig, RequestState } from '../../../utils/reducersUtils';
import { fetchUsers, deleteUser } from './actions';
import { UserData, UsersState } from './index';

const successRequestState: RequestState = {
  status: requestStatuses.succeeded,
  statusCode: null,
};

export const reducers = {};

export const extraReducers: ExtraReducersConfig = [
  // Retrieve users list reducers
  [fetchUsers.fulfilled, (
    state: UsersState,
    action: PayloadAction<{ users: UserData[], total: number }>,
  ) => {
    const { payload } = action;

    state.users = payload.users;
    state.total = payload.total;
    state.requestState = successRequestState;
  }],
  ...handleDefaultRequestStatuses(
    fetchUsers, [requestStatuses.failed, requestStatuses.pending],
  ),

  // Delete user reducers
  [deleteUser.fulfilled, (
    state: UsersState,
    { payload: { id } }: PayloadAction<{ id: string }>,
  ) => {
    state.total -= 1;
    state.users = state.users.filter(({ _id }) => _id !== id);
    state.requestState = successRequestState;
  }],
  ...handleDefaultRequestStatuses(
    deleteUser, [requestStatuses.failed, requestStatuses.pending],
  ),
];
