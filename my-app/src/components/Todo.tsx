import React, { FC, useState }from 'react';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

interface Todo {
  id: number;
  text: string;
  isComplete: boolean;
}

const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: [],
});

const FilterTypes = {
  ShowAll : 'Show All',
  ShowCompleted : 'Show Completed',
  ShowUncompleted : 'Show Uncompleted',
};

type FilterType = typeof FilterTypes[keyof typeof FilterTypes];

const todoListFilterState = atom<FilterType>({
  key: 'todoListFilterState',
  default: FilterTypes.ShowAll,
});

const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case FilterTypes.ShowCompleted:
        return list.filter((item) => item.isComplete);
      case FilterTypes.ShowUncompleted:
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});

const TodoListFilters: FC<{}> = () => {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  }
  
  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value={FilterTypes.ShowAll}>All</option>
        <option value={FilterTypes.ShowCompleted}>Completed</option>
        <option value={FilterTypes.ShowUncompleted}>Uncompleted</option>
      </select>
    </>
  );
}

let id = 0;
const getId = () => id++;

// input value로 새로운 todolist item을 만들어 todoList에 추가
const TodoItemCreator: FC<{}> = () => {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      }
    ]);
    setInputValue('');
  }

  const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

function replaceItemAtIndex(arr:any[] , index: number, newValue: any) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: any[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

interface TodoItemProps {
  item: Todo;
}

const TodoItem: FC<TodoItemProps> = ({ item }) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  // 현재 아이템의 인덱스를 찾아서 저장
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: event.target.value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

const TodoList: FC<{}> = () => {
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      {/* <TodoListStats /> */}
      <TodoListFilters />
      <TodoItemCreator />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}

export default TodoList;