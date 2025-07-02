"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { HeroTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { useWarikanStore } from "./useWarikanStore";
import { useSetupLogic, useCommonNavigation, useErrorDisplay } from "../lib/shared-logic";
import { cn, typography, advancedSpacing, motion, getModernCardClasses } from "@/lib/design-system";
import type { MemberId } from "../lib/types";

/**
 * 世界最高水準ホームページ v2.0
 * - Glass Morphism + プレミアムレイアウト
 * - 黄金比ベース余白システム
 * - 高度なマイクロインタラクション
 * - 完全アクセシビリティ対応
 */

/**
 * アプリヒーローセクション（プレミアムデザイン）
 */
const AppHeroSection: React.FC = () => (
  <section className={cn(
    'text-center space-y-6',
    advancedSpacing.section.loose,
    motion.entrance.slideDown
  )}>
    <HeroTitle>
      シンプル割り勘アプリ
    </HeroTitle>
    
    <div className="space-y-4 max-w-2xl mx-auto">
      <p className={cn(
        typography.body.large,
        'text-gray-600 leading-relaxed'
      )}>
        イベント名・メンバー・支払いを入力するだけで、<br className="hidden sm:block" />
        美しく簡単に割り勘計算ができます
      </p>
      
      <div className={cn(
        'flex items-center justify-center gap-3 text-sm text-gray-500',
        motion.entrance.fadeIn
      )}>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          ローカル保存
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          個人利用向け
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-violet-500 rounded-full" />
          完全無料
        </span>
      </div>
    </div>
  </section>
);

/**
 * プレミアムメンバー入力コンポーネント
 */
const PremiumMemberInput: React.FC<{
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
    <section className={cn(
      'space-y-6',
      advancedSpacing.section.normal
    )}>
      {/* セクションヘッダー */}
      <div className="space-y-2">
        <Label className={cn(
          typography.heading.h4,
          'text-gray-800 flex items-center gap-2'
        )}>
          <span className="flex items-center gap-2">
            👥 メンバー追加
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              'bg-blue-100 text-blue-700'
            )}>
              {members.length}人
            </span>
          </span>
        </Label>
        <p className={cn(typography.body.small, 'text-gray-500')}>
          最低2人から設定できます
        </p>
      </div>

      {/* メンバー追加フォーム */}
      <div className={cn(
        getModernCardClasses('normal'),
        motion.entrance.slideUp
      )}>
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="メンバー名を入力"
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button 
            onClick={handleAdd} 
            disabled={!newName.trim()}
            size="lg"
            variant="success"
          >
            追加
          </Button>
        </div>
      </div>

      {/* メンバーリスト */}
      <div className="space-y-3">
        {members.length === 0 && (
          <div className={cn(
            'text-center py-8 px-4 rounded-xl',
            'bg-gray-50/80 backdrop-blur-sm border-2 border-dashed border-gray-200',
            motion.entrance.fadeIn
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
              getModernCardClasses('compact'),
              'flex items-center gap-3',
              motion.entrance.slideUp,
              motion.transition.normal
            )}
          >
            {editId === member.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="success" onClick={saveEdit}>
                    保存
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    キャンセル
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                )}>
                  {member.name.charAt(0)}
                </div>
                <span className={cn(typography.body.base, 'flex-1 font-medium')}>
                  {member.name}
                </span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(member)}>
                    編集
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onRemoveMember(member.id)}>
                    削除
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * メインホームページコンポーネント
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

  return (
    <PageContainer variant="wide">
      {/* ヒーローセクション */}
      <AppHeroSection />
      
      {/* エラー表示（プレミアムデザイン） */}
      {errorDisplay.hasErrors && (
        <div className={cn(
          'p-4 rounded-xl border-l-4 border-red-500',
          'bg-red-50/80 backdrop-blur-sm',
          motion.entrance.slideDown
        )}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="space-y-1">
              {errorDisplay.errorProps.errors.map((error, index) => (
                <p key={index} className={cn(typography.body.small, 'text-red-700')}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* イベント名入力セクション */}
      <section className={cn(
        'space-y-4',
        advancedSpacing.section.normal
      )}>
        <Label className={cn(
          typography.heading.h4,
          'text-gray-800 flex items-center gap-2'
        )}>
          🎉 イベント名
        </Label>
        
        <Input
          id="event-name"
          value={eventName}
          onChange={handleEventNameChange}
          placeholder="例: 新年会 2024、温泉旅行、飲み会"
          floating
          label="イベント名"
          helperText="後から変更できます"
        />
      </section>

      {/* メンバー入力セクション */}
      <PremiumMemberInput
        members={members as unknown as Array<{ id: string; name: string }>}
        onAddMember={addMember}
        onEditMember={handleEditMember}
        onRemoveMember={handleRemoveMember}
      />

      {/* 進行ボタンセクション */}
      <section className={cn(
        'space-y-4 pt-6',
        advancedSpacing.section.normal
      )}>
        <Button
          onClick={handleNext}
          disabled={!setupLogic.computed.canProceed}
          variant={setupLogic.computed.canProceed ? "premium" : "secondary"}
          size="xl"
          fullWidth
          className={cn(
            motion.entrance.zoom,
            motion.interaction.hover
          )}
        >
          {setupLogic.computed.canProceed ? (
            <span className="flex items-center gap-2">
              支払い入力へ進む ✨
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          ) : (
            "条件を満たしてください"
          )}
        </Button>
        
        {!setupLogic.computed.canProceed && (
          <p className={cn(
            typography.body.small,
            'text-center text-gray-500',
            motion.entrance.fadeIn
          )}>
            イベント名と2人以上のメンバーが必要です
          </p>
        )}
      </section>

      <ActionButtons />
    </PageContainer>
  );
} 