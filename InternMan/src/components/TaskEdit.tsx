import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Account,
  GenderEnum,
  Period,
  PeriodStatusEnum,
  Task,
  TaskStatusEnum,
} from "@/types";
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
  record: Task;
};
const regexNotSpaceFirst = /^(?:[^ ]|$)/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const phoneRegex = /^0\d{8,10}$/;
import dayjs from "dayjs";
import {
  useDeletePeriodMutation,
  useEditPeriodMutation,
} from "@/services/periodApi";
import { useDeleteTaskMutation, useEditTaskMutation } from "@/services/taskApi";
import usecheckRole from "@/hooks/usecheckRole";
const formSchema = z.object({
  // code: z.string().regex(regexPattern),
  title: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
  status: z.nativeEnum(TaskStatusEnum),
  description: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
  assignments: z.coerce.number().array(),
});
export type formSchemaType = z.infer<typeof formSchema>;
const TaskEdit: FC<Props> = ({ record }) => {
  const defaultValue = {
    title: record.title,
    status: record.status,
    description: record.description,
    assignments: [...record.assignments.map((item) => item.accountId)],
  };

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const [deleteMuta] = useDeleteTaskMutation();
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

      {(role as string) == "admin" ? (
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
                  title="Edit task"
                  formMutation={useEditTaskMutation}
                  fields={["title", "description", "assignments", "status"]}
                  Trigger={<Button type={"dashed"}>Edit</Button>}
                  payLoad={{
                    id: record.id,
                    method: "Tasks",
                  }}
                />
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task ?"
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

export default TaskEdit;
