import React, { useState } from "react";
import "antd/dist/antd.css";

// import image
// import <name> from <path>
import DoctorIcon from "./Image/doctor-icon.png";

//import component
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

import { Layout, Tabs, Image, Modal } from "antd";
import "./login.css";

const Index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { Header, Content } = Layout;
  const { TabPane } = Tabs;

  // this arrow function will process register

  return (
    <Layout className="Layout">
      <Header>Header</Header>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Content className="Content">
        <Image
          // src={process.env.PUBLIC_URL + "/images/doctor-icon.png"}
          src={DoctorIcon}
          preview={false}
          height={150}
        />
        <b>DOCTOR HOME - Phiên bản dành cho bác sĩ</b>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đăng nhập" key="1">
            <LoginForm />
          </TabPane>
          <TabPane tab="Đăng kí" key="2">
            <RegisterForm />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Index;
