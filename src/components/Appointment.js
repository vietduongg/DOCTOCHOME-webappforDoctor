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
  Form,
  Input,
  Select,
} from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./../firebase";
import TableData from "./TableData";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { doc, setDoc } from "firebase/firestore";

export default function Appointment(userID) {
  const { Option } = Select;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
    marginTop: 50,
  };
  const { confirm } = Modal;
  const { TabPane } = Tabs;
  const { TextArea } = Input;
  const auth = getAuth();

  const [dataInvitation, setDataInvitation] = useState([]);
  const [dataTableInvitation, setDataTableInvitation] = useState([]);

  const [dataAcp, setDataAcp] = useState([]);
  const [dataTableAcp, setDataTableAcp] = useState([]);

  const [dataRefuse, setDataRefuse] = useState([]);
  const [dataTableRefuse, setDataTableRefuse] = useState([]);

  const [rerender, setRerender] = useState(0);
  const [mediacalRecordVisible, setMediacalRecordVisible] = useState(false);

  function showConfirmDelete(dataPatient) {
    let obj = dataPatient.record;

    confirm({
      title: "Bạn sẽ từ chối yêu cầu đền từ bệnh nhân " + obj.name + " ?",
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const uid = userID.userID;
        const id = obj.IDAppoment;
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
        const uid = userID.userID;
        const id = obj.IDAppoment;
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

          //Get Data Table Invitaion
          setDataInvitation([]);
          const getCollectInvitation = await query(
            collection(db, "doctor", uid, "Appointment"),
            where("status", "==", 0)
          );
          const getDocumentInvitation = await getDocs(getCollectInvitation);
          getDocumentInvitation.forEach((doc) => {
            setDataInvitation((dataInvitation) => [
              ...dataInvitation,
              doc.data(),
            ]);
          });

          //Get Data Table Acp
          setDataAcp([]);
          const getCollectAcp = await query(
            collection(db, "doctor", uid, "Appointment"),
            where("status", "==", 1)
          );
          const getDocumentAcp = await getDocs(getCollectAcp);
          getDocumentAcp.forEach((doc) => {
            setDataAcp((dataAcp) => [...dataAcp, doc.data()]);
          });

          //Get Data Table Refuse
          setDataRefuse([]);
          const getCollectRefuse = await query(
            collection(db, "doctor", uid, "Appointment"),
            where("status", "==", 2)
          );
          const getDocumentRefuse = await getDocs(getCollectRefuse);
          getDocumentRefuse.forEach((doc) => {
            setDataRefuse((dataRefuse) => [...dataRefuse, doc.data()]);
          });

          setRerender(1);
          prepareDataInvitation(dataInvitation);
          prepareDataAcp(dataAcp);
          prepareDataRefuse(dataRefuse);
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
            }}
          >
            Viết hồ sơ bệnh án{" "}
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
              showConfirmDelete({ record });
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
    setDataTableAcp(array);
  }

  function prepareDataRefuse(data) {
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
        timeRefuse: data[loop].timeRefuse.getHours(),
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
    return "Ngày: " + month + "/" + day + "/" + year;
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

  const onGenderChange = (value: string) => {
    switch (value) {
      case "male":
        // this.formRef.current!.setFieldsValue({ note: 'Hi, man!' });
        return;
      case "female":
        // this.formRef.current!.setFieldsValue({ note: 'Hi, lady!' });
        return;
      case "other":
        return;
      default:
      // this.formRef.current!.setFieldsValue({ note: 'Hi there!' });
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    // this.formRef.current!.resetFields();
  };

  const onFill = () => {
    // this.formRef.current!.setFieldsValue({
    //   note: 'Hello world!',
    //   gender: 'male',
    // });
  };

  useEffect(() => {
    getData();
  }, [rerender]);

  return (
    <>
      <Modal
        title="Hồ sơ bệnh án"
        style={{ top: 20 }}
        visible={mediacalRecordVisible}
        onOk={() => setMediacalRecordVisible(false)}
        onCancel={() => setMediacalRecordVisible(false)}
      >
        <Form {...layout} name="control-ref" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên bệnh nhân"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn các giới"
              onChange={onGenderChange}
              allowClear
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>
            <br />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tình trạng bệnh nhân"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <table id="customers">
            <tr>
              <th>Tên thuốc</th>
              <th>Số lượng</th>
              <th>Chi tiết</th>
            </tr>
            <tr>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
            </tr>
            <tr>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
            </tr>
            <tr>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
            </tr>
            <tr>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
            </tr>
            <tr>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
            </tr>
          </table>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gender !== currentValues.gender
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("gender") === "other" ? (
                <Form.Item
                  name="customizeGender"
                  label="Customize Gender"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Cập nhật hồ sơ bệnh án
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Tabs defaultActiveKey="1" type="card" size={"large"} centered>
        <TabPane tab="Lời mời" key="1">
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
              <Progress type="circle" percent={75} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Đã hủy" bordered={false}>
              <Progress type="circle" percent={70} status="exception" />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Thống kê trong tháng"
              bordered={false}
              style={{ textAlign: "left" }}
            >
              {() => {
                return "Tổng số lượng lời mời trong tháng: ";
              }}
              <br />
              Tổng số lượng chấp nhận:
              <br />
              Tổng số lượng lời từ chối:
            </Card>
          </Col>
        </Row>
      </div>
      <div></div>
    </>
  );
}
