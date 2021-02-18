import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Location } from 'history';
import {
  Spin,
  Form,
  Input,
  Button,
  Typography,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { selectors, actions } from '../store';
import { AuthCredentials } from '../store/actions';
import { loadingStatuses } from '../../../constants/api';
import SomethingWentWrong from '../../common/Errors/SomethingWentWrong';
import styles from './signIn.module.less';

export default ({ location }: { location: Location<string> }) => {
  const loading = useSelector(selectors.selectLoading);
  const signedIn = useSelector(selectors.selectSignedIn);
  const dispatch = useDispatch();

  const onFinish = (values: AuthCredentials) => {
    dispatch(actions.signIn(values));
  };

  if (!signedIn) {
    switch (loading) {
      case loadingStatuses.succeeded:
        return (
          <div className={styles.formWrapper}>
            <Form
              name="normal_login"
              className={styles.loginForm}
              onFinish={onFinish}
            >
              <Typography.Paragraph className={styles.formIcon}>
                <UserOutlined />
              </Typography.Paragraph>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                  Log in
                </Button>
                Or
                {' '}
                <Link to="/auth/signUp">register now!</Link>
              </Form.Item>
            </Form>
          </div>
        );
      case loadingStatuses.pending:
        return (
          <div className={styles.spinWrapper}>
            <Spin size="large" tip="Signing In..." />
          </div>
        );
      default:
        return (
          <SomethingWentWrong
            message={(
              <Button onClick={() => dispatch(actions.resetAuth())}>
                Try again
              </Button>
            )}
          />
        );
    }
  }

  return <Redirect to={location.state || ''} />;
};