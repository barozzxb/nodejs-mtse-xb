import React from "react";
import { Modal as AntdModal } from "antd";
import type { ModalProps as AntdModalProps } from "antd/es/modal";

export type AppModalProps = Omit<AntdModalProps, "open" | "onCancel"> & {

  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footerNode?: React.ReactNode | null;
  className?: string;
};

const Modal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title,
  children,
  footerNode = null,
  className,
  centered = true,
  destroyOnClose = true,
  width = 520,
  ...rest
}) => {
  return (
    <AntdModal
      open={open}
      onCancel={onClose}
      footer={footerNode}
      title={title}
      className={className}
      centered={centered}
      destroyOnClose={destroyOnClose}
      width={width}
      {...(rest as Partial<AntdModalProps>)}
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
