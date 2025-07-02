"use client";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { HeroTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { MemberInput } from "@/components/shared/MemberInput";
import { useWarikanStore } from "./useWarikanStore";
import { useSetupLogic, useCommonNavigation, useErrorDisplay } from "../lib/shared-logic";
import { cn, typography } from "@/lib/design-system";

/**
 * アプリヒーローセクション（プレミアムデザイン）
 */
const AppHeroSection: React.FC = () => (
  <section className={cn(
    'text-center space-y-4 sm:space-y-6',
    'mb-6 sm:mb-8'
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
        簡単に割り勘計算ができます
      </p>
      
      <div className={cn(
        'flex items-center justify-center gap-4 text-base sm:text-lg text-gray-500'
      )}>
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          ローカル保存
        </span>
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          個人利用
        </span>
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-violet-500 rounded-full" />
          無料
        </span>
      </div>
    </div>
  </section>
);

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

  // イベント名変更ハンドラー（直接処理に変更）
  const handleEventNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  }, [setEventName]);

  // 次ページへの進行
  const handleNext = () => {
    if (setupLogic.computed.canProceed) {
      navigation.goToPayments();
    }
  };

  return (
    <PageContainer>
      {/* ヒーローセクション */}
      <AppHeroSection />
      
      {/* エラー表示（プレミアムデザイン） */}
      {errorDisplay.hasErrors && (
        <div className={cn(
          'p-4 rounded-xl border-l-4 border-red-500',
          'bg-red-50/80 backdrop-blur-sm mb-6'
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
        'bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg',
        'space-y-3 sm:space-y-4 mb-6 sm:mb-8'
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
          className="h-12 text-base sm:text-lg"
        />
      </section>

      {/* メンバー入力セクション */}
      <section className={cn(
        'bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg',
        'mb-6 sm:mb-8'
      )}>
        <div className="space-y-2 mb-4">
          <Label className={cn(
            typography.heading.h4,
            'text-gray-800 flex items-center gap-2'
          )}>
            <span className="flex items-center gap-2">
              👥 メンバー追加
              <span className={cn(
                'px-3 py-1 text-sm sm:text-base font-medium rounded-full',
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
        
        <MemberInput
          members={members}
          onAddMember={addMember}
          onEditMember={editMember}
          onRemoveMember={removeMember}
          errors={setupLogic.validation.errors}
        />
      </section>

      {/* 進行ボタンセクション */}
      <section className="space-y-4 pt-6 mb-6 sm:mb-8">
        <Button
          onClick={handleNext}
          disabled={!setupLogic.computed.canProceed}
          variant={setupLogic.computed.canProceed ? "premium" : "secondary"}
          size="xl"
          fullWidth
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
            'text-center text-gray-500'
          )}>
            イベント名と2人以上のメンバーが必要です
          </p>
        )}
      </section>

      <ActionButtons />
    </PageContainer>
  );
} 