import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// import image
// import <name> from <path>
import DoctorIcon from "./Image/doctor-icon.png";

//import component
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

import { Layout, Tabs, Image } from "antd";
import "./login.css";

const Index = () => {
  const { Header, Content } = Layout;
  const { TabPane } = Tabs;
  const auth = getAuth();

  function check() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        window.location.href = "http://localhost:3000/dashboard";
      }
    });
  }
  // this arrow function will process register
  useEffect(() => {
    check();
  }, []);
  return (
    <Layout className="Layout">
      <Header>Header</Header>
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
