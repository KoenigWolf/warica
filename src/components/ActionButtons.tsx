import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

/**
 * 全ページ共通のページ遷移ボタン群
 * - UI一貫性・保守性・テスト容易性向上
 * - セットアップページをエントリーページとして位置づけ
 */
export const ActionButtons: React.FC = () => (
  <div className="flex flex-col gap-2 w-full">
    <Button asChild variant="outline" className="w-full text-base py-2" aria-label="新しい割り勘を始める">
      <Link href="/">新しい割り勘を始める</Link>
    </Button>
    <Button asChild variant="outline" className="w-full text-base py-2" aria-label="支払い入力へ">
      <Link href="/payments">支払い入力へ</Link>
    </Button>
    <Button asChild variant="outline" className="w-full text-base py-2" aria-label="割り勘結果へ">
      <Link href="/result">割り勘結果へ</Link>
    </Button>
  </div>
); 