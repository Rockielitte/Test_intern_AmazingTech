import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account, GenderEnum, Period, PeriodStatusEnum } from "@/types";
import {
  useDeleteAccountMutation,
  useEditAccountMutation,
} from "@/services/accountApi";
import { Button, Dropdown, Popconfirm, Space, Tooltip, message } from "antd";
import {
  ControlOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import EditWrapper from "./EditWrapper";
type Props = {
  record: Period;
};
const regexNotSpaceFirst = /^(?:[^ ]|$)/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const phoneRegex = /^0\d{8,10}$/;
import dayjs from "dayjs";
import {
  useDeletePeriodMutation,
  useEditPeriodMutation,
} from "@/services/periodApi";
import usecheckRole from "@/hooks/usecheckRole";
const formSchema = z.object({
  // code: z.string().regex(regexPattern),
  accountId: z.coerce.number().min(1, "Required"),
  period: z.any().array().length(2, "Required"),
  status: z.nativeEnum(PeriodStatusEnum),
});
const dateFormat = "MM/DD/YYYY";
export type formSchemaType = z.infer<typeof formSchema>;
const PeriodEdit: FC<Props> = ({ record }) => {
  const defaultValue = {
    accountId: record.accountId,
    period: [
      dayjs(record.startedDate, dateFormat),
      dayjs(record.endDate, dateFormat),
    ],
    status: PeriodStatusEnum.In_progress,
  };

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });

  const [deleteMuta] = useDeletePeriodMutation();
  const [messageApi, contextHolder] = message.useMessage();
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
  const { role } = usecheckRole();
  return (
    <>
      {contextHolder}
      {contextHolder}
      {role == "admin" ? (
        <Dropdown
          dropdownRender={(menu) => (
            <div
              style={{
                backgroundColor: "#fff",
                boxShadow: "2px",
              }}
            >
              <Space direction="vertical">
                <EditWrapper
                  form={form}
                  title="Edit training period"
                  formMutation={useEditPeriodMutation}
                  fields={["accountId", "period", "status"]}
                  Trigger={<Button type={"dashed"}>Edit</Button>}
                  payLoad={{
                    id: record.id,
                    method: "Period",
                  }}
                />
                <Popconfirm
                  title="Delete the training period"
                  description="Are you sure to delete this training period ?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={async () => {
                    try {
                      await deleteMuta({ id: record.id }).unwrap();
                      success("Deleted successfully");
                    } catch (err) {
                      error("Deleted failed");
                    }
                  }}
                >
                  <Button type={"primary"} danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          )}
        >
          <Space>
            <Button shape="circle" type="dashed">
              <ControlOutlined></ControlOutlined>
            </Button>
          </Space>
        </Dropdown>
      ) : (
        <Tooltip title="Admin only" color="cyan">
          <QuestionOutlined />
        </Tooltip>
      )}
    </>
  );
};

export default PeriodEdit;
