import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import style from './style.scss';

/**
 * 文字列をJSONに変換を試行し、失敗 or 戻り値が nullable なら elseObj を返却
 * @param mayBeJsonStr JSON を想定する文字列
 * @param elseObj パースに失敗又は戻り値 が nullable な時に返す値
 * @returns {any} オブジェクトリテラル
 */
const jsonParseOrElse = (mayBeJsonStr, elseObj) => {
    try {
        return JSON.parse(mayBeJsonStr) ?? elseObj;
    } catch (_e) {
        return elseObj;
    }
}

class TicTacToe extends Component {

    // propsの型チェック
    // see https://ja.reactjs.org/docs/typechecking-with-proptypes.html
    // TS使ってればこんなの不要
    static propTypes = {
        storageKey: PropTypes.string
    }
    // propsの初期値
    // see https://ja.reactjs.org/docs/typechecking-with-proptypes.html#default-prop-values
    static defaultProps = {
        storageKey: 'tic-tac-toe'
    }

    static DefaultStore = Array(9).fill(null);
    static winPattern = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    constructor(props) {
        super(props);
        this.state = {
            store: TicTacToe.DefaultStore,
            player: 'x',
            message: ''
        };
    }

    /**
     * マウントされたら
     */
    componentDidMount = () => {
        // 非同期の例
        setTimeout(async () => {
            const store = jsonParseOrElse(localStorage.getItem(this.props.storageKey), TicTacToe.DefaultStore);
            await this.setState({store});
            this.isWin('x') && this.setState({message: 'Xの勝利'});
            this.isWin('o') && this.setState({message: 'Oの勝利'});
            this.isDraw() && this.setState({message: '引き分け'});
        }, 500);
    }

    /**
     * セルをクリックされたら
     * @param target クリックしたセル
     */
    put = async ({target}) => {
        if (this.state.store[target.dataset.index]) {
            alert('既に置かれています');
            return;
        }
        if (this.isWin('x') || this.isWin('o')) {
            alert('既に勝敗は決まっています');
            return;
        }

        const store = [...this.state.store];
        const currentPlayer = this.state.player;
        const player = this.inversion(currentPlayer);
        store[target.dataset.index] = currentPlayer;
        localStorage.setItem(this.props.storageKey, JSON.stringify(store));
        // setState は非同期なので await
        await this.setState({store, player});
        this.isWin(currentPlayer) && this.setState({message: `${this.display(currentPlayer)}の勝利`});
        this.isDraw() && this.setState({message: '引き分け'});
    }

    /**
     * 勝利の判定
     * @param player 操作プレーヤー
     * @returns {boolean} 操作プレーヤーが勝利したなら true
     */
    isWin = (player) => {
        const store = this.state.store;
        const playersStore = store.map((cell, i) => cell === player ? i : null);
        return TicTacToe.winPattern
            .some(cells => cells.every(cell => playersStore.includes(cell)));
    }

    /**
     * まだ置く場所が判定
     * @returns {boolean} まだ置く場所があれば true
     */
    canPut = () => !this.state.store.every(Boolean);

    /**
     * 引き分けの判定
     * @returns {boolean} 引き分けなら true
     */
    isDraw = () => !this.canPut() && !this.isWin('x') && !this.isWin('o');

    /**
     * 大文字にして表示
     * @param item localStorage にセットしている値
     * @returns {string | undefined} 大文字にするか null のまま返却
     */
    display = (item) => item?.toUpperCase();

    inversion = (item) => {
        if (item === 'x') return 'o';
        if (item === 'o') return 'x';
        return null;
    }

    /**
     * 描画用に配列を多次元配列に変換する
     * @returns {*} 多次元配列
     */
    mapper = () => [...this.state.store]
        .reduce((prevResult, current, i) => {
            prevResult[Math.floor(i / 3)].push(current);
            return prevResult;
        }, [[], [], []]);

    /**
     * ボードの状態をクリアする
     */
    clear = () => confirm('本当にクリアしますか？') && (() => {
        localStorage.setItem(this.props.storageKey, JSON.stringify(TicTacToe.DefaultStore))
        this.setState({
            store: TicTacToe.DefaultStore,
            player: 'x',
            message: ''
        });
    })();

    render = () => <>
        <p>メッセージ: {this.state.message}</p>
        <table className={style.board}>
            <tbody>
            {this.mapper().map((row, y) => <tr key={y}>
                {row.map((column, x) => <td
                    className={style.cell}
                    data-index={(y * 3) + (x)}
                    key={'' + x + y}
                    onClick={this.put}>{this.display(column)}</td>)}
            </tr>)}
            </tbody>
        </table>
        <button type='button' onClick={this.clear}>Clear</button>
    </>
}

ReactDom.render(<TicTacToe storageKey='tic-tac-toe2'/>, document.getElementById("app"));