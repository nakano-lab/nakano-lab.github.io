# Nakano Lab Software website

- 公開URL: [https://nakano-lab.github.io/](https://nakano-lab.github.io/)
- GitHub Pages: `master` ブランチ直下の静的HTML（`.nojekyll`）。

## MATLAB道場: 審査用の限定案内（2026-10-09）

`/ja/apps/MATLABdojo/`と、その`privacy/`・`support/`はHTTP 200で直接アクセスできます。本文・画像・相互リンクと`app-ads.txt`は維持し、トップページのアプリ一覧・メニュー・説明文、サイトマップからは除外しています。3ページには一時的に`noindex, follow`を設定しています。認証やアクセス制限ではなく、URLを知っている人は閲覧可能です。

審査完了後の正式案内時は、アプリ一覧・メニュー・サイトマップへの掲載を戻し、3ページの`noindex`を外してください。App Store公開URL等も実際の公開状態と照合し、`scripts/check-matlab-dojo.mjs`の限定案内チェックを正式案内用に更新します。審査の監視や自動切り替えは設定していません。

確認: `node scripts/check-matlab-dojo.mjs`。他アプリの回帰確認: `node scripts/check-neurophysmatrix.mjs`。
