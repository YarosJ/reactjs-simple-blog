export const apiUrl = 'http://localhost:5000';
export const resourceUploadRoute = 'resources';
export const uploadsRoute = 'uploads';

export const requestStatuses = {
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed',
} as const;

export const requestStatusCodes = {
  notFound: 404,
  forbidden: 403,
  serverError: 500,
} as const;

export type RequestStatus = typeof requestStatuses[keyof typeof requestStatuses];
export type RequestStatusCode = typeof requestStatusCodes[keyof typeof requestStatusCodes];

export const statusesToThunkMapping: { [key in RequestStatus]: string } = {
  [requestStatuses.succeeded]: 'fulfilled',
  [requestStatuses.pending]: 'pending',
  [requestStatuses.failed]: 'rejected',
};

const paginationDefaultSearchParams = {
  pageNumber: 1,
};

export const postsDefaultSearchParams = {
  ...paginationDefaultSearchParams,
  pageSize: 3,
};

export const usersDefaultSearchParams = {
  ...paginationDefaultSearchParams,
  pageSize: 5,
};
