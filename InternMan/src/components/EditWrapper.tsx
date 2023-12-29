import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import ModalForm from "./ModalForm";
type Props<X, T extends FieldValues> = {
  form: UseFormReturn<T>;
  formMutation: (obj: any) => any;
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

const EditWrapper = <X, T extends FieldValues>({
  form,
  formMutation,
  action,
  title,
  fields,
  Trigger,
  invalidQuery,
  payLoad,
}: Props<X, T>) => {
  console.log(payLoad, "Wrapp");

  return (
    <ModalForm
      form={form}
      title={title}
      formMutation={formMutation}
      fields={fields}
      Trigger={Trigger}
      payLoad={payLoad}
    ></ModalForm>
  );
};

export default EditWrapper;
