# BomberCat
最大４人でリアルタイム対戦できるオンラインゲームです。

インストールせずにブラウザで気軽に遊べます。
## Url
https://bomberman-fawn.vercel.app/
## Demo
![demo](assets/demo.gif)
## 遊び方
対戦ルームを作成、入室し、ゲームを開始します。

↑ → ↓ ← で移動し、SpaceキーでBombを設置できます。

最後まで生き残ると勝利です。

![usage](assets/usage.png)
## 作成理由

#### 自己紹介のため
話下手な作者が自己紹介する際に、人となりを表現し、印象に残る自己紹介をするために作成しました。
#### 気軽に集まれる場所を提供するため
また、以前から気軽に集まれる楽しい場所と作りたいと考えており、

小規模ですがそのような場所を提供するための第一歩になると考え、作成に至りました。
## 使用技術

![tech](assets/tech.drawio.png)
### 開発
- Docker / Docker Compose
- Typescript
- Vite
### バックエンド
- NestJS(NodeJS)
### フロントエンド
- Phaser3
### 通信
- Socket.io
### CI/CD
##### バックエンド
- Google Cloud Build
- Google Cloud Run
##### フロントエンド
- Vercel
## こだわった箇所
### ①Npcのアルゴリズム
ゲームの難易度を上げて面白くするために、

周囲の状況を基に最適な行動を選択する敵キャラを実装しました。
#### <Npcの行動>
- 爆弾を回避
- プレイヤーを攻撃
- アイテムを取得
- 障害物を破壊

#### <経路探索に活用したアルゴリズム>
- **ダイクストラ法**

障害物を考慮して、Npcが移動できる範囲をO(n)で探索するため、後述の優先度付きキューを活用したダイクストラ法を用いました。

- **AStarアルゴリズム**

目標マスへの最適な経路をO(n)で探索するため、後述の優先度付きキューやメモ化を活用したAStarアルゴリズムを用いました。

なお、ヒューリスティックコストにはマンハッタン距離に加えて、後述の影響マップの値を用いることで、ステージの状況をより正確に判断できるように工夫しました。

参考: https://2dgames.jp/a-star/

- **優先度付きキュー**

２分ヒープを用いて、TopをO(1)、PopをO(logn)、InsertをO(logn)で行う優先度付きキューを実装しました。

![priorityqueue](assets/priorityqueue.drawio.png)

- **影響マップ**

戦略的な重要度など、Npcの行動の指標となる評価を空間上に直接マッピングしたものです。

例えば、ステージのそれぞれのマスに対して、アイテムとの距離を評価値としてマッピングしたものを作成して使いました。

参考: https://tech.cygames.co.jp/archives/2272/

### ②通信の仕組み
リアルタイムに情報を共有することが必要なため、Socket.ioを使用しました。

また、タイムタグを減らすためにゲームの状態をサーバのみで管理し、クライアントは描画とキー入力のみを行うようにしました。

![communication](assets/communication.drawio.png)

### ③拡張性
継続的に開発してバージョンアップできるよう、OOPやAbstractFactoryパターンを用いて実装しました。

![uml](assets/stage.drawio.png)

### ④UI
ほっこりするようなデザインの素材を使い、一部素材は自作しました。

## Draft

### 全体の流れ
![flow](assets/flow.png)
### Wireframe
![wireframe](assets/wireframe1.png)
![wireframe](assets/wireframe2.png)

