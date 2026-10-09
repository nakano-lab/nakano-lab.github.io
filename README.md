# Nakano Lab Software website

- 公開URL: [https://nakano-lab.github.io/](https://nakano-lab.github.io/)
- GitHub Pages: `master` ブランチ直下の静的HTML（`.nojekyll`）。

## NeuroPhysMatrix（2026-10-07更新）

- 正規ページ: `/ja/apps/NeuroPhysMatrix/`、`/en/apps/NeuroPhysMatrix/`
- 両言語に紹介・サポート・プライバシーの3ページ。トップページ、canonical、hreflang、サイトマップは新URLへ統一。
- 旧 `/ja/apps/action-potential-dynamics/`、`/en/apps/action-potential-dynamics/` と各 `support/`・`privacy/` は削除せず、対応する新ページへ転送。
- GitHub Pagesの静的ページなので転送は `location.replace` とmeta refreshで実施（HTTP 301ではない）。JavaScript有効時はクエリとフラグメントを維持。無効時もmeta refreshと手動リンクで新ページへ移動できる。
- `assets/images/NeuroPhysMatrix/` のアイコンは選択済みの神経細胞＋活動電位のデザイン。日本語・英語の各8枚は現行Version 1.1 / Build 14のiPad実画面から、掲載用に1800 × 1350 pxへ軽量化。画像内容の合成・トリミングは行っていない。
- 旧画像は削除せず保存。新しい紹介ページからは参照しない。
- 新しい各本文ページでも既存のGoogleタグを維持。転送ページには二重計測を避けるためタグを付けない。
- 新しい商品のレコードやIAPは作成せず、既存App Store ID `6798524754` へのリンクを維持。

確認:

```sh
node scripts/check-neurophysmatrix.mjs
python3 -m http.server 8764 --bind 127.0.0.1
```

PC幅・スマートフォン幅で新ページ、トップページの導線、旧ページからの転送、画像・言語切り替えを確認してから公開する。

## MATLAB道場（2026-10-09追加）

- 商品、プライバシー、サポート: `/ja/apps/MATLABdojo/` とその `privacy/`・`support/`。指定の大文字・小文字を保持。
- 3ページ内に日本語・英語を併記。英語の入口は `#english`。未作成の `/en/` へリンクしない。
- 既存の共通CSS・ナビゲーションを利用し、追加CSSはMATLAB道場のページだけに適用。
- 選択済みの白背景アイコンと、日本語iPad実画面6枚を掲載。スクリーンショットは縦横比を保った軽量化のみで、合成・トリミングなし。
- 現在はApp Store公開準備中。未確認のApp Store IDや価格は記載しない。公開後に各ページの状態表記を更新する。
- AdMob / UMPの処理、端末内の学習記録、同意変更・広告報告、サポートへの任意送信を区別して説明。
- 新しい3ページにはアクセス解析・広告タグを追加していない。共有サイトスクリプトはそのまま利用し、既存アプリの計測タグは変更しない。
- ドメイン直下の `app-ads.txt` に、指定されたAdMobパブリッシャーの販売者レコードを追加。AdMob管理画面のスニペットと照合して検証する。

確認: `node scripts/check-matlab-dojo.mjs`。PC・スマートフォン幅、3ページの相互リンク、英語の入口、画像拡大、問い合わせメールを確認してから公開する。
