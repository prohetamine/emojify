import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import styled from 'styled-components'

import emoji from './emoji.json'

function importAll(r) {
  const names = r.keys().map(e => e.match(/\.\/[^\.]+/)[0].replace('./', ''))
  return r.keys().reduce((c, e, k) => {
    c[names[k]] = r(e, k).default
    return c
  }, {})
}

const images = importAll(require.context('./emoji', false, /\.(png|jpe?g|svg)$/));

const Main = styled.div`
  width: 1000000px;
  height: 100vh;
  background: #34a79c;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
`

const Text = styled.div`
  font-family: Tahoma, Pompadur;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 100px;
  color: #000000;
  background: #3e6197;
  height: 150px;
`

const Text2 = styled.div`
  margin-top: 3px;
  font-family: Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  line-height: 100px;
  height: 150px;
  background: #3e6197;
`

String.prototype.charCodeUTF32 = function(){
    return ((((this.charCodeAt(0)-0xD800)*0x400) + (this.charCodeAt(1)-0xDC00) + 0x10000));
};

const Emojify = (props) => {
  const emojiRef = useRef()
  const [size, setSize] = useState([])

  const translateY = (size[2] - size[1]) / 2;

  useEffect(() => {
    const emojiNode = emojiRef.current

    if (emojiNode) {
      const { width, height } = emojiNode.getBoundingClientRect()
      const parentFontSize = parseInt(window.getComputedStyle(emojiNode.parentElement).fontSize)
      setSize([width, height, parentFontSize])
    }
  }, [emojiRef])

  return (
    <span
      ref={emojiRef}
      style={
        size.length > 0
        ? {
            display: 'inline-block',
            height: size[1]+'px',
            width: size[0]+'px'
          }
        : {
          opacity: '0',
          display: 'inline-block',
        }
      }
    >
      {
        size.length > 0
          ? (
            <img
              src={images[emoji[props.children]]}
              style={{ verticalAlign: 'sub',width: size[0]+'px', height: size[0]+'px', transform: `translate(0px, -${size[2] / 10}px)` }}
              alt=""
            />
          )
          : '😋'
      }
    </span>
  )
}

const eArr = Object.keys(emoji)

const App = () => {
  const [state, setState] = useState(30)
  const [length, setLength] = useState(10)
  const [isHide, setHide] = useState(false)

  useEffect(() => {
    setHide(true)
    const timeId = setTimeout(() => {
      setHide(false)
    }, 1)

    return () => clearTimeout(timeId)
  }, [state])

  return (
    <Main>
      {isHide ? null : <Text style={{ fontSize: state+'px' }}>Hello World {eArr.slice(0, length).map((e, key) => (<Emojify key={key}>{e}</Emojify>))}</Text>}
      {isHide ? null : <Text2 style={{ fontSize: state+'px' }}>Hello World {eArr.slice(0, length).join('')}</Text2>}
      <input style={{ position: 'fixed', bottom: '30px' }} type="range" step="1" max="300" min="2" value={state} onChange={({ target: { value } }) => setState(value)}/>
      <input style={{ position: 'fixed', bottom: '30px', left: '300px' }} type="range" step="1" max="3940" min="10" value={length} onChange={({ target: { value } }) => setLength(value)}/>
    </Main>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
