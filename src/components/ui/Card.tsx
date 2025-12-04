import React from "react";
import { Card as AntdCard } from "antd";
import type { CardProps as AntdCardProps } from "antd/es/card";

export type CustomCardProps = Omit<AntdCardProps, "title"> & {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
};

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  footer,
  children,
  className,
  bodyStyle,
  style,
  bordered = true,
  ...rest
}) => {
  return (
    <AntdCard
      title={title}
      className={className}
      bordered={bordered}
      bodyStyle={{
        padding: 16,
        ...bodyStyle,
      }}
      style={{
        borderRadius: 16,
        ...style,
      }}
      {...(rest as Partial<AntdCardProps>)}
    >
      <div>{children}</div>

      {footer && <div style={{ marginTop: 16 }}>{footer}</div>}
    </AntdCard>
  );
};

export default CustomCard;
