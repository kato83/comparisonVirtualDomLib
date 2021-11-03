<template>
  <div>
    <p>メッセージ: {{ message }}</p>
    <table class="board">
      <tbody>
      <tr v-for="(row, y) in mapper" :key="y">
        <td class="cell"
            v-for="(column, x) in row"
            :key="'' + x + y"
            v-bind:data-index="(y * 3) + (x)"
            @click="put">{{ column | display }}
        </td>
      </tr>
      </tbody>
    </table>
    <button type="button" @click="clear">Clear</button>
  </div>
</template>

<style lang="scss" scoped>
@import "style";
</style>

<script>
import Vue from 'vue';

const jsonParseOrElse = (mayBeJsonStr, elseObj) => {
  try {
    return JSON.parse(mayBeJsonStr) ?? elseObj;
  } catch (_e) {
    return elseObj;
  }
}

export default {
  props: {
    storageKey: {
      type: String,
      default: 'tic-tac-toe',
      required: false
    }
  },
  data() {
    return {
      store: Array(9).fill(null),
      player: 'x',
      message: ''
    }
  },
  mounted() {
    // 非同期の例
    setTimeout(() => {
      this.$data.store = jsonParseOrElse(
          localStorage.getItem(this.$props.storageKey),
          Array(9).fill(null)
      );
      if (this.isWin('x')) this.$data.message = 'Xの勝利';
      if (this.isWin('o')) this.$data.message = 'Oの勝利';
      if (this.isDraw()) this.$data.message = '引き分け';
    }, 500);
  },
  computed: {
    /**
     * 描画用に配列を多次元配列に変換する
     * @returns {*} 多次元配列
     */
    mapper: function () {
      return [...this.$data.store]
          .reduce((prevResult, current, i) => {
            prevResult[Math.floor(i / 3)].push(current);
            return prevResult;
          }, [[], [], []]);
    }
  },
  filters: {
    /**
     * 大文字にして表示
     * @param value localStorage にセットしている値
     * @returns {string | undefined} 大文字にするか null のまま返却
     */
    display: function (value) {
      return value?.toUpperCase();
    }
  },
  methods: {

    /**
     * セルをクリックされたら
     * @param target クリックしたセル
     */
    put: function ({target}) {
      if (this.$data.store[target.dataset.index]) {
        alert('既に置かれています');
        return;
      }
      if (this.isWin('x') || this.isWin('o')) {
        alert('既に勝敗は決まっています');
        return;
      }

      const store = [...this.$data.store];
      const currentPlayer = this.$data.player;
      const player = this.inversion(currentPlayer);
      store[target.dataset.index] = currentPlayer;
      localStorage.setItem(this.$props.storageKey, JSON.stringify(store));
      this.$data.store = store;
      this.$data.player = player;
      if (this.isWin(currentPlayer)) {
        this.$data.message = this.$options.filters.display(currentPlayer) + 'の勝利';
      }
      if (this.isDraw()) {
        this.$data.message = '引き分け';
      }
    },

    /**
     * 勝利の判定
     * @param player 操作プレーヤー
     * @returns {boolean} 操作プレーヤーが勝利したなら true
     */
    isWin: function (player) {
      const store = this.$data.store;
      const playersStore = store.map((cell, i) => cell === player ? i : null);
      return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ].some(cells => cells.every(cell => playersStore.includes(cell)));
    },

    /**
     * まだ置く場所が判定
     * @returns {boolean} まだ置く場所があれば true
     */
    canPut: function () {
      return !this.$data.store.every(Boolean);
    },

    /**
     * 引き分けの判定
     * @returns {boolean} 引き分けなら true
     */
    isDraw: function () {
      return !this.canPut() && !this.isWin('x') && !this.isWin('o');
    },

    inversion: function (item) {
      if (item === 'x') return 'o';
      if (item === 'o') return 'x';
      return null;
    },

    /**
     * ボードの状態をクリアする
     */
    clear: function (_e) {
      if (confirm('本当にクリアしますか？')) {
        localStorage.setItem(this.$props.storageKey, JSON.stringify(Array(9).fill(null)))
        this.$data.store = Array(9).fill(null);
        this.$data.player = 'x';
        this.$data.message = '';
      }
    }
  }
};

// 無理矢理？ .vue ファイルを webpack の entry にして vue のエントリーポイント分の js ファイルを不要にする
import('./vue2-component.vue')
    .then(module => new Vue({
      components: {
        'vue2-component': module.default
      },
      el: '#app',
      template: '<vue2-component storageKey="tic-tac-toe2"/>',
    }));
</script>