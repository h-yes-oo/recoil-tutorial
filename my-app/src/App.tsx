import React, { FC }from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import logo from './logo.svg';
import './App.css';

const textState = atom({
  key: 'textState',
  default: '',
})

const charCountState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  }
})

const TextInput: FC<{}> = () => {
  const [text, setText] = useRecoilState<string>(textState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo : {text}
    </div>
  )
}

const CharacterCount: FC<{}> = () => {
  const count = useRecoilValue(charCountState);

  return <>Chracter Count: {count}</>;
}

const CharacterCounter : FC<Props> = () => {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  )
}

interface Props { };

const App : FC<Props> = () => {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
}

export default App;
