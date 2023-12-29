import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account, GenderEnum } from "@/types";
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
import usecheckRole from "@/hooks/usecheckRole";
type Props = {
  record: Account;
};
const regexNotSpaceFirst = /^(?:[^ ]|$)/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const phoneRegex = /^0\d{8,10}$/;
const formSchema = z.object({
  // code: z.string().regex(regexPattern),
  first_name: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
  last_name: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
  email: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space")
    .regex(emailRegex, "Email is in invaild format"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(regexNotSpaceFirst, "First character is not a space")
    .regex(phoneRegex, "Phone is in invalid Vietnamese format"),
  gender: z.nativeEnum(GenderEnum),

  position: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
});
const defaultValue: Omit<Account, "id"> = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  gender: "" as GenderEnum,
  position: "",
};
export type formSchemaType = z.infer<typeof formSchema>;
const AccountEdit: FC<Props> = ({ record }) => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: record,
  });
  const [deleteMuta] = useDeleteAccountMutation();
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
                  payLoad={{
                    id: record.id,
                    method: "PUT",
                  }}
                  form={form}
                  title="Edit account"
                  formMutation={useEditAccountMutation}
                  fields={[
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "gender",
                    "position",
                  ]}
                  Trigger={<Button type={"dashed"}>Edit</Button>}
                />
                <Popconfirm
                  title="Delete the account"
                  description="Are you sure to delete this account?"
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

export default AccountEdit;
