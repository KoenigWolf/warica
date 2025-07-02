import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn, typography } from "../../lib/design-system";
import type { Member, MemberId } from "../../lib/types";

/**
 * メンバー入力コンポーネント v2.0
 * - プレミアムデザイン適用
 * - スマホ最適化とタッチ操作改善
 * - 入力問題の修正
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

  // メンバー追加処理（改善済み）
  const handleAdd = useCallback(() => {
    const trimmedName = newMemberName.trim();
    if (!trimmedName || disabled) return;
    
    onAddMember(trimmedName);
    setNewMemberName("");
  }, [newMemberName, onAddMember, disabled]);

  // 新しいメンバー名の入力処理（直接更新）
  const handleNewMemberNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMemberName(e.target.value);
  }, []);

  // 編集開始
  const handleEditStart = useCallback((member: Member) => {
    if (disabled) return;
    
    setEditId(member.id);
    setEditName(member.name);
  }, [disabled]);

  // 編集名の入力処理（直接更新）
  const handleEditNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  }, []);

  // 編集保存
  const handleEditSave = useCallback(() => {
    const trimmedName = editName.trim();
    if (!editId || !trimmedName || disabled) return;
    
    onEditMember(editId, trimmedName);
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
    <div className={cn("space-y-4", className)}>
      {/* エラー表示 */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-red-700">
          {errors.map((error, index) => (
            <div key={index} className={cn(typography.body.small, 'leading-relaxed')}>
              {error}
            </div>
          ))}
        </div>
      )}

      {/* 新規メンバー追加フォーム */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
        <div className="flex gap-3">
          <Input
            value={newMemberName}
            onChange={handleNewMemberNameChange}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="メンバー名を入力"
            disabled={disabled}
            className="flex-1 h-12 text-base"
            autoComplete="off"
          />
          <Button
            onClick={handleAdd}
            disabled={!newMemberName.trim() || disabled}
            type="button"
            size="lg"
            variant="success"
            className="min-w-[80px] h-12"
          >
            追加
          </Button>
        </div>
      </div>

      {/* メンバー一覧 */}
      <div className="space-y-3">
        {members.length === 0 && (
          <div className={cn(
            'text-center py-8 px-4 rounded-xl',
            'bg-gray-50/80 backdrop-blur-sm border-2 border-dashed border-gray-200/50'
          )}>
            <div className="text-4xl mb-2">👋</div>
            <p className={cn(typography.body.base, 'text-gray-500')}>
              メンバーを追加してください
            </p>
          </div>
        )}

        {members.map((member) => (
          <div 
            key={member.id} 
            className={cn(
              'bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50',
              'flex items-center gap-3',
              'hover:bg-white/70 transition-all duration-200'
            )}
          >
            {editId === member.id ? (
              // 編集モード
              <>
                <Input
                  value={editName}
                  onChange={handleEditNameChange}
                  onKeyDown={(e) => handleKeyDown(e, 'save')}
                  placeholder="新しい名前"
                  disabled={disabled}
                  className="flex-1 h-11 text-base"
                  autoFocus
                  autoComplete="off"
                />
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleEditSave}
                    disabled={!editName.trim() || disabled}
                    type="button"
                    className="min-w-[60px] h-11"
                  >
                    保存
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditCancel}
                    disabled={disabled}
                    type="button"
                    className="min-w-[60px] h-11"
                  >
                    キャンセル
                  </Button>
                </div>
              </>
            ) : (
              // 表示モード
              <>
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium',
                  'bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex-shrink-0'
                )}>
                  {member.name.charAt(0)}
                </div>
                <span className={cn(
                  typography.body.base,
                  'flex-1 font-medium text-gray-800 min-w-0'
                )}>
                  {member.name}
                </span>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStart(member)}
                    disabled={disabled}
                    type="button"
                    className="text-blue-600 hover:text-blue-800 min-w-[50px] h-10"
                  >
                    編集
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMember(member.id)}
                    disabled={disabled}
                    type="button"
                    className="text-red-500 hover:text-red-700 min-w-[50px] h-10"
                  >
                    削除
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* メンバー数表示 */}
      <div className={cn(
        'text-center p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg',
        'border border-gray-200/50'
      )}>
        <p className={cn(typography.body.small, 'text-gray-600')}>
          {members.length === 0 
            ? "メンバーを追加してください（最低2人必要）"
            : `${members.length}人のメンバーが登録されています`
          }
        </p>
      </div>
    </div>
  );
}; 