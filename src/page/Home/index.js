import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./Home.css";
import { Layout, Menu, Avatar } from "antd";
import {
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  UserOutlined,
  InfoCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import Dashboard from "../../components/Dashboard";
import Appointment from "../../components/Appointment";
import Listmedicalrecord from "../../components/ListMedicalRecord";

const Home = () => {
  const { Header, Content, Footer, Sider } = Layout;
  const [reRender, setRerender] = useState(0);
  const [doctorData, setDoctorData] = useState([]);
  const [userID, setUserID] = useState("");
  const auth = getAuth();
  console.log(doctorData);
  function getData() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "doctor", user.uid));
        setUserID(user.uid);
        setTimeout(setDoctorData(docSnap.data()), 1000);
        setRerender(1);
      } else {
      }
    });
  }

  useEffect(() => {
    getData();
  }, [reRender]);

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <span style={{ color: "#fffbe6" }}>
            <b>DOCTOR HOME</b>
          </span>
        </div>
        <Menu theme="light" mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />}>
            Thông tin cá nhân
          </Menu.Item>
          <Menu.Item key="2" icon={<HomeOutlined />}>
            TT phòng khám
          </Menu.Item>
          <Menu.Item key="3" icon={<InfoCircleOutlined />}>
            Báo cáo lỗi
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<ShopOutlined />}
            onClick={() =>
              signOut(auth)
                .then(() => {
                  window.location.href = "http://localhost:3000";
                })
                .catch((error) => {
                  // An error happened.
                })
            }
          >
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header
          className="site-layout-background"
          style={{ padding: 0, fontSize: 17 }}
        >
          <Avatar size={50} src={doctorData.avatar} /> Xin chào{" "}
          <b>{doctorData.fullName}</b>,
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <Dashboard userID={userID} />
          </div>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center", marginTop: 20 }}
          >
            {" "}
            <div
              className="site-layout-background"
              style={{ padding: 20, textAlign: "center", fontSize: 40 }}
            >
              <b size={50}>Kiểm tra lịch hẹn của bạn</b>
            </div>
            <Appointment userID={userID} doctorData={doctorData} />
          </div>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center", marginTop: 20 }}
          >
            {" "}
            <div
              className="site-layout-background"
              style={{ padding: 20, textAlign: "center", fontSize: 40 }}
            >
              <b>Hồ sơ bệnh án bạn đã cung cấp</b>
            </div>
            <Listmedicalrecord />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          DOCTOR HOME - phiên bản web dành cho bác sĩ
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Home;
