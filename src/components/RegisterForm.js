import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Upload,
  Switch,
  Radio,
  Modal,
} from "antd";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  db,
} from "../firebase";
import { UploadOutlined } from "@ant-design/icons";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterForm() {
  const { TextArea } = Input;
  const metadata = {
    contentType: "image/jpeg",
  };

  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  //Dịch vụ
  const [service, setService] = React.useState(1);

  //ảnh cá nhân của bác sĩ
  const [linkImagePersonal, setLinkImagePersonal] = useState(null);

  //Ảnh phòng khám
  const [linkImageClinic, setLinkImageClinic] = useState(null);

  //Ảnh chứng nhận chuyên ngành
  const [linkImagePracticingCertificate, setLinkImagePracticingCertificate] =
    useState([]);

  //Ảnh chứng nhận của thực tập
  const [linkImageCertificateOfWork, setLinkImageCertificateOfWork] = useState(
    []
  );

  //Ảnh chứng nhận làm việc
  const [
    linkImageWokingCertificateOfHospital,
    setLinkImageWokingCertificateOfHospital,
  ] = useState([]);

  //Up ảnh cá nhân bác sĩ
  const urlImagePersonal = {
    async onChange(info) {
      const storageRef = ref(storage, "Doctor Avatar/" + info.file.name);
      const uploadTask = uploadBytesResumable(
        storageRef,
        info.file.originFileObj,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLinkImagePersonal(downloadURL);
          });
        }
      );
    },
  };

  //Up ảnh phòng khám
  const urlClinicImage = {
    async onChange(info) {
      const storageRef = ref(storage, "Clinic Image /" + info.file.name);
      const uploadTask = uploadBytesResumable(
        storageRef,
        info.file.originFileObj,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLinkImageClinic(downloadURL);
          });
        }
      );
    },
  };

  //Up ảnh chứng chỉ thực tập
  const urlPracticingCertificate = {
    async onChange(info) {
      const storageRef = ref(
        storage,
        "Practicing Certificate /" + info.file.name
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        info.file.originFileObj,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLinkImagePracticingCertificate([
              ...linkImagePracticingCertificate,
              downloadURL,
            ]);
          });
        }
      );
    },
  };

  //Up ảnh chứng chỉ làm việc
  const urlCertificateOfWork = {
    async onChange(info) {
      const storageRef = ref(storage, "Certificate Of Work /" + info.file.name);
      const uploadTask = uploadBytesResumable(
        storageRef,
        info.file.originFileObj,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLinkImageCertificateOfWork([
              ...linkImageCertificateOfWork,
              downloadURL,
            ]);
          });
        }
      );
    },
  };

  //Up ảnh chứng chỉ làm việc tại bệnh viện
  const urlWokingCertificateOfHospital = {
    async onChange(info) {
      const storageRef = ref(
        storage,
        "Woking Certificate Of Hospital /" + info.file.name
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        info.file.originFileObj,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLinkImageWokingCertificateOfHospital([
              ...linkImageCertificateOfWork,
              downloadURL,
            ]);
          });
        }
      );
    },
  };

  const onChangeService = (e) => {
    setService(e.target.value);
  };

  const onChange = (checked) => {
    setLoading(!checked);
  };
  const auth = getAuth();
  const onFinish = (values) => {
    createUserWithEmailAndPassword(auth, values.mail, values.password)
      .then(async (user) => {
        updateProfile(auth.user, {
          disabled: true,
        });
        const clinic = {
          clinicName: values.clinicName,
          clinicAddress: values.clinicAddress,
          clinicImage: linkImageClinic,
        };

        const certificate = {
          practicingCertificate: linkImagePracticingCertificate,
          nameOfHospital: values.nameOfPracticeHospital,
          addressOfPracticeHospital: values.addressOfPracticeHospital,
          practicingCertificateOfHospital: linkImageCertificateOfWork,
        };
        if (loading === true) {
          console.log("Không có làm việc");
          await setDoc(doc(db, "doctor", user.user.uid), {
            fullName: values.fullname,
            gender: values.gender,
            dob: values.dob._d,
            email: values.mail,
            avatar: linkImagePersonal,
            numberPhone: values.phonenumber,
            detail: values.detailPersonal,
            specialist: values.specialist,
            service: service,
            status: 1,
            clinic,
            certificate,
          });
        } else {
          console.log("có làm việc");
          const workingHospital = {
            nameOfHospital: values.nameOfHospital,
            addressOfHospital: values.addressOfHospital,
            wokingCertificateOfHospital: linkImageWokingCertificateOfHospital,
          };

          await setDoc(doc(db, "doctor", user.user.uid), {
            fullName: values.fullname,
            gender: values.gender,
            dob: values.dob._d,
            email: values.mail,
            avatar: linkImagePersonal,
            numberPhone: values.phonenumber,
            detail: values.detailPersonal,
            specialist: values.specialist,
            service: service,
            status: 0,
            clinic,
            certificate,
            workingHospital,
          });
        }
        setVisible(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  const agreeToContractForm = (values) => {
    setVisible(false);
  };

  const onFinishFailed = (errorInfo) => {};
  return (
    <Form
      name="basic"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ remember: true }}
      labelWrap
      // catch event submit
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Modal
        title="Điều khoản sử dụng Doctor Home"
        centered
        visible={visible}
        okText="Đồng ý thỏa thuận"
        cancelText="Tôi đang xem xét"
        onOk={agreeToContractForm}
        onCancel={() => setVisible(false)}
        width={1500}
      >
        Thông tin của bạn đã được gửi về trang chủ. Vui lòng chờ xác nhận của
        chúng tôi tôi
      </Modal>
      <Card title="Đơn đăng kí tham gia hệ thống DOCTOR HOME dành cho bác sĩ">
        <Card type="inner" title="1. Thông tin cá nhân">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền họ và tên đầy đủ",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select>
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Năm sinh"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày, tháng, năm sinh",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Điện thoại"
                name="phonenumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Email"
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
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng điền mật khẩu" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Chuyên khoa"
                name="specialist"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chuyên khoa của bạn",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="ENT">Tai mũi họng</Select.Option>
                  <Select.Option value="Dermatologist">Da liễu</Select.Option>
                  <Select.Option value="Heart">Tym</Select.Option>
                  <Select.Option value="Paeditrician">Nhi khoa</Select.Option>
                  <Select.Option value="Neurologist">Thần kinh</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ảnh đại diện"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email liên hệ",
                  },
                ]}
              >
                <Upload {...urlImagePersonal}>
                  <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Chi tiết về bạn"
                name="detailPersonal"
                rules={[
                  {
                    required: true,
                    message:
                      "Vui lòng nhập để có thể nhiều người biết để tin tưởng về bạn ",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Tối da 216 kí tự"
                  maxLength={216}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="2. Thông tin phòng khám"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Tên phòng khám"
                name="clinicName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên phòng khám của bạn",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Địa chỉ phòng khám"
                name="clinicAddress"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền địa chỉ",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ảnh phòng khám"
                name="clinicImage"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng đăng tải ảnh của bạn",
                  },
                ]}
              >
                <Upload {...urlClinicImage}>
                  <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="3. Thông tin về điều kiện cấp chứng chỉ hành nghề"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Chứng chỉ hành nghề"
                name="PracticingCertificate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng đăng tải file",
                  },
                ]}
              >
                <Upload {...urlPracticingCertificate}>
                  <Button icon={<UploadOutlined />}>
                    Thêm file PDF, hình ảnh
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Bệnh viện thực hành"
                name="nameOfPracticeHospital"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Địa chỉ"
                name="addressOfPracticeHospital"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền địa chỉ",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Chứng chỉ thực hành"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng đăng tải file",
                  },
                ]}
              >
                <Upload {...urlCertificateOfWork}>
                  <Button icon={<UploadOutlined />}>
                    Thêm file PDF, hình ảnh
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="4. Cơ sở làm việc khác ( Nếu không, vui lòng bỏ qua, nếu có chọn nút toggle cạnh)"
          extra={<Switch checked={!loading} onChange={onChange} />}
        >
          <Col span={5}>
            <Card style={{ width: 1200, marginTop: 16 }} loading={loading}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Bệnh viện làm việc" name="nameOfHospital">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Địa chỉ" name="addressOfHospital">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Chứng chỉ làm việc">
                    <Upload {...urlWokingCertificateOfHospital}>
                      <Button icon={<UploadOutlined />}>
                        Thêm file PDF, hình ảnh
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="5. Gói dịch vụ sử dụng"
        >
          <Row>
            <Col span={20}>
              <Radio.Group onChange={onChangeService} value={service}>
                <Radio value={1}>
                  <b>Gói miễn phí</b>

                  <i>
                    - Mỗi tháng, chúng tôi sẽ thu 3% giá trị hóa đơn trên mỗi
                    lần booking thành công giữa bệnh nhân và phòng khám của bạn
                  </i>
                </Radio>
                <br />
                <Radio value={2}>
                  <b>Gói cơ bản</b>

                  <i>
                    - Mỗi tháng, bạn chỉ cần bỏ ra 300.000 VNĐ để có thể sử dụng
                    dịch vụ của chúng tôi. Ngoài 300.000 VNĐ, không phụ thu thêm
                    bất kì số tiền nào.
                  </i>
                </Radio>
                <Radio value={3}>
                  <b>Gói cao cấp </b>

                  <i>
                    -- Mỗi tháng, bạn chỉ cần bỏ ra 500.000 VNĐ để có thể sử
                    dụng dịch vụ cao cấp của chúng tôi ( bao gồm:
                    <b>
                      Thêm phần trăm điểm số đánh giá để có thể xuất hiện nhiều
                      lần trên hệ thống của chúng tôi, được hỗ trợ tư vấn để
                      xuất hiện trên quãng cáo của chúng tôi
                    </b>
                    ). Ngoài 500.000 VNĐ, không phụ thu thêm bất kì số tiền nào.
                  </i>
                </Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Card>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Đăng kí
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
}
