import { Card, CardContent } from "@/components/ui/card";
import React from "react";

/**
 * 全ページ共通の中央寄せ・レスポンシブなラッパー
 * - UI一貫性・保守性・テスト容易性向上
 */
type PageContainerProps = {
  children: React.ReactNode;
};

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-2">
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg rounded-2xl">
      <CardContent className="py-8 sm:py-12 px-4 sm:px-10 flex flex-col gap-4 sm:gap-8">
        {children}
      </CardContent>
    </Card>
  </div>
); 