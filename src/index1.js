import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import styled from 'styled-components'
import ContentEditable from 'react-contenteditable'
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
  font-family: Pompadur, Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  background: #3e6197;
  margin-top: 3px;
`

const Text3 = styled(ContentEditable)`
  font-family: Pompadur, Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  background: #3e6197;
  margin-top: 3px;
`

const Text2 = styled.div`
  margin-top: 3px;
  font-family: Pompadur, Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  background: #3e6197;
`

const MainTextarea = styled.div`
  width: 1000px;
  height: 400px;
  background: #3e6197;
  position: relative;
  overflow: hidden;
`

const Textarea_ = styled.textarea`
  position: absolute;
  left: 0px;
  top: 0px;
  background: #00000000;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  border: none;
  outline: none;
  font-family: Pompadur, Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  caret-color: rgb(0, 200, 0);
  padding: 0px;
`

const Textarea_2 = styled(ContentEditable)`
  position: absolute;
  left: 0px;
  top: 0px;
  background: #00000000;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  user-select: none;
  resize: none;
  border: none;
  outline: none;
  font-family: Pompadur, Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
`

const Emojify = (props) => {
  const emojiRef = useRef()
  const [size, setSize] = useState([])

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
      suppressContentEditableWarning={false}
      contentEditable={false}
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
              draggable="false"
              style={{
                userDrag: 'none',
                verticalAlign: 'sub',
                width: size[0]+'px',
                height: size[0]+'px',
                transform: `translate(0px, -${size[2] / 10}px)`
              }}
              alt={props.children}
            />
          )
          : '😀'
      }
    </span>
  )
}

const eArr = Object.keys(emoji)


const Textarea = () => {
  const [state, setState] = useState('')
  const [_state, _setState] = useState('👨‍💻🦄 ты лох 🧠💻😆💏😳👍😁➗➗🐳dsdf dsf sd🧠💻😆💏😳👍😁➗➗🐳dsfsdfsdfsd 🧠💻😆💏😳👍😁➗➗🐳🐠 🇸🇴🇸🇬🇸🇹🇷🇪🇵🇭 dsdfsd lol kek dev')
  const refScroll = React.useRef()
  const refMain = React.useRef()

  useEffect(() => {
    const nodeRefScroll = refScroll.current
    const nodeRefMain = refMain.current

    if (nodeRefScroll && nodeRefMain) {
      const hander = (e) => {
        nodeRefScroll.style.top = -e.target.scrollTop + 'px'
      }

      nodeRefMain.addEventListener('scroll', hander)
      return () => nodeRefMain.removeEventListener('scroll', hander)
    }
  }, [refScroll, refMain])

  useEffect(() => {
    const regexp = new RegExp('\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)+|\\p{EPres}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?|\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})', 'gu')
    const replaceEmoji = _state.match(regexp) || []

    let _s = _state.replace(/\n/gi, '<br />')

    if (replaceEmoji.length > 0) {
      Object.keys(replaceEmoji.reduce((ctx, e) => {
        ctx[e] = true
        return ctx
      }, {})).forEach(e => {
        const regexp = new RegExp(e, 'gi')
        if (images[emoji[e]]) {
          _s = _s.replace(regexp, `<span contenteditable="false" style="display: inline-block; height: 39px; width: 30px;"><img src="${images[emoji[e]]}" draggable="false" style="vertical-align: sub; width: 30px; height: 30px; transform: translate(0px, -3px);"></span>`)
        }
      })
    }

    setState(_s)
  }, [_state])

  return (
    <MainTextarea>
      <Textarea_2
        html={state}
        disabled={true}
        innerRef={refScroll}
      ></Textarea_2>
      <Textarea_
        ref={refMain}
        style={{ color: '#00000000', caretColor: 'rgb(0, 0, 0)' }}
        value={_state}
        onChange={({ target: { value } }) => _setState(value)}
      ></Textarea_>
    </MainTextarea>
  )
}

const App = () => {
  const ref = React.useRef()
  const [state, setState] = useState(30)
  const [_state, _setState] = useState('Hello World <span contenteditable="false" style="display: inline-block; height: 39px; width: 30px;"><img src="/emojify/static/media/face with hand over mouth.ef80db7a.png" draggable="false" alt="🤭" style="vertical-align: sub; width: 30px; height: 30px; transform: translate(0px, -3px);"></span> 🍆 lol 🧠 kekys kek 👨‍💻🦄 ты лох')
  const [length, setLength] = useState(10)
  const [isHide, setHide] = useState(false)

  useEffect(() => {
    setHide(true)
    const timeId = setTimeout(() => {
      setHide(false)
    }, 1)

    return () => clearTimeout(timeId)
  }, [state])

  useEffect(() => {
    const regexp = new RegExp('\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)+|\\p{EPres}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?|\\p{Emoji}(\\p{EMod}+|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})', 'gu')
    const lol = _state.match(regexp)

    const replaceEmoji = lol.map(e => [e, _state.match(new RegExp(e)).index]).filter(e => {
      const i  = _state.match(new RegExp(e[0])).index

      return `${_state[i - 5]}${_state[i - 4]}${_state[i - 3]}${_state[i - 2]}${_state[i - 1]}` !== 'alt="'
    })

    if (replaceEmoji.length > 0) {
      _setState(s => {
        let _s = s

        replaceEmoji.forEach(e => {
          _s = _s.slice(0, e[1]-1) + _s.slice(e[1]-1).replace(e[0], `<span contenteditable="false" style="display: inline-block; height: 39px; width: 30px;"><img src="${images[emoji[e[0]]]}" draggable="false" alt="${e[0]}" style="vertical-align: sub; width: 30px; height: 30px; transform: translate(0px, -3px);"></span>`)
        })

        return _s
      })
    }

  }, [_state])

  return (
    <Main>
      <Textarea />
      {isHide
        ? null
        : <Text3
            style={{ fontSize: state+'px' }}
            html={_state}
            disabled={false}
            onChange={({ target: { value } }) => _setState(value)}
          >
          </Text3>
      }
      {isHide ? null : <Text style={{ fontSize: state+'px' }}>Hello World {[...eArr].slice(0, length).map((e, key) => (<Emojify key={key}>{e}</Emojify>))}</Text>}
      {isHide ? null : <Text2 style={{ fontSize: state+'px' }}>Hello World {[...eArr].slice(0, length).join('')}</Text2>}
      <input style={{ position: 'fixed', bottom: '30px' }} type="range" step="1" max="300" min="2" value={state} onChange={({ target: { value } }) => setState(value)}/>
      <input style={{ position: 'fixed', bottom: '30px', left: '300px' }} type="range" step="1" max="3940" min="10" value={length} onChange={({ target: { value } }) => setLength(value)}/>
    </Main>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
