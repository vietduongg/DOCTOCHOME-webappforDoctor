import React, { useState, useEffect } from "react";
import { Modal, Button, Space } from "antd";
import TimeRelatedForm from "./TimeRelatedForm";
import TableData from "./TableData";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./../firebase";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { doc, setDoc } from "firebase/firestore";

export default function Dashboard(userID) {
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const auth = getAuth();
  const [data, setData] = useState([]);
  const [allTimes, setAllTimes] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataTableTest, setDataTable] = useState([]);
  const [reRender, setReRender] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function showConfirmDelete(secret_number, timeStart, timeEnd) {
    console.log(secret_number);
    confirm({
      title: "Bạn có muốn xóa khung giờ này ?",
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const uid = userID.userID;
        await setDoc(doc(db, "doctor", uid, "TimeAvailable", secret_number), {
          dateStart: timeStart,
          dateEnd: timeEnd,
          status: 2,
          id: secret_number,
        });
        window.location.reload(false);
      },
      onCancel() {},
      okText: "Chấp nhận",
      cancelText: "Không",
    });
  }

  function getData() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setData([]);
        const uid = user.uid;
        const getCollect = await query(
          collection(db, "doctor", uid, "TimeAvailable"),
          where("status", "!=", 2)
        );
        const getDocument = await getDocs(getCollect);
        getDocument.forEach((doc) => {
          setData((data) => [...data, doc.data()]);
        });

        setAllTimes([]);
        const getAllTimeCollect = await query(
          collection(db, "doctor", uid, "TimeAvailable")
        );
        const getAllTimeDocument = await getDocs(getAllTimeCollect);
        getAllTimeDocument.forEach((doc) => {
          setAllTimes((allTimes) => [...allTimes, doc.data()]);
        });
        console.log(allTimes);

        setReRender(1);
        if (data.length !== 0) {
          prepareData(data);
        }
      } else {
      }
    });
  }

  function prepareData(bobo) {
    const data = bobo.sort((a, b) => b.dateStart - a.dateStart);
    console.log(data);
    const columns = [
      {
        title: "Số thứ tự",
        dataIndex: "STT",
      },
      {
        title: "Ngày",
        dataIndex: "Date",
      },
      {
        title: "Giờ bắt đầu",
        dataIndex: "TimeStart",
      },
      {
        title: "Giờ kết thúc",
        dataIndex: "TimeEnd",
      },
      {
        title: "Tình trạng",
        dataIndex: "Status",
      },
      {
        title: "Hủy",
        key: "Hủy",
        render: (text, record) => (
          <Space size="middle">
            <Button
              onClick={() => {
                if (
                  record.Status === "Chưa nhận được lượt đăng kí" ||
                  record.Status === "Đã nhận được lượt đăng kí"
                )
                  showConfirmDelete(
                    record.id,
                    record.DateStart,
                    record.DateEnd
                  );
              }}
            >
              Hủy
            </Button>
          </Space>
        ),
      },
    ];
    let obj;
    let array = [];
    let a;
    for (const loop in data) {
      if (data[loop].status === "1") {
        a = "Đã nhận được lượt đăng kí";
      } else {
        a = "Chưa nhận được lượt đăng kí";
      }
      obj = {
        key: loop,
        STT: Number(loop) + 1,
        Date:
          data[loop].dateStart.toDate().getDate() +
          "/" +
          data[loop].dateStart.toDate().getMonth(),
        DateStart: data[loop].dateStart,
        DateEnd: data[loop].dateEnd,
        TimeStart:
          data[loop].dateStart.toDate().getHours() +
          " giờ " +
          data[loop].dateStart.toDate().getMinutes() +
          " phút ",
        TimeEnd:
          data[loop].dateEnd.toDate().getHours() +
          " giờ " +
          data[loop].dateEnd.toDate().getMinutes() +
          " phút ",
        Status: a,
        id: data[loop].id,
      };
      array.push(obj);
    }
    setDataTable(array);

    setColumns(columns);
  }

  useEffect(() => {
    getData();
  }, [reRender]);

  return (
    <div>
      <Modal
        title="Cung cấp thời gian "
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        <TimeRelatedForm userID={userID} length={allTimes.length} />
      </Modal>
      <div
        className="site-layout-background"
        style={{ padding: 20, textAlign: "center", fontSize: 40 }}
      >
        <b size={50}>Thời gian biểu</b>
      </div>
      <div
        className="site-layout-background"
        style={{ paddingBottom: 10, textAlign: "center" }}
      >
        <Button type="primary" onClick={showModal}>
          Cung cấp thời gian để chữa bệnh
        </Button>
      </div>
      <TableData columns={columns} dataTableTest={dataTableTest} />
    </div>
  );
}
