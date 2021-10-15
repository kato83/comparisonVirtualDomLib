import React, {Component} from 'react';
import ReactDom from 'react-dom';

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

    static X = Symbol("x");
    static O = Symbol("o");
    static DefaultStore = Array(9).fill(null);

    constructor(props) {
        super(props);
        const store = jsonParseOrElse(localStorage.getItem("tic-tac-toe"), TicTacToe.DefaultStore)
            .map(key => {
                if (key === 'x') return TicTacToe.X;
                if (key === 'o') return TicTacToe.O;
                return null;
            });
        this.state = {store};
    }

    mapper = () => this.state
        .store
        .reduce((prevResult, current, i) => {
            if (i % 3 === 0) {
                prevResult.push([current])
            } else {
                prevResult[prevResult.length - 1].push(current);
            }
            return prevResult;
        }, []);

    render = () => <>
        <table>
            {this.mapper().map(row => <tr>
                {row.map(column => <td>aaa</td>)}
            </tr>)}
        </table>
    </>
}

ReactDom.render(<TicTacToe/>, document.getElementById("app"));