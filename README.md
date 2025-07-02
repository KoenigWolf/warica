# WARICAN - シンプル割り勘アプリ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KoenigWolf/warica)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

イベントの支払いを簡単に計算できる、シンプルな割り勘アプリです。

**デモサイト**: [warica.vercel.app](https://warica.vercel.app)

## 特徴

✨ **シンプル**: 3ステップで割り勘計算が完了  
📱 **スマホ最適化**: タッチ操作に最適化されたUI  
🔒 **プライバシー重視**: データは全てブラウザ内で処理  
💨 **高速**: 最小限の送金回数で精算方法を計算  
🎨 **モダンデザイン**: Glass Morphismを採用した美しいUI  

## 使い方

### 1. イベント情報の入力
- イベント名を設定
- 参加メンバーを追加（最低2人）

### 2. 支払い記録
- 誰がいくら支払ったかを記録
- レシートを見ながら簡単入力

### 3. 精算結果の確認
- 誰がいくら受け取る/支払うかを表示
- 最小回数の送金リストを自動生成

## 技術スタック

- **Frontend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel
- **Storage**: ローカルストレージ（外部送信なし）

## 開発環境

### 必要な環境
- Node.js 18以上
- pnpm（推奨）

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/KoenigWolf/warica.git
cd warica

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### コマンド

```bash
pnpm dev        # 開発サーバー起動
pnpm build      # プロダクションビルド
pnpm start      # プロダクションサーバー起動
pnpm lint       # ESLint実行
```

## プロジェクト構成

```
src/
├── app/                    # ページコンポーネント
│   ├── page.tsx           # ホーム（イベント設定）
│   ├── payments/          # 支払い入力ページ
│   ├── result/            # 結果表示ページ
│   └── useWarikanStore.ts # 状態管理
├── components/            # UIコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   └── shared/           # 共通コンポーネント
└── lib/                  # ロジック・ユーティリティ
    ├── calculations.ts   # 割り勘計算ロジック
    ├── shared-logic.ts   # 共通ロジック
    ├── types.ts         # 型定義
    └── validation.ts    # バリデーション
```

## 計算アルゴリズム

WARICANは効率的な精算方法を計算するために、以下のアプローチを使用しています：

1. **収支計算**: 各メンバーの支払額と負担額の差を算出
2. **債権債務マッチング**: グリーディ法で最小送金回数を実現
3. **端数処理**: 公平な端数分散アルゴリズム

## プライバシーとセキュリティ

- 🔒 **完全ローカル処理**: データは一切外部に送信されません
- 🗃️ **ブラウザストレージ**: localStorage で安全に保存
- 🚫 **アカウント不要**: 個人情報の登録は一切不要

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 貢献

プルリクエストやイシューの報告を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

何か問題や質問がありましたら、[GitHub Issues](https://github.com/KoenigWolf/warica/issues) でお知らせください。

