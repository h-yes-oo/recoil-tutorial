import React, { FC }from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import CharacterCounter from './components/Counter';
import TodoList from './components/Todo';

const App : FC<{}> = () => {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  );
}

export default App;
