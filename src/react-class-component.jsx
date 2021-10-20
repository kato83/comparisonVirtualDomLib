import React, {Component} from 'react';
import ReactDom from 'react-dom';
import style from './style.css';

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

    static X = "x";
    static O = "o";
    static DefaultStore = Array(9).fill(null);

    constructor(props) {
        super(props);
        this.state = {
            store: TicTacToe.DefaultStore
        };
    }

    componentDidMount = () => {
        // 非同期の例
        setTimeout(() => {
            const store = jsonParseOrElse(localStorage.getItem("tic-tac-toe"), TicTacToe.DefaultStore)
                .map(key => {
                    if (key === 'x') return TicTacToe.X;
                    if (key === 'o') return TicTacToe.O;
                    return null;
                });
            this.setState({store});
        }, 1000);
    }

    put = ({target}) => {
        const store = [...this.state.store];
        store[target.dataset.index] = TicTacToe.X;
        this.setState(
            {store},
            () => localStorage.setItem("tic-tac-toe", JSON.stringify(this.state.store))
        );
    }

    display = (item) => {
        if (item === null) return null;
        if (item === TicTacToe.X) return "X";
        if (item === TicTacToe.O) return "O";
    }

    mapper = () => [...this.state.store]
        .reduce((prevResult, current, i) => {
            if (i % 3 === 0) {
                prevResult.push([current])
            } else {
                prevResult[prevResult.length - 1].push(current);
            }
            return prevResult;
        }, []);

    render = () => <>
        <table className={style.board}>
            {this.mapper().map((row, x) => <tr>
                {row.map((column, y) => <td
                    className={style.cell}
                    data-index={(x * 3) + (y)}
                    onClick={this.put}>{this.display(column)}</td>)}
            </tr>)}
        </table>
    </>
}

ReactDom.render(<TicTacToe/>, document.getElementById("app"));