import { useAppDispatch, useAppSelector } from "@/hooks";
import { baseUrl } from "@/services/const";
import { User, setUser } from "@/slices/user.slice";
import { GoogleLogin } from "@react-oauth/google";
import { Flex, message, theme } from "antd";
import axios from "axios";
import { log } from "console";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const Login = (props: Props) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const token = theme.useToken();
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
  const navigate = useNavigate();
  return (
    <>
      {contextHolder}
      <Flex
        style={{
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(131deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 40%, rgba(56,121,9,1) 100%)",
        }}
        justify="center"
        align="center"
      >
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await axios.get<User>(
                baseUrl + `login?credential=${credentialResponse.credential}`
              );
              console.log(res.data, "llll");

              dispatch(setUser(res.data));
              success("Login successfully");
              navigate("/");
            } catch (err) {
              error(
                "Unauthorized, please contact to administrator for permission ."
              );
            }
          }}
          onError={() => {
            error("Failed to log in with google");
          }}
        />
      </Flex>
    </>
  );
};

export default Login;
