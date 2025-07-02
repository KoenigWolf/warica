"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWarikanStore } from "./useWarikanStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";

/**
 * メンバー入力コンポーネント
 * 責務: メンバーの追加・編集・削除のUIとロジック
 */
interface MemberInputProps {
  members: Array<{ id: string; name: string }>;
  onAddMember: (name: string) => void;
  onEditMember: (id: string, name: string) => void;
  onRemoveMember: (id: string) => void;
}

const MemberInput: React.FC<MemberInputProps> = ({
  members,
  onAddMember,
  onEditMember,
  onRemoveMember,
}) => {
  const [newMember, setNewMember] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddMember = useCallback(() => {
    const trimmedName = newMember.trim();
    if (trimmedName) {
      onAddMember(trimmedName);
      setNewMember("");
    }
  }, [newMember, onAddMember]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddMember();
    }
  }, [handleAddMember]);

  const handleEditStart = useCallback((member: { id: string; name: string }) => {
    setEditId(member.id);
    setEditName(member.name);
  }, []);

  const handleEditSave = useCallback(() => {
    const trimmedName = editName.trim();
    if (trimmedName && editId) {
      onEditMember(editId, trimmedName);
      setEditId(null);
      setEditName("");
    }
  }, [editName, editId, onEditMember]);

  const handleEditCancel = useCallback(() => {
    setEditId(null);
    setEditName("");
  }, []);

  return (
    <div className="mb-6">
      <Label htmlFor="member-name" className="mb-2 font-semibold">
        メンバー
      </Label>
      <div className="flex gap-2 mb-2">
        <Input
          id="member-name"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="名前を入力"
          className="flex-1 text-base py-2"
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleAddMember}
          type="button"
          aria-label="メンバー追加"
          className="text-base px-4 py-2"
        >
          追加
        </Button>
      </div>
      <ul>
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-2 mb-1">
            {editId === member.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="新しい名前"
                  title="新しい名前"
                  className="flex-1 text-base py-2"
                  autoFocus
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditSave}
                  type="button"
                  aria-label="保存"
                  className="px-3"
                >
                  保存
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditCancel}
                  type="button"
                  aria-label="キャンセル"
                  className="px-3"
                >
                  キャンセル
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-base">{member.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditStart(member)}
                  type="button"
                  aria-label="編集"
                  className="text-blue-600 px-3"
                >
                  編集
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMember(member.id)}
                  type="button"
                  aria-label="削除"
                  className="text-red-500 px-3"
                >
                  削除
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * アプリ紹介セクションコンポーネント
 * 責務: アプリの概要説明とウェルカムメッセージ
 */
const AppIntroduction: React.FC = () => (
  <div className="mb-8 text-center">
    <SectionTitle>シンプル割り勘アプリ</SectionTitle>
    <p className="mb-4 text-gray-600 text-base sm:text-lg" tabIndex={0}>
      イベント名・メンバー・支払いを入力するだけで、簡単に割り勘計算！
    </p>
    <p className="text-xs sm:text-sm text-gray-400" aria-label="注意事項">
      ローカル保存のみ・個人利用向け
    </p>
  </div>
);

/**
 * 進行ボタンコンポーネント
 * 責務: 次のステップへの進行ボタンの表示と状態管理
 */
interface ProgressButtonProps {
  eventName: string;
  membersCount: number;
  onNext: () => void;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({
  eventName,
  membersCount,
  onNext,
}) => {
  const isDisabled = !eventName.trim() || membersCount < 2;
  
  return (
    <Button
      className="w-full mt-8 mb-4 text-base py-3"
      disabled={isDisabled}
      onClick={onNext}
      type="button"
      aria-label="支払い入力へ進む"
    >
      支払い入力へ進む
    </Button>
  );
};

/**
 * 設定完了の判定ロジック
 * 純粋関数として実装し、テスト容易性を向上
 */
const validateSetupCompletion = (eventName: string, membersCount: number): boolean => {
  return eventName.trim().length > 0 && membersCount >= 2;
};

/**
 * セットアップページ（エントリーページ）
 * 役割: アプリの紹介とイベント・メンバーの設定を一元管理
 * - 可読性: 明確なコンポーネント分割と命名
 * - 保守性: 責務分離によるメンテナンス性向上
 * - 再利用性: 汎用的なコンポーネント設計
 * - テスト容易性: 純粋関数とフックの分離
 * - 複雑度: シンプルな構造と明確な責務
 * - 冗長性: 重複ロジックの排除
 * - パフォーマンス: useCallback、useMemoの適切な使用
 */
export default function HomePage() {
  const router = useRouter();
  const {
    state: { eventName, members },
    setEventName,
    addMember,
    editMember,
    removeMember,
  } = useWarikanStore();

  // パフォーマンス最適化: 進行可能状態の計算をメモ化
  const canProgress = useMemo(() => 
    validateSetupCompletion(eventName, members.length),
    [eventName, members.length]
  );

  // 次ページへの進行処理
  const handleNext = useCallback(() => {
    if (canProgress) {
      router.push("/payments");
    }
  }, [canProgress, router]);

  // イベント名変更ハンドラー
  const handleEventNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, [setEventName]);

  return (
    <PageContainer>
      <AppIntroduction />
      
      <div className="mb-6">
        <Label htmlFor="event-name" className="mb-2 font-semibold">
          イベント名
        </Label>
        <Input
          id="event-name"
          value={eventName}
          onChange={handleEventNameChange}
          placeholder="例: 飲み会 2024/06/01"
          className="mb-2 text-base py-2"
        />
      </div>

      <MemberInput
        members={members}
        onAddMember={addMember}
        onEditMember={editMember}
        onRemoveMember={removeMember}
      />

      <ProgressButton
        eventName={eventName}
        membersCount={members.length}
        onNext={handleNext}
      />

      <ActionButtons />
    </PageContainer>
  );
} 