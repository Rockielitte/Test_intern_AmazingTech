import { Skeleton, Spin } from "antd";
import { FC, lazy, Suspense } from "react";
// import LoadingScreen from "../components/Loading";

interface LoadableProps {
  loader: () => Promise<{ default: React.ComponentType }>;
}

const Loadable: FC<LoadableProps> = ({ loader }) => {
  const Component = lazy(loader);

  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      }
    >
      <Component />
    </Suspense>
  );
};

export default Loadable;
