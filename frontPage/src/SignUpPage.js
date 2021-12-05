import { Form, Input, Button, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_SERVER_API
const instanceReq = axios.create({
  baseURL: BASE_URL
})

const SignUpForm = () => {
  const [tooglePage, setTooglePage] = useState(true);
  const curYear = new Date().getFullYear()
  const [errorLoginMessage, setErrorLoginMessage] = useState('');
  const initialValues = {
    username: '',
    email: '',
    password: '',
  }
  const onFinish = async (values) => {
    const res = await instanceReq.post('api/auth/register', values)
    if (res.data.resultCode === 0) {
      setTooglePage(false)
    } else {
      setErrorLoginMessage(res.data.messages[0])
    }
  };

  return (
    <>
      {tooglePage
        ? <>
          <h1 className="formLabel">Sign Up</h1>
          <span className="formLabelText">Create your profile for free</span>
          <div className="formContainer">
            <Form
              size='large'
              name="signUpForm"
              className="login-form"
              initialValues={initialValues}
              onFinish={onFinish}
              onValuesChange={() => setErrorLoginMessage('')}
            >
              <Form.Item
                {...errorLoginMessage && {
                  help: errorLoginMessage,
                  validateStatus: 'error',
                }}
              >
                <Form.Item
                  name="login"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                  ]}
                >
                  <Input prefix={<UserOutlined
                    className="site-form-item-icon"
                  />}
                    placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your E-mail!' },
                  ]}
                >
                  <Input prefix={<MailOutlined
                    className="site-form-item-icon" />}
                    placeholder="E-mail" />
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
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Sign up
                </Button>
              </Form.Item>
            </Form>
          </div>
          <span>© mark.api {curYear}</span>
        </>
        : <Result
          status="success"
          title="Success! Have fun hacking"
          subTitle="New options coming soon ..."
          extra={[
            <Button size='large' onClick={() => setTooglePage(true)}>
              Go back
            </Button>
          ]}
        />
      }
    </>
  );
};

export const SignUpPage = () => {
  return <>
    <div className="header"></div>
    <div className="signupWrapper">
      <div className="signupContainer">
        <SignUpForm />
        <div>
          <a href="https://documenter.getpostman.com/view/17550384/UV5f7Dvw" className="link">Open API documentation</a>
        </div>
      </div>
    </div>
  </>
}
