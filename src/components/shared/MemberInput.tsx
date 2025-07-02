import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Member, MemberId } from "../../lib/types";

/**
 * メンバー入力コンポーネント
 * - 責務: メンバーの追加・編集・削除UI
 * - 再利用性: 他のページでも使用可能
 * - テスト容易性: 純粋なコンポーネント設計
 */

export interface MemberInputProps {
  readonly members: readonly Member[];
  readonly onAddMember: (name: string) => void;
  readonly onEditMember: (id: MemberId, name: string) => void;
  readonly onRemoveMember: (id: MemberId) => void;
  readonly errors?: readonly string[];
  readonly disabled?: boolean;
  readonly className?: string;
}

export const MemberInput: React.FC<MemberInputProps> = ({
  members,
  onAddMember,
  onEditMember,
  onRemoveMember,
  errors = [],
  disabled = false,
  className = "",
}) => {
  const [newMemberName, setNewMemberName] = useState("");
  const [editId, setEditId] = useState<MemberId | null>(null);
  const [editName, setEditName] = useState("");

  // メンバー追加処理
  const handleAdd = useCallback(() => {
    if (!newMemberName.trim() || disabled) return;
    
    onAddMember(newMemberName.trim());
    setNewMemberName("");
  }, [newMemberName, onAddMember, disabled]);

  // 編集開始
  const handleEditStart = useCallback((member: Member) => {
    if (disabled) return;
    
    setEditId(member.id);
    setEditName(member.name);
  }, [disabled]);

  // 編集保存
  const handleEditSave = useCallback(() => {
    if (!editId || !editName.trim() || disabled) return;
    
    onEditMember(editId, editName.trim());
    setEditId(null);
    setEditName("");
  }, [editId, editName, onEditMember, disabled]);

  // 編集キャンセル
  const handleEditCancel = useCallback(() => {
    setEditId(null);
    setEditName("");
  }, []);

  // Enterキー処理
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent,
    action: 'add' | 'save'
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (action === 'add') {
        handleAdd();
      } else {
        handleEditSave();
      }
    }
  }, [handleAdd, handleEditSave]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="member-name" className="block mb-2 font-semibold">
          メンバー
        </Label>
        
        {/* エラー表示 */}
        {errors.length > 0 && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {/* 新規メンバー追加 */}
        <div className="flex gap-2 mb-3">
          <Input
            id="member-name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="メンバー名を入力"
            disabled={disabled}
            className="flex-1 text-base py-2"
            autoComplete="off"
          />
          <Button
            onClick={handleAdd}
            disabled={!newMemberName.trim() || disabled}
            type="button"
            aria-label="メンバー追加"
            className="text-base px-4 py-2"
          >
            追加
          </Button>
        </div>

        {/* メンバー一覧 */}
        {members.length > 0 && (
          <ul className="space-y-1" role="list" aria-label="メンバー一覧">
            {members.map((member) => (
              <li 
                key={member.id} 
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                {editId === member.id ? (
                  // 編集モード
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'save')}
                      placeholder="新しい名前"
                      disabled={disabled}
                      className="flex-1 text-base py-1"
                      autoFocus
                      autoComplete="off"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleEditSave}
                      disabled={!editName.trim() || disabled}
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
                      disabled={disabled}
                      type="button"
                      aria-label="編集をキャンセル"
                      className="px-3"
                    >
                      キャンセル
                    </Button>
                  </>
                ) : (
                  // 表示モード
                  <>
                    <span className="flex-1 text-base font-medium">
                      {member.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStart(member)}
                      disabled={disabled}
                      type="button"
                      aria-label={`${member.name}を編集`}
                      className="text-blue-600 px-3 hover:text-blue-800"
                    >
                      編集
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMember(member.id)}
                      disabled={disabled}
                      type="button"
                      aria-label={`${member.name}を削除`}
                      className="text-red-500 px-3 hover:text-red-700"
                    >
                      削除
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* メンバー数表示 */}
        <div className="mt-2 text-sm text-gray-500">
          {members.length === 0 
            ? "メンバーを追加してください（最低2人必要）"
            : `${members.length}人のメンバー`
          }
        </div>
      </div>
    </div>
  );
}; 