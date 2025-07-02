import React from "react";

/**
 * セクションタイトル（h2）
 * - UI一貫性・保守性・テスト容易性向上
 */
type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};
export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className }) => (
  <h2 className={`text-xl sm:text-2xl font-bold mb-6 text-center ${className ?? ""}`}>{children}</h2>
); 