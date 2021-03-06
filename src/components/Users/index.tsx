import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Table, Typography } from 'antd';
import { selectors as userSelectors, actions } from './store';
import { requestStatuses, usersDefaultSearchParams } from '../../constants/api';
import { updateSearch } from '../../utils/browserHistoryUtils';
import { UserData } from './store/interfaces';
import ErrorPage from '../common/ErrorPage';
import Sorting from '../common/Sorting';
import Search from '../common/Search';
import Delete from '../common/Delete';
import styles from './usersTable.module.less';

const { pageSize } = usersDefaultSearchParams;

export default ({ location: { search } }: RouteComponentProps) => {
  const users: UserData[] = useSelector(userSelectors.selectUsers);
  const total: number = useSelector(userSelectors.selectTotal);
  const { status, statusCode } = useSelector(userSelectors.selectRequestState);
  const currentUserId: string|null = localStorage.getItem('currentUserId');
  const dispatch = useDispatch();

  const handleChange = (pageNumber: number) => {
    updateSearch({ pageNumber, pageSize });
  };

  useEffect(() => {
    dispatch(actions.fetchUsers(search));
  }, [search]);

  if (status === requestStatuses.failed) {
    return <ErrorPage statusCode={statusCode} />;
  }

  return (
    <>
      <Typography.Paragraph className={styles.usersFilters}>
        <Sorting search={search} queryField="sorting" />
        <Search search={search} queryField="username" />
      </Typography.Paragraph>
      <Table
        loading={status === requestStatuses.pending}
        pagination={{
          total,
          pageSize,
          onChange: handleChange,
        }}
        columns={[
          {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',
          },
          {
            title: 'Posts count',
            dataIndex: 'postsCount',
            key: 'postsCount',
          },
          {
            dataIndex: 'actions',
            key: 'actions',
            render: (id: string) => (
              <div className={styles.userActions}>
                <Link to={`/?user=${id}`}>See user posts</Link>
                {currentUserId !== id ? (
                  <Delete
                    onConfirm={() => dispatch(actions.deleteUser(id))}
                    entityName="user"
                  />
                ) : null}
              </div>
            ),
          },
        ]}
        dataSource={users.map(({ _id, username, posts }) => ({
          username,
          key: _id,
          actions: _id,
          postsCount: posts.length,
        }))}
      />
    </>
  );
};
