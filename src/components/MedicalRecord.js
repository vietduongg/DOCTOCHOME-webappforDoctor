import React from "react";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  InputNumber,
  Checkbox,
} from "antd";
import moment from "moment";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function MedicalRecord({
  setMediacalRecordVisible,
  medicalRedcordVisible,
  medicalRedcordData,
  userID,
  doctorData,
}) {
  const [ReexaminationDate, setReexaminationDate] = React.useState(true);

  const handleClick = () => {
    setReexaminationDate(!ReexaminationDate);
  };

  const onClose = () => {
    setMediacalRecordVisible(false);
  };

  const onFinish = async (values: any) => {
    const now = new Date();

    let a;
    let thuoc = [];
    var drugName = document.getElementsByName("drugName[]");
    var numberOfDrugs = document.getElementsByName("numberOfDrugs[]");
    var drugDetails = document.getElementsByName("drugDetails[]");
    for (var i = 0; i < drugName.length; i++) {
      if (drugName[i].value !== "") {
        a = {
          drugName: drugName[i].value,
          numberOfDrugs: numberOfDrugs[i].value,
          drugDetails: drugDetails[i].value,
        };
        thuoc.push(a);
      }
    }
    const uid = userID;
    const uidd = medicalRedcordData.timeCode;
    const idUser = medicalRedcordData.UserID;
    const idAppo = medicalRedcordData.IDAppoment;
    console.log(medicalRedcordData);
    if (ReexaminationDate) {
      setDoc(doc(db, "doctor", uid, "Appointment", idAppo), {
        IDAppoment: medicalRedcordData.IDAppoment,
        description: medicalRedcordData.description,
        UserID: uidd,
        gender: medicalRedcordData.gender,
        age: medicalRedcordData.age,
        name: medicalRedcordData.name,
        phone: medicalRedcordData.phoneNumber,
        time: medicalRedcordData.time,
        status: 3,
      });

      setDoc(doc(db, `doctor/${uid}/Medical Record`, `${uidd}`), {
        idAppoment: medicalRedcordData.IDAppoment,
        idMedicalRocord: uidd,
        id: medicalRedcordData.UserID,
        age: medicalRedcordData.age,
        gender: medicalRedcordData.gender,
        name: medicalRedcordData.name,
        phoneNumber: medicalRedcordData.phoneNumber,
        timeWrite: now,
        examinationTime: medicalRedcordData.timeNew,
        reExaminationDate: values.reexaminationDate,
        sickness: values.description,
        conclusionIllness: values.conclusionIllness,
        totalBill: values.totalMoney,
        drug: thuoc,
      });

      setDoc(doc(db, `patients/${idUser}/Medical Record`, `${uidd}`), {
        idAppoment: medicalRedcordData.IDAppoment,
        idMedicalRocord: uidd,
        id: medicalRedcordData.UserID,
        age: medicalRedcordData.age,
        gender: medicalRedcordData.gender,
        name: medicalRedcordData.name,
        phoneNumber: medicalRedcordData.phoneNumber,
        timeWrite: now,
        examinationTime: medicalRedcordData.timeNew,
        reExaminationDate: values.reexaminationDate,
        sickness: values.description,
        conclusionIllness: values.conclusionIllness,
        totalBill: values.totalMoney,
        drug: thuoc,
        doctorName: doctorData.fullName,
        doctorEmail: doctorData.email,
      });
    } else {
      setDoc(doc(db, `doctor/${uid}/Medical Record`, `${uidd}`), {
        idAppoment: medicalRedcordData.IDAppoment,
        idMedicalRocord: uidd,
        id: medicalRedcordData.UserID,
        age: medicalRedcordData.age,
        gender: medicalRedcordData.gender,
        name: medicalRedcordData.name,
        phoneNumber: medicalRedcordData.phoneNumber,
        timeWrite: now,
        examinationTime: medicalRedcordData.timeNew,
        sickness: values.description,
        conclusionIllness: values.conclusionIllness,
        totalBill: values.totalMoney,
        drug: thuoc,
      });
      setDoc(doc(db, `patients/${idUser}/Medical Record`, `${uidd}`), {
        idAppoment: medicalRedcordData.IDAppoment,
        idMedicalRocord: uidd,
        id: medicalRedcordData.UserID,
        age: medicalRedcordData.age,
        gender: medicalRedcordData.gender,
        name: medicalRedcordData.name,
        phoneNumber: medicalRedcordData.phoneNumber,
        timeWrite: now,
        examinationTime: medicalRedcordData.timeNew,
        sickness: values.description,
        conclusionIllness: values.conclusionIllness,
        totalBill: values.totalMoney,
        drug: thuoc,
        doctorName: doctorData.fullName,
        doctorEmail: doctorData.email,
      });
      setDoc(doc(db, "doctor", uid, "Appointment", idAppo), {
        IDAppoment: medicalRedcordData.IDAppoment,
        description: medicalRedcordData.description,
        UserID: uidd,
        gender: medicalRedcordData.gender,
        age: medicalRedcordData.age,
        name: medicalRedcordData.name,
        phone: medicalRedcordData.phoneNumber,
        time: medicalRedcordData.time,
        status: 3,
      });
    }
    onClose();
  };

  const onFinishFailed = (errorInfo) => {};

  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  return (
    <>
      <Drawer
        title="Hồ sơ bệnh án"
        width={720}
        onClose={onClose}
        visible={medicalRedcordVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // hideRequiredMark
        >
          <Row gutter={16}>
            <Col span={12}>
              <span>
                <b>Họ và tên: </b>
              </span>
              <span>{medicalRedcordData.name}</span>
            </Col>
            <Col span={12}>
              <span>
                <b>Giới tính: </b>
              </span>
              <span>{medicalRedcordData.gender}</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <span>
                <b>Tuổi: </b>
              </span>
              <span>{medicalRedcordData.age}</span>
            </Col>
            <Col span={12}>
              <span>
                <b>Số điện thoại: </b>
              </span>
              <span>{medicalRedcordData.phoneNumber}</span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <span>
                <b>Thời gian khám: </b>
              </span>
              <span>{medicalRedcordData.timeNew}</span>
            </Col>
          </Row>
          <hr />
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Tình trạng bệnh"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng ghi rõ tình trạng bệnh",
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <div
            className="site-layout-background"
            style={{ padding: 20, textAlign: "center", fontSize: 25 }}
          >
            <b> </b>
          </div>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="conclusionIllness"
                label="Kết luận bệnh"
                rules={[
                  { required: true, message: "Vui lòng ghi rõ kết luận bệnh" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <div
            className="site-layout-background"
            style={{ padding: 20, textAlign: "center", fontSize: 25 }}
          >
            <b> </b>
          </div>

          <Checkbox onClick={handleClick}>Đề xuất ngày tái khám</Checkbox>
          {!ReexaminationDate ? (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="reexaminationDate"
                  label="Chọn thời gian tái khám lại"
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Chọn ngày"
                    disabledDate={disabledDate}
                    showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <></>
          )}

          <hr />
          <div
            className="site-layout-background"
            style={{ padding: 20, textAlign: "center", fontSize: 25 }}
          >
            <b>Đơn thuốc</b>
          </div>
          <table id="customers">
            <tr>
              <th>Tên thuốc</th>
              <th>Số lượng</th>
              <th>Chú thích</th>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item>
                  <Input name="drugName[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="numberOfDrugs[]" />
                </Form.Item>
              </td>
              <td>
                <Form.Item>
                  <Input name="drugDetails[]" />
                </Form.Item>
              </td>
            </tr>
          </table>
          <hr />
          <Form.Item
            label="Tổng hóa đơn"
            name="totalMoney"
            rules={[{ required: true, message: "Vui lòng ghi rõ số tiền" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <div
              className="site-layout-background"
              style={{ padding: 20, textAlign: "center", fontSize: 25 }}
            >
              <Button type="primary" htmlType="submit">
                Lưu và gửi hồ sơ bệnh án
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
