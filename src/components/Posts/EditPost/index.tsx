import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { selectors, actions } from '../store';
import useDebounceSelector from '../../../utils/useDebouncedSelector';
import uploadAdapter from '../../../utils/uploadAdapter';
import { requestStatuses } from '../../../constants/api';
import { NewPostData } from '../store/interfaces';
import ErrorPage from '../../common/ErrorPage';
import WithGoBack from '../../common/WithGoBack';
import Editor from '../Editor';
import styles from './editPost.module.less';

export default () => {
  const {
    post,
    requestState: { status, statusCode },
  } = useDebounceSelector(selectors.selectBeingEditedPost);
  const { id } : { id: string } = useParams();
  const resources: string[] = [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchBeingEditedPost(id));
  }, []);

  switch (status) {
    case requestStatuses.pending:
      return <Skeleton active paragraph={{ rows: 12 }} className={styles.postSkeleton} />;
    case requestStatuses.failed:
      return <ErrorPage statusCode={statusCode} />;
    default:
      return (
        <WithGoBack>
          <Editor
            initialData={post}
            uploadAdapter={uploadAdapter(
              (postId: string) => resources.push(postId),
            )}
            onSubmit={(updatedPostData: NewPostData) => {
              dispatch(actions.updatePost({
                id,
                postData: { ...updatedPostData, resources },
              }));
            }}
          />
        </WithGoBack>
      );
  }
};
