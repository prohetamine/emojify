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
  font-family: Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  background: #3e6197;
  margin-top: 3px;
`

const Text3 = styled(ContentEditable)`
  font-family: Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  background: #3e6197;
  margin-top: 3px;
`

const Text2 = styled.div`
  margin-top: 3px;
  font-family: Tahoma;
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
  font-family: Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
  caret-color: rgb(0, 200, 0);
  padding: 0px;
`

const Textarea_2 = styled.div`
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
  font-family: Tahoma;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  color: #000000;
`

//    - good

const Emojify = (props) => {
  const image = images[emoji[props.children]]
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: 'text'
      }}
    >
      <span style={{ opacity: 0 }}>﹢</span>
      <span
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url('${image}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          boxSizing: 'border-box'
        }}
      ></span>
    </span>
  )
}

const Textarea = ({ style, value, onChange }) => {
  const ref = useRef()
  const [state, setState] = useState(value)
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
    const replaceEmoji = value.match(regexp) || []

    let _s = value.replace(/\n/gi, '<br />')

    if (replaceEmoji.length > 0) {
      Object.keys(replaceEmoji.reduce((ctx, e) => {
        ctx[e] = true
        return ctx
      }, {})).forEach(e => {
        const regexp = new RegExp(e, 'gi')
        if (images[emoji[e]]) {
          _s = _s.replace(regexp, `<span style="position: relative; display: inline-flex; justify-content: center; align-items: center; overflow: hidden; cursor: text;"><span style="opacity: 0; line-height: 100%;">﹢</span><span style="position: absolute; width: 100%; height: 100%; background-image: url('${images[emoji[e]]}'); background-repeat: no-repeat; background-position: center center; background-size: contain; box-sizing: border-box;"></span></span>`)
        }
      })
    }

    setState(_s)
  }, [value])

  useEffect(() => {
    const node = ref.current

    if (node) {
      if (node.innerHTML.length === 0) {
        node.innerHTML = value
      }
    }
  }, [ref, value])

  return (
    <MainTextarea>
      <Textarea_2
        style={style}
        contentEditable={true}
        dangerouslySetInnerHTML={{__html: state }}
      >
      </Textarea_2>
      <Textarea_2
        style={{ ...style, color: '#ff00007f', color: 'transparent', textShadow: '0 0 0 transparent', caretColor: '#000' }}
        contentEditable='plaintext-only'
        ref={ref}
        onInput={({ target: { innerHTML } }) => onChange(innerHTML)}
      >
      </Textarea_2>
    </MainTextarea>
  )
}

const eArr = Object.keys(emoji)

const App = () => {
  const [state, setState] = useState(30)
  const [stateTextarea, setTextareaState] = useState(`2345678😀😢😳😳👨‍💻🦄😆💏🐳sadasasdasd s 😀😢😳😳👨‍💻🦄😆💏🐳🐠 asds😀😢😳😳👨‍💻🦄😆💏🐳🐠asdsadsa`)
  const [length, setLength] = useState(10)

  return (
    <Main>
      <Textarea style={{ fontSize: state+'px' }} value={stateTextarea} onChange={value => setTextareaState(value)} />
      <Text style={{ fontSize: state+'px' }}>Hello World {eArr.slice(2, length).map((e, key) => (<Emojify key={key}>{e}</Emojify>))}</Text>
      <Text style={{ fontSize: state+'px' }}>Hello World {eArr.slice(2, length).join('')}</Text>
      <input style={{ position: 'fixed', bottom: '30px' }} type="range" step="1" max="300" min="2" value={state} onChange={({ target: { value } }) => setState(value)}/>
      <input style={{ position: 'fixed', bottom: '30px', left: '300px' }} type="range" step="1" max="3940" min="10" value={length} onChange={({ target: { value } }) => setLength(value)}/>
    </Main>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
