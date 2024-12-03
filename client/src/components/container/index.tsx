import React from "react";
import styles from "./index.module.css";

type Props = {
  children: React.ReactNode;
};

export const Container: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
