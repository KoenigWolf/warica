# 🧮 シンプル割り勘アプリ（Warica）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KoenigWolf/warica)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

誰でもすぐに使える、超シンプル設計の割り勘計算Webアプリです。

🌐 **デモサイト**: [warica.vercel.app](https://warica.vercel.app)

![Warica Screenshot](https://via.placeholder.com/800x400/f3f4f6/374151?text=Warica+App+Screenshot)

## ✨ 概要

- 📝 **イベント名・メンバー・支払い内容**を入力するだけで、「誰が誰にいくら払えばいいか」を**自動で最小化計算**
- 🔒 **登録やログイン不要**、データはローカル保存のみでプライバシーも安心
- 📱 **レスポンシブUI**でスマホ・PCのどちらでも直感的に使える
- 🆓 **完全無料・オープンソース**

## 🎯 このアプリを作った理由

- 🍻 **飲み会、旅行、ランチ**などでの「割り勘計算」をもっと**手軽で明快にしたい**
- ⚡ **会員登録やインストール不要**で、誰でもすぐ使えるものがほしかった
- 🛡️ データを外部送信せず、**ローカル保存のみでプライバシーを守りたい**
- 🎛️ 「誰が立て替え」「誰の分を払ったか」も**柔軟に指定**できる割り勘が欲しかった

## 🚀 主な機能

### 基本機能
- ✅ **イベント名・メンバー登録**（ニックネーム可）
- 💰 **支払い入力**（立て替えた人／対象メンバーを複数選択、金額・メモ）
- 🧮 **割り勘計算**：最小限の送金リストを自動算出
- 📊 **各メンバーの収支表示**（受け取り・支払い金額）
- ✏️ **支払い履歴の編集・削除**

### プライバシー・セキュリティ
- 🔐 **ローカルストレージのみ**でデータ保存
- 🚫 **アカウント登録/外部送信一切なし**
- 🏠 **完全オフライン対応**

### UX・UI
- 📱 **モバイルファースト設計**
- 🎨 **直感的でシンプルなUI**
- ⚡ **高速な操作レスポンス**
- ♿ **アクセシビリティ対応**

## 🎮 使い方

### 📋 ステップ1: イベント設定
1. 🏷️ **イベント名**を入力（例：「忘年会 2024/12/25」）
2. 👥 **メンバー名**を追加（2人以上必要）
3. ✏️ メンバー名の**編集・削除**も可能

### 💳 ステップ2: 支払い入力
1. 💰 **立て替えた人**を選択
2. 👥 **対象メンバー**をチェック（全員選択も可能）
3. 💴 **金額**とオプションで**メモ**を入力
4. ➕ 「追加」ボタンで支払いを登録

### 📊 ステップ3: 結果確認
1. 📈 **各メンバーの収支**を確認
2. 💸 **最小送金リスト**で誰が誰にいくら払うかを確認
3. ✏️ 必要に応じて支払い履歴を**編集・削除**

## 🛠️ 技術スタック

### フロントエンド
- ⚛️ **[Next.js 15](https://nextjs.org/)** - React フレームワーク（App Router）
- 🔷 **[TypeScript](https://www.typescriptlang.org/)** - 型安全性
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - スタイリング
- 🧩 **[shadcn/ui](https://ui.shadcn.com/)** - UIコンポーネントライブラリ
- 🎯 **[Radix UI](https://www.radix-ui.com/)** - アクセシブルなプリミティブ

### 状態管理・ロジック
- 🪝 **React Hooks** - カスタムフック（useWarikanStore）
- 💾 **localStorage** - データ永続化
- 🧮 **グリーディ法** - 最小送金リスト算出アルゴリズム

### 開発・ビルドツール
- 📦 **[pnpm](https://pnpm.io/)** - パッケージマネージャー
- 🔍 **[ESLint](https://eslint.org/)** - コード品質
- 🎨 **[Prettier](https://prettier.io/)** - コードフォーマット
- 🚀 **[Vercel](https://vercel.com/)** - デプロイメント

## 💻 ローカル開発

### 前提条件
- 📦 **Node.js 18+**
- 📦 **pnpm 8+** (推奨) または npm/yarn

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/KoenigWolf/warica.git
cd warica

# 依存パッケージをインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

🌐 ブラウザで [http://localhost:3000](http://localhost:3000) を開いてご利用ください。

### その他のコマンド

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# リント実行
pnpm lint

# 型チェック
pnpm type-check
```

## 📁 プロジェクト構造

```
warica/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx         # ホーム（セットアップ）ページ
│   │   ├── payments/        # 支払い入力ページ
│   │   ├── result/          # 結果表示ページ
│   │   ├── layout.tsx       # ルートレイアウト
│   │   ├── globals.css      # グローバルスタイル
│   │   └── useWarikanStore.ts # 状態管理カスタムフック
│   ├── components/          # 再利用可能コンポーネント
│   │   ├── ui/             # shadcn/ui コンポーネント
│   │   ├── ActionButtons.tsx
│   │   ├── PageContainer.tsx
│   │   └── SectionTitle.tsx
│   └── lib/
│       └── utils.ts         # ユーティリティ関数
├── public/                  # 静的ファイル
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🧮 アルゴリズム詳細

### 収支計算
1. 📊 全支払いの**合計金額**を算出
2. 👥 **一人当たりの負担額**を計算（切り捨て）
3. 💰 各メンバーの**支払い額 - 負担額**で収支を算出
4. 🔢 端数処理（余りを先頭メンバーから順番に負担）

### 最小送金リスト生成
- 🎯 **グリーディ法**を使用して送金回数を最小化
- ➕ プラス収支（受け取る人）とマイナス収支（支払う人）をマッチング
- 🔄 効率的な精算ルートを自動計算

## ⚠️ 注意事項

- 💾 **ローカルストレージのみ**でデータを保存します
- 🗑️ ブラウザのキャッシュ削除やシークレットモード利用時はデータが消えます
- 🌐 サーバー送信やアカウント機能はありません
- 📱 モバイルブラウザでの利用を推奨します

## 📄 ライセンス

**[MIT License](./LICENSE)** - 商用利用・改変も自由です

## 🤝 コントリビュート

### バグ報告・機能リクエスト
- 🐛 **Issues** でバグ報告や機能リクエストをお願いします
- 💡 改善提案も大歓迎です

### 開発への参加
1. 🍴 このリポジトリを **Fork**
2. 🌿 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 💬 変更をコミット (`git commit -m 'Add amazing feature'`)
4. 📤 ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. 🔄 **Pull Request** を作成

## 🎨 作者・開発ストーリー

このアプリは**「面倒な割り勘計算を、誰でも・どこでも・すぐに」**を実現するために開発しました。

🍻 日常の飲み会やランチ、旅行精算の「計算ストレス」を少しでも減らせたら嬉しいです。

---

**⭐ このプロジェクトが役に立ったら、GitHubでスターをお願いします！**

[![GitHub stars](https://img.shields.io/github/stars/KoenigWolf/warica?style=social)](https://github.com/KoenigWolf/warica/stargazers)

