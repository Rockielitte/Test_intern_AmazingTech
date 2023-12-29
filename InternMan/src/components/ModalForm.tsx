import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Badge,
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  FloatButton,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tag,
  Typography,
  message,
  theme,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  FieldValues,
  UseFormReturn,
  Path,
  SubmitHandler,
  PathValue,
} from "react-hook-form";
const { RangePicker } = DatePicker;
import { AxiosError } from "axios";
import { SendOutlined } from "@ant-design/icons";
import { GenderEnum, PeriodStatusEnum, TaskStatusEnum } from "@/types";
import { FormItem } from "react-hook-form-antd";
import SelectSearch from "./SelectFetch";
import { RangePickerProps } from "antd/es/date-picker";
import { format } from "date-fns";
import MutiSelect from "./MultiSelect";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/skeleton/Paragraph";
export type PropsFormModal<X, T extends FieldValues> = {
  form: UseFormReturn<T>;
  formMutation: (obj?: any) => any;
  action?: string;
  Trigger?: React.ReactNode;
  title: string;
  fields: Path<T>[];
  invalidQuery?: string[];
  payLoad?: {
    id: number;
    method: string;
  };
};
const onChange: RangePickerProps["onChange"] = (date, dateString) => {
  console.log(date, dateString);
};
const dateFormat = "MM/DD/YYYY";
const ModalForm = <X, T extends FieldValues>({
  form,
  formMutation,
  action,
  title,
  fields,
  Trigger,
  invalidQuery,
  payLoad,
}: PropsFormModal<X, T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mutate] = formMutation();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const success = (mess?: string) => {
    messageApi.open({
      type: "success",
      content: mess || "This is a success message",
    });
  };

  const error = (mess?: string) => {
    messageApi.open({
      type: "error",
      content: mess || "This is an error message",
    });
  };
  const onSubmit: SubmitHandler<T> = async (data) => {
    try {
      if (payLoad && payLoad.method == "Tasks") {
        const id = payLoad.id || new Date().getTime();
        const newData = {
          ...data,
          id: id,
          assignments: [
            ...data.assignments.map((item: number, index: number) => ({
              id: !id ? id - index - 1 : new Date().getTime() - index - 1,
              accountId: item,
              taskId: id,
              // "status": TaskStatusEnum.Todo
            })),
          ],
        };
        console.log(newData);

        if (payLoad.id) {
          await mutate({
            id: payLoad.id,
            body: newData,
          }).unwrap();
          reset(data);
        } else {
          await mutate(newData).unwrap();
          reset();
        }
        success("Submited successfully");
        handleCancel();
        return;
      }
      if (payLoad && payLoad.method == "Period") {
        const newdata = {
          ...data,
          startedDate: format(
            new Date((data as any).period[0].$d),
            "MM/dd/yyyy"
          ),
          endDate: format(new Date((data as any).period[1].$d), "MM/dd/yyyy"),
        };
        delete newdata.period;
        if (payLoad.id) {
          await mutate({ id: payLoad.id, body: newdata }).unwrap();
          reset(data);
        } else {
          await mutate(newdata).unwrap();
          reset();
        }
        success("Submited successfully");
        handleCancel();
        return;
      } else if (payLoad && payLoad.method) {
        await mutate({ id: payLoad.id, body: data }).unwrap();
        reset(data);
      } else {
        await mutate(data).unwrap();
        reset();
      }
      success("Submited successfully");
      handleCancel();
    } catch (err) {
      error("Submited failed");
    }
  };
  const { control, handleSubmit, reset, setValue, getValues } = form;
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {contextHolder}
      <div
        onClick={() => {
          showModal();
        }}
      >
        {Trigger ? (
          Trigger
        ) : (
          <FloatButton tooltip={title} type="primary" icon={<PlusOutlined />} />
        )}
      </div>

      <Modal
        title={
          <Typography.Title
            type="secondary"
            level={4}
            style={{
              color: "#1677ff",
              textTransform: "uppercase",
              padding: 0,
              margin: 0,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {title}
          </Typography.Title>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ flex: 1 }}
          layout="horizontal"
          style={{
            marginTop: 20,
            maxHeight: "400px",
            overflowY: "auto",
            padding: "4px 0",
          }}
          onFinish={handleSubmit(onSubmit)}
        >
          {fields.map((item) => {
            const periodTime = getValues("period" as PathValue<T, Path<T>>);
            let label = String(item).includes("Id")
              ? String(item).substring(0, String(item).length - 2)
              : String(item);
            label = label.replace("_", " ");

            switch (item) {
              case "assignments":
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <MutiSelect
                      getValue={getValues}
                      item={item}
                      setValue={setValue}
                    ></MutiSelect>
                  </FormItem>
                );
              case "status":
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <Select placeholder={`Select ${label} here . . .`}>
                      {Object.values(
                        payLoad?.method == "Period"
                          ? PeriodStatusEnum
                          : TaskStatusEnum
                      ).map((item) => (
                        <Select.Option kry={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                );
              case "period": {
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <RangePicker format={dateFormat} />
                  </FormItem>
                );
              }
              case "accountId":
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <SelectSearch
                      setValue={setValue}
                      item={item}
                      getValue={getValues}
                    />
                  </FormItem>
                );

              case "gender":
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <Select placeholder={`Select ${label} here . . .`}>
                      {Object.values(GenderEnum).map((item) => (
                        <Select.Option kry={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                );
              case "description":
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <TextArea
                      rows={3}
                      placeholder={`Type ${label} here . . .`}
                    />
                  </FormItem>
                );
              default:
                return (
                  <FormItem
                    key={item}
                    control={control}
                    name={item}
                    label={
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </span>
                    }
                  >
                    <Input placeholder={`Type ${label} here . . .`} />
                  </FormItem>
                );
            }
          })}
          <Form.Item
            style={{
              textAlign: "right",
            }}
          >
            <Button
              htmlType="submit"
              type="primary"
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
              }}
              icon={<SendOutlined />}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalForm;
