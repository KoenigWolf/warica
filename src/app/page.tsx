"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { useWarikanStore } from "./useWarikanStore";
import { useSetupLogic, useCommonNavigation, useErrorDisplay, useButtonState } from "../lib/shared-logic";
import type { MemberId } from "../lib/types";
import { ROUTES } from "../lib/routes";

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
 * 簡易メンバー入力コンポーネント
 */
const SimpleMemberInput: React.FC<{
  members: Array<{ id: string; name: string }>;
  onAddMember: (name: string) => void;
  onEditMember: (id: string, name: string) => void;
  onRemoveMember: (id: string) => void;
}> = ({ members, onAddMember, onEditMember, onRemoveMember }) => {
  const [newName, setNewName] = React.useState("");
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      onAddMember(newName.trim());
      setNewName("");
    }
  };

  const startEdit = (member: { id: string; name: string }) => {
    setEditId(member.id);
    setEditName(member.name);
  };

  const saveEdit = () => {
    if (editId && editName.trim()) {
      onEditMember(editId, editName.trim());
      setEditId(null);
      setEditName("");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  return (
    <div className="mb-6">
      <Label className="mb-2 font-semibold block">メンバー</Label>
      <div className="flex gap-2 mb-3">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="メンバー名を入力"
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={!newName.trim()}>
          追加
        </Button>
      </div>
      <ul className="space-y-1">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            {editId === member.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={saveEdit}>保存</Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>キャンセル</Button>
              </>
            ) : (
              <>
                <span className="flex-1">{member.name}</span>
                <Button size="sm" variant="ghost" onClick={() => startEdit(member)}>編集</Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveMember(member.id)}>削除</Button>
              </>
            )}
          </li>
        ))}
      </ul>
      {members.length === 0 && (
        <p className="text-gray-500 text-sm">メンバーを追加してください（最低2人必要）</p>
      )}
    </div>
  );
};

/**
 * ホームページ（セットアップページ）
 * - 共通ロジックライブラリで重複削除・簡素化
 */
export default function HomePage() {
  const {
    state: { eventName, members },
    errors,
    setEventName,
    addMember,
    editMember,
    removeMember,
  } = useWarikanStore();

  // 共通ロジック使用
  const setupLogic = useSetupLogic(eventName, members);
  const navigation = useCommonNavigation();
  const errorDisplay = useErrorDisplay(errors);

  // イベント名変更ハンドラー
  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(setupLogic.handleEventNameChange(e));
  };

  // 型安全なメンバー操作のラッパー
  const handleEditMember = (id: string, name: string) => {
    editMember(id as MemberId, name);
  };

  const handleRemoveMember = (id: string) => {
    removeMember(id as MemberId);
  };

  // 次ページへの進行
  const handleNext = () => {
    if (setupLogic.computed.canProceed) {
      navigation.goToPayments();
    }
  };

  // ボタン状態
  const buttonState = useButtonState(
    "支払い入力へ進む",
    setupLogic.computed.canProceed,
    handleNext
  );

  return (
    <PageContainer>
      <AppIntroduction />
      
      {/* エラー表示 */}
      {errorDisplay.hasErrors && (
        <div className={errorDisplay.errorProps.className}>
          {errorDisplay.errorProps.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      
      {/* イベント名入力 */}
      <div className="mb-6">
        <Label htmlFor="event-name" className="mb-2 font-semibold block">
          イベント名
        </Label>
        <Input
          id="event-name"
          value={eventName}
          onChange={handleEventNameChange}
          placeholder="例: 飲み会 2024/06/01"
          className="text-base py-2"
          autoComplete="off"
        />
      </div>

      {/* メンバー入力 */}
      <SimpleMemberInput
        members={members as unknown as Array<{ id: string; name: string }>}
        onAddMember={addMember}
        onEditMember={handleEditMember}
        onRemoveMember={handleRemoveMember}
      />

      {/* 進行ボタン */}
      <Button
        className={buttonState.className}
        disabled={buttonState.disabled}
        onClick={buttonState.onClick}
        type="button"
      >
        {buttonState.text}
      </Button>

      <ActionButtons />
    </PageContainer>
  );
} 