import React, { useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginForm() {
  const [modalVisible, setModalVisible] = useState(false);

  function errorModal(contentP) {
    Modal.error({
      title: "Thông báo",
      content: contentP,
    });
  }

  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("Login with account", user);
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/invalid-email":
            errorModal("Sai định dạng email!");
            break;
          case "auth/user-not-found":
            errorModal("Tài khoản không tồn tại!");
            break;
          case "auth/wrong-password":
            errorModal("Sai password!");
            break;
          default:
            errorModal("Lỗi không xác định!");
            break;
        }
      });
  };

  // get values form submit
  const onFinish = (values) => {
    // value input

    console.log("Gía trị trả về khi submit:", values);
    handleLogin(values.email, values.password);
  };

  const onFinishForgotPassword = (values) => {
    sendPasswordResetEmail(auth, values.mail)
      .then(() => {
        countDown();
        setModalVisible(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setModalVisible(false);
        info(errorCode, errorMessage);
      });
  };

  function info(a, b) {
    if (a === "auth/user-not-found") {
      a = "Tài không tồn tại";
    }
    Modal.info({
      title: a,
      content: (
        <div>
          <p>Vui lòng kiểm tra</p>
        </div>
      ),
      onOk() {},
    });
  }

  function countDown() {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: "Vui lòng kiểm tra mail",
      content: `Chúng tôi sẽ gửi đường link để bạn có thể cung cấp mật khẩu mới cho chúng tôi.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `Chúng tôi sẽ gửi đường link để bạn có thể cung cấp mật khẩu mới cho chúng tôi`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  }

  const onFinishFailed = (errorInfo) => {};
  return (
    <Form
      name="basic"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 5 }}
      initialValues={{ remember: true }}
      // catch event submit
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Modal
        title="Quên mật khẩu"
        style={{ top: 20 }}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishForgotPassword}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Địa chỉ Email"
            name="mail"
            rules={[
              {
                type: "email",
                message: "Vui lòng nhập đúng format email",
              },
              {
                required: true,
                message: "Vui lòng nhập email liên hệ",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Nhận đường dẫn
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Form.Item
        label="Địa chỉ Email"
        name="email"
        rules={[
          {
            type: "email",
            message: "Vui lòng nhập đúng format email",
          },
          {
            required: true,
            message: "Vui lòng nhập email liên hệ",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu "
        name="password"
        rules={[{ required: true, message: "Vui lòng điền mật khẩu" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        <div className="ant-form-item-control-input-content-for-login-button">
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </div>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        <div className="ant-form-item-control-input-content-for-login-button">
          <Button
            type="primary"
            block
            danger
            onClick={() => setModalVisible(true)}
          >
            Quên mật khẩu
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
