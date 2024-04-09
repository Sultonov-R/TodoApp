import React, { useEffect, useState } from "react";
import "./App.css";

interface TodoItem {
  id: number;
  text: string;
  checked: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputVal, setInputVal] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [editMode, setEditMode] = useState<number | null>(null);

  useEffect(() => {
    const storedItem = localStorage.getItem("todosLocal");
    if (storedItem) {
      const parsedItem: TodoItem[] = JSON.parse(storedItem);
      setTodos(parsedItem);
    }
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(event.target.value);
  }

  function handleAddBtn(event: React.FormEvent) {
    event.preventDefault();
    if (inputVal.length === 0) {
      alert("Please add todo");
      return;
    }
    const todo: TodoItem = {
      id: Date.now(),
      text: inputVal,
      checked: false,
    };
    setTodos([...todos, todo]);
    localStorage.setItem("todosLocal", JSON.stringify([...todos, todo]));
    setInputVal("");
  }

  function handleCheckInput(id: number) {
    const updatedItem = todos.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setTodos(updatedItem);
  }

  function handleDeleteBtn(id: number) {
    const localTodos: string | null = localStorage.getItem("todosLocal");

    if (localTodos) {
      const todos: TodoItem[] = JSON.parse(localTodos);
      const updatedTodos: TodoItem[] = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem("todosLocal", JSON.stringify(updatedTodos));
    }
  }

  function handleEditBtn(id: number) {
    const updatedItem = todos.map((item) =>
      item.id === id ? { ...item, text: editText } : item
    );
    setTodos(updatedItem);
    setEditMode(id);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditText(event.target.value);
  }

  function handleSaveBtn(id: number) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    );
    setTodos(updatedTodos);
    setEditMode(null);
  }

  return (
    <>
      <div className="todo-wrapper">
        <h2 className="title">Todo list</h2>
        <form className="form">
          <input
            className="input-style"
            type="text"
            placeholder="Enter todo..."
            value={inputVal}
            onChange={handleInputChange}
          />
          <button onClick={handleAddBtn}>Add</button>
        </form>

        <ul className="ul-style">
          {todos &&
            todos.map((item) => (
              <li className="li-style" key={item.id}>
                {editMode === item.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                  />
                ) : (
                  <div className="check-box-style">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckInput(item.id)}
                    />
                    <p
                      style={{
                        textDecoration: item.checked ? "line-through" : "none",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                )}
                <div className="span-style">
                  {editMode === item.id ? (
                    <span className="saveSpan" onClick={() => handleSaveBtn(item.id)}>
                      <img width={30} src="https://www.freeiconspng.com/thumbs/check-tick-icon/check-green-tick-icon-8.png" alt="pro" />
                    </span>
                  ) : (
                    <span className="editSpan" onClick={() => handleEditBtn(item.id)}>
                      <img width={30} src="https://static-00.iconduck.com/assets.00/edit-pencil-icon-2045x2048-iylo4la2.png" alt="pro" />
                    </span>
                  )}
                  <span className="deleteSpan" onClick={() => handleDeleteBtn(item.id)}>
                    <img width={30} src="https://cdn-icons-png.flaticon.com/256/12319/12319540.png" alt="" />
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default App;
