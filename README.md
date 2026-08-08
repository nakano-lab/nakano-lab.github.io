# Nakano Lab Software website

GitHub Pagesで公開する、日英対応のソフトウェア紹介サイトです。

- 公開URL: `https://nakano-lab.github.io/`
- 日本語: `/ja/`
- English: `/en/`
- 外部ビルド処理なし。HTML／CSS／JavaScriptだけで動きます。

## 現在のページ

- wayaknow: 紹介、サポート、プライバシーポリシー、利用規約
- Hashleaf: 日本語・英語の紹介、サポート、プライバシーポリシー、App Storeリンク
- CODO Monitor: 紹介、ダウンロード、マニュアル
- CODO Review: 紹介、ダウンロード
- App 05: 今後のアプリ用プレースホルダー（検索対象外）

## 新しいアプリを追加する

1. `ja/apps/app-5/index.html`と`en/apps/app-5/index.html`を正式な内容へ置き換えます。
2. 日本語・英語トップの`App 05`カードを、アプリ名・説明・対応OSへ変更します。
3. 画像を`assets/images/<app-name>/`へ追加します。
4. 正式公開ページを`sitemap.xml`へ追加し、ページの`noindex`を削除します。
5. 日本語ページと英語ページの相互リンクが同じ内容へ移動することを確認します。

## wayaknowの公開URL

- 紹介（日本語）: `https://nakano-lab.github.io/ja/apps/wayaknow/`
- 紹介（英語）: `https://nakano-lab.github.io/en/apps/wayaknow/`
- サポート: `https://nakano-lab.github.io/ja/apps/wayaknow/support/`
- プライバシーポリシー: `https://nakano-lab.github.io/ja/apps/wayaknow/privacy/`
- 利用規約: `https://nakano-lab.github.io/ja/apps/wayaknow/terms/`

App Store Connectとwayaknowアプリ内のURLは、公開後に上記へ変更してください。

## Hashleafの公開URL

- 紹介（日本語）: `https://nakano-lab.github.io/ja/apps/hashleaf/`
- 紹介（英語）: `https://nakano-lab.github.io/en/apps/hashleaf/`
- サポート（日本語）: `https://nakano-lab.github.io/ja/apps/hashleaf/support/`
- Support (English): `https://nakano-lab.github.io/en/apps/hashleaf/support/`
- プライバシーポリシー（日本語）: `https://nakano-lab.github.io/ja/apps/hashleaf/privacy/`
- Privacy Policy (English): `https://nakano-lab.github.io/en/apps/hashleaf/privacy/`
- App Store: `https://apps.apple.com/us/app/hashleaf/id6794256173`

## ローカル確認

リポジトリのルートで次を実行し、表示されたURLをブラウザで開きます。

```sh
python3 -m http.server 8080
```
