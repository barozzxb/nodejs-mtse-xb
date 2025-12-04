import React from "react";
import { Button as AntButton } from "antd";
import type { ButtonProps as AntdButtonProps } from "antd";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<AntdButtonProps, "type" | "size"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
};

const sizeMap: Record<Size, AntdButtonProps["size"]> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  style,
  children,
  ...rest
}) => {

  const isDanger = variant === "danger";
  const isGhost = variant === "ghost";
  const antType: AntdButtonProps["type"] = variant === "primary" ? "primary" : "default";

  return (
    <AntButton
      type={antType}
      size={sizeMap[size]}
      danger={isDanger}
      ghost={isGhost}
      className={className}
      style={{
        borderRadius: 12,
        fontWeight: 500,
        ...style,
      }}
      {...(rest as Omit<AntdButtonProps, "type" | "size" | "danger" | "ghost">)}
    >
      {children}
    </AntButton>
  );
};

export default Button;
