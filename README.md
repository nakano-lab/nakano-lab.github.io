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
