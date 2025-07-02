import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn, typography, colors, spacing } from "../../lib/design-system";
import type { Member, MemberId } from "../../lib/types";

/**
 * ハイブランド メンバー入力コンポーネント v3.0
 * - モノトーンデザイン
 * - ミニマルインターフェース
 * - 高級感のあるタイポグラフィ
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
    <div className={cn(spacing.component, className)}>
      {/* エラー表示 */}
      {errors.length > 0 && (
        <div className={cn(
          'p-4 border-l-2 border-destructive',
          colors.surface.secondary
        )}>
          {errors.map((error, index) => (
            <div key={index} className={cn(typography.caption, 'text-destructive')}>
              {error}
            </div>
          ))}
        </div>
      )}

      {/* 新規メンバー追加フォーム */}
      <div className={cn(colors.surface.secondary, 'p-4 border')}>
        <div className="flex gap-3">
          <Input
            value={newMemberName}
            onChange={handleNewMemberNameChange}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="Enter member name"
            disabled={disabled}
            className="flex-1 h-12 text-base font-light"
            autoComplete="off"
          />
          <Button
            onClick={handleAdd}
            disabled={!newMemberName.trim() || disabled}
            type="button"
            size="default"
            className="min-w-[80px] h-12 font-light tracking-wide"
          >
            Add
          </Button>
        </div>
      </div>

      {/* メンバー一覧 */}
      <div className={spacing.element}>
        {members.length === 0 && (
          <div className={cn(
            'text-center py-12 px-6',
            colors.surface.secondary,
            'border-2 border-dashed'
          )}>
            <p className={cn(typography.body.base, colors.text.secondary)}>
              No members added yet
            </p>
          </div>
        )}

        {members.map((member) => (
          <div 
            key={member.id} 
            className={cn(
              colors.surface.elevated,
              'p-4 flex items-center gap-4',
              'hover:bg-muted/20 transition-colors duration-200'
            )}
          >
            {editId === member.id ? (
              // 編集モード
              <>
                <Input
                  value={editName}
                  onChange={handleEditNameChange}
                  onKeyDown={(e) => handleKeyDown(e, 'save')}
                  placeholder="Enter new name"
                  disabled={disabled}
                  className="flex-1 h-11 text-base font-light"
                  autoFocus
                  autoComplete="off"
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEditSave}
                    disabled={!editName.trim() || disabled}
                    type="button"
                    className="min-w-[60px] h-11 font-light"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditCancel}
                    disabled={disabled}
                    type="button"
                    className="min-w-[60px] h-11 font-light"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              // 表示モード
              <>
                <div className={cn(
                  'w-10 h-10 border border-border flex items-center justify-center text-sm font-medium',
                  colors.text.secondary,
                  'flex-shrink-0'
                )}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <span className={cn(
                  typography.body.base,
                  'flex-1 font-light min-w-0'
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
                    className="text-muted-foreground hover:text-foreground min-w-[50px] h-10 font-light"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMember(member.id)}
                    disabled={disabled}
                    type="button"
                    className="text-destructive hover:text-destructive/80 min-w-[50px] h-10 font-light"
                  >
                    Remove
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* メンバー数表示 */}
      <div className={cn(
        'text-center p-3',
        colors.surface.secondary,
        'border'
      )}>
        <p className={cn(typography.caption)}>
          {members.length === 0 
            ? "Add members to continue (minimum 2 required)"
            : `${members.length} member${members.length !== 1 ? 's' : ''} registered`
          }
        </p>
      </div>
    </div>
  );
}; 