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
import { cn, typography, colors, spacing } from "@/lib/design-system";

/**
 * ハイブランド ヒーローセクション
 */
const BrandHeroSection: React.FC = () => (
  <section className={cn(
    'text-center',
    spacing.component,
    'mb-12 sm:mb-16'
  )}>
    <HeroTitle>
      WARICAN
    </HeroTitle>
    
    <div className={cn(spacing.element, 'max-w-2xl mx-auto')}>
      <p className={cn(
        typography.body.large,
        colors.text.secondary,
        'leading-relaxed'
      )}>
        No More Awkward Settlements.<br className="hidden sm:block" />
        Split with Confidence.
      </p>
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
    isLoaded,
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
    if (isLoaded && setupLogic.computed.canProceed) {
      navigation.goToPayments();
    }
  };

  return (
    <PageContainer>
      {/* ハイブランド ヒーローセクション */}
      <BrandHeroSection />
      
      {/* エラー表示 */}
      {errorDisplay.hasErrors && (
        <div className={cn(
          'p-6 border-l-2 border-destructive',
          colors.surface.secondary,
          'mb-8'
        )}>
          <div className="space-y-2">
            {errorDisplay.errorProps.errors.map((error, index) => (
              <p key={index} className={cn(typography.body.small, 'text-destructive')}>
                {error}
              </p>
            ))}
          </div>
        </div>
      )}
      
      {/* イベント名入力セクション */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8',
        spacing.element
      )}>
        <Label className={cn(
          typography.label,
          'mb-4 block'
        )}>
          Event Name
        </Label>
        
        <Input
          id="event-name"
          value={eventName}
          onChange={handleEventNameChange}
          placeholder="Enter event name"
          className="h-14 text-lg font-light"
        />
      </section>

      {/* メンバー入力セクション */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className={cn(spacing.element, 'mb-6')}>
          <Label className={cn(
            typography.label,
            'mb-2 block'
          )}>
            Members
            <span className={cn(
              'ml-3 px-2 py-1 text-xs font-normal rounded-sm',
              colors.surface.secondary,
              colors.text.tertiary
            )}>
              {isLoaded ? members.length : 0}
            </span>
          </Label>
          <p className={cn(typography.caption)}>
            Minimum 2 members required
          </p>
        </div>
        
        <MemberInput
          members={isLoaded ? members : []}
          onAddMember={addMember}
          onEditMember={editMember}
          onRemoveMember={removeMember}
          errors={setupLogic.validation.errors}
        />
      </section>

      {/* 進行ボタンセクション */}
      <section className={cn(spacing.element, 'pt-6 mb-8')}>
                  <Button
            onClick={handleNext}
            disabled={!isLoaded || !setupLogic.computed.canProceed}
            variant={isLoaded && setupLogic.computed.canProceed ? "default" : "secondary"}
            size="lg"
            className="w-full h-14 text-lg font-light tracking-wide"
          >
                      {isLoaded && setupLogic.computed.canProceed ? (
            <span className="flex items-center gap-3">
              Continue to Payments
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          ) : (
            "Complete Setup"
          )}
        </Button>
        
        {(!isLoaded || !setupLogic.computed.canProceed) && (
          <p className={cn(
            typography.caption,
            'text-center mt-4'
          )}>
            Event name and at least 2 members required
          </p>
        )}
      </section>

      <ActionButtons />
    </PageContainer>
  );
} 