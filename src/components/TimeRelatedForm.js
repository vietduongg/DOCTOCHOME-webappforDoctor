import React, { useState, useEffect } from "react";
import { Form, DatePicker, Button, Tabs, message } from "antd";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const rangeConfig = {
  rules: [
    {
      type: "array",
      required: true,
      message: "Vui lòng chọn thời gian",
    },
  ],
};

const TimeRelatedForm = (userID) => {
  const [date, setDate] = useState([]);
  const { TabPane } = Tabs;
  const [check, setCheck] = useState(0);
  const onFinish = (fieldsValue: any) => {
    const rangeTimeValue = fieldsValue["rangeTimePicker"];
    const values = {
      ...fieldsValue,
      time: [
        rangeTimeValue[0].format("YYYY-MM-DD"),
        rangeTimeValue[0].format("HH:mm:ss"),
        rangeTimeValue[1].format("HH:mm:ss"),
      ],
    };
    console.log("Received values of form: ", values);
    setDate(values.rangeTimePicker[0]._d);
    setCheck(1);

    console.log(String(userID.length));
    const uid = userID.userID.userID;
    const uidd = String(userID.length);
    setDoc(doc(db, `doctor/${uid}/TimeAvailable`, `${uidd}`), {
      dateStart: values.rangeTimePicker[0]._d,
      dateEnd: values.rangeTimePicker[1]._d,
      status: "0",
      id: uidd,
    });
    openMessage();
  };
  const [dates, setDates] = useState([]);

  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState();
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 0;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 0;
    return tooEarly || tooLate;
  };
  const key = "updatable";
  const openMessage = () => {
    message.loading({ content: "Đang đồng bộ dự liệu", key });
    setTimeout(() => {
      message.success({
        content: "Đồng bộ dự liệu thành công",
        key,
        duration: 2,
      });
    }, 3000);
  };

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };

  useEffect(() => {}, [date, check]);
  return (
    <Tabs tabPosition={"left"}>
      <TabPane tab="Cập nhật theo ngày" key="1">
        <Form
          name="time_related_controls"
          {...formItemLayout}
          onFinish={onFinish}
        >
          <Form.Item
            name="rangeTimePicker"
            label="Chọn ngày và thời gian"
            {...rangeConfig}
          >
            <RangePicker
              placeholder={[
                "Chọn thời gian bắt đàu",
                "Chọn thời gian kết thúc",
              ]}
              value={hackValue || value}
              disabledDate={disabledDate}
              onCalendarChange={(val) => setDates(val)}
              onChange={(val) => setValue(val)}
              onOpenChange={onOpenChange}
              format="YYYY/MM/DD HH:mm:ss"
              showTime
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: 16,
                  offset: 8,
                },
              }}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            }}
          >
            <Button type="primary" htmlType="submit">
              Đăng kí thời gian
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Cập nhật theo tuần" key="2">
        Content of Tab 2
      </TabPane>
    </Tabs>
  );
};

export default TimeRelatedForm;
