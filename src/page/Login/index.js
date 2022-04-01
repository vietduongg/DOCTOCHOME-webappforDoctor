import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

// import image
// import <name> from <path>
import DoctorIcon from "./Image/doctor-icon.png";

//import component
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

import { Layout, Tabs, Image, Modal } from "antd";
import "./login.css";

const Index = () => {
  const { Header, Content } = Layout;
  const { TabPane } = Tabs;
  const auth = getAuth();

  function error() {
    Modal.error({
      title: "Bạn chưa được xác nhận",
      content:
        "Trong thời gian này, bạn chưa thể đăng nhập vì chúng tôi đang xử lí hồ sơ của bạn. Vui lòng liên lạc 098-xxx-xxx hoặc doctorhome.app@gmail.com",
      onOk() {
        signOut(auth);
      },
      okText: "Quay về trang đăng nhập",
    });
  }

  function check() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "doctor", user.uid));
        if (docSnap.data().status === 0) {
          error();
        } else if (docSnap.data().status === 1) {
          window.location.href = "/dashboard";
        }
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
