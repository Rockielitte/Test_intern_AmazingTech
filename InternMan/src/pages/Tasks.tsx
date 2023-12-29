import {
  useAddAccountMutation,
  useEditAccountMutation,
  useGetAccountsQuery,
} from "@/services/accountApi";
import { format } from "date-fns";
import {
  Account,
  GenderEnum,
  Period,
  PeriodStatusEnum,
  Task,
  TaskStatusEnum,
} from "@/types";
import {
  Badge,
  Button,
  Dropdown,
  FloatButton,
  Form,
  Input,
  MenuProps,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import {
  WomanOutlined,
  ManOutlined,
  ControlOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ModalCustom from "@/components/ModalForm";
import useToken from "antd/es/theme/useToken";
import Search from "antd/es/input/Search";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddTaskMutation, useGetTasksQuery } from "@/services/taskApi";
import EditWrapper from "@/components/EditWrapper";
import AccountEdit from "@/components/AccountEdit";
import { useAddPeriodMutation, useGetPeriodsQuery } from "@/services/periodApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import PeriodEdit from "@/components/PeriodEdit";
import { useEffect, useMemo, useState } from "react";
import AccountsTag from "@/components/AccountsTag";
import TaskEdit from "@/components/TaskEdit";
import usecheckRole from "@/hooks/usecheckRole";
const { RangePicker } = DatePicker;
type Props = {};
const regexNotSpaceFirst = /^(?:[^ ]|$)/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const phoneRegex = /^0\d{8,10}$/;
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

const defaultValue = {
  title: "",
  status: TaskStatusEnum.Todo,
  description: "",
  assignments: [],
};

export type formSchemaType = z.infer<typeof formSchema>;

const columns: ColumnsType<Task> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (value) => {
      return <Typography.Text strong>{value}</Typography.Text>;
    },
  },

  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (value) => {
      return <Typography.Paragraph>{value}</Typography.Paragraph>;
    },
  },
  {
    title: "Assignments",
    dataIndex: "assignments",
    key: "assignments",
    render: (value) => {
      return <AccountsTag assignments={value} />;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      return value == TaskStatusEnum.Closed ? (
        <Tag
          color="pink-inverse"
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      ) : value == TaskStatusEnum.In_progress ? (
        <Tag
          color={"blue-inverse"}
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      ) : (
        <Tag
          color={"lime-inverse"}
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      );
    },
  },
  {
    title: "Action",

    key: "action",
    render: (_, record) => (
      <TaskEdit key={record.id} record={record}></TaskEdit>
    ),
  },
];
const TrainingPeriod = (props: Props) => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const { data, error, isLoading } = useGetTasksQuery();

  const token = theme.useToken();
  const [dataSource, setDataSource] = useState(data);
  useEffect(() => {
    setDataSource(data);
  }, [data]);
  const [value, setValue] = useState("");
  const { role } = usecheckRole();
  return (
    <div
      style={{
        height: "100%",
        padding: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {role == "admin" && (
        <ModalCustom
          form={form}
          title="Create task"
          formMutation={useAddTaskMutation}
          fields={["title", "description", "assignments"]}
          payLoad={{
            id: 0,
            method: "Tasks",
          }}
        ></ModalCustom>
      )}
      <div
        style={{
          maxWidth: "50%",
        }}
      >
        <Input
          placeholder="Search title"
          value={value}
          onChange={(e) => {
            const currValue = e.target.value;
            setValue(currValue);
            const filteredData = data?.filter((entry) =>
              entry.title.includes(currValue)
            );
            console.log(filteredData);

            setDataSource(filteredData);
          }}
          // style={{
          //   maxWidth: "50%",
          // }}
          prefix={<SearchOutlined />}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          loading={isLoading}
          style={{
            boxShadow: token.token.boxShadowTertiary,
          }}
        />
      </div>
    </div>
  );
};

export default TrainingPeriod;
