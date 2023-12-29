export enum GenderEnum {
  MALE = "Male",
  FEMALE = "Female",
}
export type Account = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: GenderEnum;
  position: string;
};
export enum PeriodStatusEnum {
  In_progress = "In progress",
  Rejected = "Rejected",
  Done = "Done",
}
export type Period = {
  id: number;
  accountId: number;
  startedDate: string;
  endDate: string;
  status: PeriodStatusEnum;
  account: Account;
};
export enum TaskStatusEnum {
  Todo = "Todo",
  In_progress = "In progress",
  Closed = "Closed",
}
export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatusEnum;
  assignments: Assignment[];
};
export type Assignment = {
  id: number;
  accountId: number;
  taskId: number;
  status: TaskStatusEnum;
};
export type dataCredential = {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
};
