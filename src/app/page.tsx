"use client";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { useWarikanStore } from "./useWarikanStore";
import { validateSetupCompletion } from "../lib/validation";
import type { MemberId } from "../lib/types";

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
 * 簡易メンバー入力コンポーネント（暫定実装）
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
 * 進行ボタンコンポーネント
 */
const ProgressButton: React.FC<{
  isValid: boolean;
  onNext: () => void;
}> = ({ isValid, onNext }) => (
  <Button
    className="w-full mt-8 mb-4 text-base py-3"
    disabled={!isValid}
    onClick={onNext}
    type="button"
  >
    支払い入力へ進む
  </Button>
);

/**
 * ホームページ（セットアップページ）
 * - リファクタリング済み: 型安全性、エラーハンドリング、パフォーマンス最適化
 */
export default function HomePage() {
  const router = useRouter();
  const {
    state: { eventName, members },
    errors,
    setEventName,
    addMember,
    editMember,
    removeMember,
  } = useWarikanStore();

  // バリデーション結果をメモ化
  const validation = useMemo(() => 
    validateSetupCompletion(eventName, members),
    [eventName, members]
  );

  // 次ページへの進行
  const handleNext = useCallback(() => {
    if (validation.isValid) {
      router.push("/payments");
    }
  }, [validation.isValid, router]);

  // イベント名変更
  const handleEventNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, [setEventName]);

  // 型安全なメンバー操作のラッパー
  const handleEditMember = useCallback((id: string, name: string) => {
    editMember(id as MemberId, name);
  }, [editMember]);

  const handleRemoveMember = useCallback((id: string) => {
    removeMember(id as MemberId);
  }, [removeMember]);

  return (
    <PageContainer>
      <AppIntroduction />
      
      {/* エラー表示 */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errors.map((error, index) => (
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

      {/* バリデーションエラー表示 */}
      {!validation.isValid && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
          {validation.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {/* 進行ボタン */}
      <ProgressButton isValid={validation.isValid} onNext={handleNext} />

      <ActionButtons />
    </PageContainer>
  );
} 