import React from "react";
import { Input } from "antd";
import type { InputProps as AntdInputProps } from "antd/es/input";

export type InputSize = "sm" | "md" | "lg";

export type InputTextProps = Omit<AntdInputProps, "size"> & {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode | string;
  className?: string;
  size?: InputSize;
};

const sizeMap: Record<InputSize, AntdInputProps["size"]> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
  const { label, help, error, className = "", size = "md", ...rest } = props;

  const status = error ? "error" : undefined;

  return (
    <div className={className} style={{ width: "100%" }}>
      {label && (
        <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
          {label}
        </label>
      )}

      <Input size={sizeMap[size]} status={status} {...(rest as AntdInputProps)} />

      {error ? (
        <div style={{ marginTop: 6, fontSize: 12, color: "var(--ant-error-color, #ff4d4f)" }}>
          {error}
        </div>
      ) : help ? (
        <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.45)" }}>{help}</div>
      ) : null}
    </div>
  );
});

InputText.displayName = "InputText";

export default InputText;
