![logo](./docs/assets/logo.png)

<p align="center">
    <a href="LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/yoshihiro-maeda-cc/real-radio-calisthenics" alt="GitHub license">
    </a>
    <a href="https://en.wikipedia.org/wiki/Hippopotamus" target="_blank">
        <img src="https://img.shields.io/badge/org-hippopotamus-brightgreen" alt="Organization">
    </a>
    <a href="https://github.com/yoshihiro-maeda-cc/real-radio-calisthenics" target="_blank">
        <img src="https://img.shields.io/github/languages/code-size/yoshihiro-maeda-cc/real-radio-calisthenics" alt="Code Size">
    </a>
    <a href="https://github.com/yoshihiro-maeda-cc/real-radio-calisthenics/search?l=javascript" target="_blank">
        <img src="https://img.shields.io/github/languages/top/yoshihiro-maeda-cc/real-radio-calisthenics" alt="Language Top">
    </a>
    <a href="https://github.com/issues" target="_blank">
        <img src="https://img.shields.io/github/issues/yoshihiro-maeda-cc/real-radio-calisthenics" alt="Issues">
    </a>
    <a href="https://github.com/issues?q=is%3Aclosed+is%3Aissue+author%3Ayoshihiro-maeda-cc+archived%3Afalse+" target="_blank">
        <img src="https://img.shields.io/github/issues-closed-raw/yoshihiro-maeda-cc/real-radio-calisthenics" alt="Issues Closed">
    </a>
    <a href="https://github.com/yoshihiro-maeda-cc/real-radio-calisthenics/commits/main" target="_blank">
        <img src="https://img.shields.io/github/last-commit/yoshihiro-maeda-cc/real-radio-calisthenics" alt="Last Commit">
    </a>
</p>

> ⚠️ これは完全なるジョークプロジェクトです。書いてあることを決して鵜呑みにしないでください。

これは全国各地のラジオ体操動画の情報を取得する API です。

## 🛠️ Installation

### Setup Modules

```bash
npm install
```

### Setup PostgreSQL

プロジェクトルートに `.env.local` を配置してください。

```env
DB_USER=<DB USER NAME>
DB_PASSWORD=<DB PASSWORD>
DB_NAME=solo_api_store
GOOGLE_API_KEY=<API KEY>
```

> アプリ利用のみの場合、`GOOGLE_API_KEY` は不要です。これは初期データ投入スクリプトの実行に利用します。

マイグレーションを実行してください。

```bash
npm run migrate && npm run seed
```

## 🚀 Serving API

サーバ起動

```bash
npm run start
```

サーバ起動（ホットリロード）

```bash
npm run dev
```

## 📖 Documentation

### 👀 Overview

[presentation slide](./docs/presentation/Presentation.pdf)

### 🔎 API Docs

サーバーを立ち上げたあとブラウザで [/api-docs](http://localhost:3000/api-docs) にアクセスしてください。

ドキュメントの閲覧のみの場合、[ここ](./docs/swaggerui_html/SwaggerUI_Static_v1.html) から見ることができます。

### 🛝 Playground

サーバを立ち上げたあと、[ルート URL](http://localhost:3000/) へアクセスすることで画面サンプルを見ることができます。

> Chrome では動画の読み込みが遅くなる可能性があります。

## 👮‍♂️ Our Policy

私達は全国の硬派なラジオ体操を求めています。利用に際し以下の条件がありますのでご注意ください。

✅ 推奨事項

- 硬派なラジオ体操動画を投稿すること
- 軟派なラジオ体操を見つけたら管理者に報告すること

🆖 禁止事項

- 存在しない動画 ID を投稿すること
- 軟派なラジオ体操動画を投稿すること
