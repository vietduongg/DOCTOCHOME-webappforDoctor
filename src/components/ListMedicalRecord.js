import React, { useEffect, useState } from "react";
import TableData from "./TableData";
import { Button, Space } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./../firebase";

const Listmedicalrecord = ({ setListMR }) => {
  const auth = getAuth();
  const [dataMedicalRecord, setDataMedicalRecord] = useState([]);
  const [dataTableMedicalRecord, setDataTableMedicalRecord] = useState([]);

  const columnsListMR = [
    {
      title: "Mã hồ sơ",
      dataIndex: "idMedicalRocord",
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
      title: "Thời gian khám bệnh",
      dataIndex: "examinationTime",
    },
    {
      title: "Chẩn đoạn bệnh",
      dataIndex: "conclusionIllness",
    },
    {
      title: "Chi tiết",
      dataIndex: "desc",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => {}}>
            In File
          </Button>
        </Space>
      ),
    },
  ];

  function getData() {
    new Promise(async (resolve) => {
      await onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;

          //Get Data Table Invitaion
          setDataMedicalRecord([]);
          const getCollectMediacalRecord = await query(
            collection(db, "doctor", uid, "Medical Record")
          );
          const getDocumentMediacalRecord = await getDocs(
            getCollectMediacalRecord
          );
          getDocumentMediacalRecord.forEach(async (doc) => {
            console.log(doc.data());
            await setDataMedicalRecord((dataMedicalRecord) => [
              ...dataMedicalRecord,
              doc.data(),
            ]);
          });

          prepareDataMedicalRecord(dataMedicalRecord);
        }
      });
    });
  }

  function prepareDataMedicalRecord(data) {
    console.log(dataMedicalRecord);
  }
  async function asyncCall() {
    await getData();
  }
  useEffect(() => {
    asyncCall();
  }, []);
  return (
    <TableData columns={columnsListMR} dataTableTest={dataMedicalRecord} />
  );
};

export default Listmedicalrecord;
