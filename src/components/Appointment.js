import React, { useEffect, useState } from "react";
import {
  Tabs,
  Button,
  Space,
  Modal,
  Progress,
  Card,
  Col,
  Row,
  Radio,
  Form,
  Input,
} from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./../firebase";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import { doc, setDoc } from "firebase/firestore";

//import Component from ""
import MeidicalRecord from "./MedicalRecord";
import TableData from "./TableData";

export default function Appointment({ userID, doctorData }) {
  const { confirm } = Modal;
  const { TabPane } = Tabs;
  let [acpPercent, setAcpPercent] = useState(0);
  let [refusePercent, setRefusePercent] = useState(0);
  const auth = getAuth();
  const [dataChoose, setDataChoose] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [dataInvitation, setDataInvitation] = useState([]);
  const [dataTableInvitation, setDataTableInvitation] = useState([]);

  const [dataAcp, setDataAcp] = useState([]);
  const [dataTableAcp, setDataTableAcp] = useState([]);

  const [dataRefuse, setDataRefuse] = useState([]);
  const [dataTableRefuse, setDataTableRefuse] = useState([]);

  const [medicalRedcordVisible, setMediacalRecordVisible] = useState(false);
  const [medicalRedcordData, setMediacalRecordData] = useState([]);

  const [rerender, setRerender] = useState(0);
  const [report, setReport] = useState("");

  function showConfirmDelete(dataPatient) {
    let obj = dataPatient.record;
    confirm({
      title: "Bạn sẽ từ chối yêu cầu đền từ bệnh nhân " + obj.name + " ?",
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const uid = userID;
        const id = obj.IDAppoment;
        const patientsID = obj.UserID;
        await setDoc(doc(db, "doctor", uid, "Appointment", id), {
          IDAppoment: obj.IDAppoment,
          UserID: obj.UserID,
          age: obj.age,
          description: obj.description,
          gender: obj.gender,
          name: obj.name,
          phone: obj.phoneNumber,
          time: obj.time,
          timeRefuse: Date(),
          status: 2,
          reason: "",
        });

        await setDoc(doc(db, "patients", patientsID, "Appointment", id), {
          IDAppoment: obj.IDAppoment,
          UserID: obj.UserID,
          age: obj.age,
          description: obj.description,
          gender: obj.gender,
          name: obj.name,
          phone: obj.phoneNumber,
          time: obj.time,
          timeRefuse: Date(),
          status: 2,
          avatarDoc: doctorData.avatar,
        });
      },
      onCancel() {},
      okText: "Chấp nhận",
      cancelText: "Không",
    });
  }

  function bookingSucess(dataPatient) {
    let obj = dataPatient.record;
    confirm({
      title:
        "Xác nhận tạo lịch với bệnh nhân " +
        obj.name +
        " vào lúc " +
        obj.timeNew,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const uid = userID;
        const id = obj.IDAppoment;

        const patientsID = obj.UserID;

        await setDoc(doc(db, "doctor", uid, "Appointment", id), {
          IDAppoment: obj.IDAppoment,
          UserID: obj.UserID,
          age: obj.age,
          description: obj.description,
          gender: obj.gender,
          name: obj.name,
          phone: obj.phoneNumber,
          time: obj.time,
          status: 1,
        });

        await setDoc(doc(db, "patients", patientsID, "Appointment", id), {
          IDAppoment: obj.IDAppoment,
          UserID: obj.UserID,
          age: obj.age,
          description: obj.description,
          gender: obj.gender,
          name: obj.name,
          phone: obj.phoneNumber,
          time: obj.time,
          timeRefuse: Date(),
          status: 1,
          avatarDoc: doctorData.avatar,
          nameDoctor: doctorData.fullName,
          clinicAddress: doctorData.clinic.clinicAddress,
          clinicName: doctorData.clinic.clinicName,
          IDDoctor: uid,
        });
      },
      onCancel() {},
      okText: "Chấp nhận",
      cancelText: "Không",
    });
  }

  function getData() {
    new Promise(async (resolve) => {
      await onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;

          setDataInvitation([]);
          setDataAcp([]);
          setDataRefuse([]);
          let getDocumentInvitation = [];
          let getDocumentAcp = [];
          let getDocumentRefuse = [];

          if (rerender === 0) {
            const getCollectInvitation = await query(
              collection(db, "doctor", uid, "Appointment"),
              where("status", "==", 0)
            );
            getDocumentInvitation = await getDocs(getCollectInvitation);

            const getCollectAcp = await query(
              collection(db, "doctor", uid, "Appointment"),
              where("status", "==", 1)
            );
            getDocumentAcp = await getDocs(getCollectAcp);
            const getCollectRefuse = await query(
              collection(db, "doctor", uid, "Appointment"),
              where("status", "==", 2)
            );
            getDocumentRefuse = await getDocs(getCollectRefuse);
          }

          getDocumentRefuse.forEach((doc) => {
            setDataRefuse((dataRefuse) => [...dataRefuse, doc.data()]);
          });
          getDocumentInvitation.forEach((doc) => {
            setDataInvitation((dataInvitation) => [
              ...dataInvitation,
              doc.data(),
            ]);
          });
          getDocumentAcp.forEach((doc) => {
            setDataAcp((dataAcp) => [...dataAcp, doc.data()]);
          });
          setRerender(1);
          prepareDataInvitation(dataInvitation);
          prepareDataAcp(dataAcp);
          prepareDataRefuse(dataRefuse);
          setAcpPercent(
            (dataAcp.length / (dataAcp.length + dataRefuse.length)) * 100
          );
          setRefusePercent(
            (dataRefuse.length / (dataAcp.length + dataRefuse.length)) * 100
          );
        }
      });
    });
  }

  const columnsInvitation = [
    {
      title: "Số thứ tự",
      dataIndex: "STT",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "description",
    },
    {
      title: "Thời gian",
      dataIndex: "timeNew",
    },

    {
      key: "acp",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              bookingSucess({ record });
            }}
          >
            Chấp nhận
          </Button>
        </Space>
      ),
    },
    {
      key: "Hủy",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showConfirmDelete({ record });
            }}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  const columnsAcp = [
    {
      title: "Số thứ tự",
      dataIndex: "STT",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "description",
    },
    {
      title: "Thời gian",
      dataIndex: "timeNew",
    },

    {
      key: "acp",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setMediacalRecordVisible(true);
              setMediacalRecordData(record);
            }}
          >
            Viết hồ sơ bệnh án
          </Button>
        </Space>
      ),
    },
    {
      key: "Hủy",
      render: (text, record) => (
        <Space size="middle" style={{ textAlign: "center" }}>
          <Button
            type="primary"
            onClick={() => {
              setDataChoose(record);
              setModalVisible(true);
            }}
            danger
          >
            Báo cáo
          </Button>
        </Space>
      ),
    },
  ];

  const columnsRefuse = [
    {
      title: "Số thứ tự",
      dataIndex: "STT",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "description",
    },
    {
      title: "Thời gian",
      dataIndex: "timeNew",
    },
    {
      key: "Hủy",
      render: (text, record) => (
        <Space size="middle">Đã hủy vào lúc {record.timeRefuse}</Space>
      ),
    },
  ];

  function prepareDataInvitation(data) {
    let timeNew;
    let date;
    let obj;
    let array = [];
    for (const loop in data) {
      date = new Date(data[loop].time * 1000);
      timeNew = formatDate(date) + " " + formatTime(date);
      obj = {
        key: loop,
        STT: Number(loop) + 1,
        UserID: data[loop].UserID,
        name: data[loop].name,
        gender: data[loop].gender,
        age: data[loop].age,
        phoneNumber: data[loop].phone,
        description: data[loop].description,
        IDAppoment: data[loop].IDAppoment,
        time: data[loop].time,
        timeNew: timeNew,
      };
      array.push(obj);
    }
    setDataTableInvitation(array);
  }

  function prepareDataAcp(data) {
    let timeNew;
    let date;
    let obj;
    let array = [];
    let timeCodeNew;
    for (const loop in data) {
      date = new Date(data[loop].time * 1000);
      timeNew = formatDate(date) + " " + formatTime(date);
      timeCodeNew = formatCode(date);
      obj = {
        key: loop,
        STT: Number(loop) + 1,
        UserID: data[loop].UserID,
        name: data[loop].name,
        gender: data[loop].gender,
        age: data[loop].age,
        phoneNumber: data[loop].phone,
        description: data[loop].description,
        IDAppoment: data[loop].IDAppoment,
        time: data[loop].time,
        timeCode: timeCodeNew,
        timeNew: timeNew,
      };
      array.push(obj);
    }
    setDataTableAcp(array);
  }

  function prepareDataRefuse(data) {
    let timeNew;
    let date;
    let obj;
    let array = [];
    let timeReFuseNew;
    let dateRefuse;
    for (const loop in data) {
      date = new Date(data[loop].time * 1000);
      dateRefuse = new Date(Date.parse(data[loop].timeRefuse) * 1000);
      timeNew = formatDate(date) + " " + formatTime(date);
      if (data[loop].reason === "")
        timeReFuseNew =
          formatDate(dateRefuse) + " vào lúc " + formatTime(dateRefuse);
      else
        timeReFuseNew =
          formatDate(dateRefuse) +
          " vào lúc " +
          formatTime(dateRefuse) +
          ", lý do: " +
          data[loop].reason;
      console.log(timeReFuseNew);
      obj = {
        key: loop,
        STT: Number(loop) + 1,
        UserID: data[loop].UserID,
        name: data[loop].name,
        gender: data[loop].gender,
        age: data[loop].age,
        phoneNumber: data[loop].phone,
        description: data[loop].description,
        IDAppoment: data[loop].IDAppoment,
        time: data[loop].time,
        timeRefuse: timeReFuseNew,
        timeNew: timeNew,
      };
      array.push(obj);
    }
    setDataTableRefuse(array);
  }

  function formatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return "Ngày: " + day + "/" + month + "/" + year;
  }

  function formatCode(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    return day + month + year + hours + minutes;
  }

  function formatTime(date) {
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return "Giờ: " + hours + ":" + minutes + ":" + seconds;
  }

  function invitationReport() {
    const uid = userID;
    const id = dataChoose.IDAppoment;
    setDoc(doc(db, "doctor", uid, "Appointment", id), {
      IDAppoment: dataChoose.IDAppoment,
      UserID: dataChoose.UserID,
      age: dataChoose.age,
      description: dataChoose.description,
      gender: dataChoose.gender,
      name: dataChoose.name,
      phone: dataChoose.phoneNumber,
      time: dataChoose.time,
      timeRefuse: Date(),
      reason: report,
      status: 2,
    });
  }
  const sendReport = (e) => {
    if (e.target.value === "another") {
      setReport(document.getElementById("reason").value);
    } else setReport(e.target.value);
  };
  useEffect(() => {
    getData();
  }, [rerender]);

  return (
    <>
      <MeidicalRecord
        setMediacalRecordVisible={setMediacalRecordVisible}
        medicalRedcordVisible={medicalRedcordVisible}
        medicalRedcordData={medicalRedcordData}
        userID={userID}
        doctorData={doctorData}
      />

      <Modal
        title="Báo cáo"
        style={{ top: 20 }}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={false}
      >
        <p>Bạn vui lòng cho chúng tôi có thể biết được lí do?</p>
        <Radio.Group onChange={sendReport} value={report}>
          <Radio value="Bệnh nhân đã thông báo lại với bác sĩ">
            Bệnh nhân đã thông báo lại với bác sĩ
          </Radio>
          <Radio value="Đã đến giờ khám, bệnh nhân chưa có mặt">
            Đã đến giờ khám, bệnh nhân chưa có mặt
          </Radio>
          <Radio value="Không phù hợp với bác sĩ">
            Không phù hợp với bác sĩ
          </Radio>
          <br />
          <Radio value="another">
            Khác
            <Input id="reason" placeholder="Lý do khác" />
          </Radio>
        </Radio.Group>
        {report ? (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                <div className="ant-form-item-control-input-content-for-login-button">
                  <Button
                    onClick={() => {
                      invitationReport();
                    }}
                  >
                    Gửi
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </Modal>
      <Tabs defaultActiveKey="1" type="card" size={"large"} centered>
        <TabPane tab="Đã đăng kí" key="1">
          <TableData
            columns={columnsInvitation}
            dataTableTest={dataTableInvitation}
          />
        </TabPane>
        <TabPane tab="Đã chấp nhận" key="2">
          <TableData columns={columnsAcp} dataTableTest={dataTableAcp} />
        </TabPane>
        <TabPane tab="Đã hủy" key="3">
          <TableData columns={columnsRefuse} dataTableTest={dataTableRefuse} />
        </TabPane>
      </Tabs>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Đã chấp nhận" bordered={false}>
              <Progress type="circle" percent={Math.round(acpPercent)} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Đã hủy" bordered={false}>
              <Progress
                type="circle"
                percent={Math.round(refusePercent)}
                status="exception"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Thống kê của bạn"
              bordered={false}
              style={{ textAlign: "left" }}
            >
              <br />
              Tổng số lượng chấp nhận: {Math.round(acpPercent)}%
              <br />
              Tổng số lượng lời từ chối: {Math.round(refusePercent)}%
            </Card>
          </Col>
        </Row>
      </div>
      <div></div>
    </>
  );
}
