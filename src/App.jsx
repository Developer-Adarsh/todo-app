import React, { useEffect, useState } from "react";

export default function App() {
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [todos, setTodos] = useState(() => {
    const raw = localStorage.getItem("todos");
    return raw ? JSON.parse(raw) : [];
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddOrSave = () => {
    if (!text.trim()) return;

    if (editingId !== null) {
      const updatedTodos = todos.map((todo) => {
        return todo.id === editingId ? { ...todo, text: text } : todo;
      });
      setTodos(updatedTodos);
      setEditingId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
      };
      setTodos([...todos, newTodo]);
    }
    setText("");
  };

  const handleDelete = (idToDelete) => {
    const filtered = todos.filter((todo) => todo.id !== idToDelete);
    setTodos(filtered);
  };

  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id == id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleClearAll = () => {
    setTodos([]);
    setEditingId(null);
    setText("");
  };

  const filteredTodos = todos.filter((todo) => {
  const matchFilter =
    filter === "done"
      ? todo.completed
      : filter === "pending"
      ? !todo.completed
      : true;

  const searchMatch = todo.text
    .toLowerCase()
    .includes(searchText.toLowerCase());

  return matchFilter && searchMatch;
});

  return (
    <main className="min-h-screen pt-14 mb-10 bg-white text-black  dark:bg-[#121212] dark:text-white px-2 ">
      <div className="border shadow-md mx-auto py-4 px-3 rounded-lg dark:border-gray-600  w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">My Daily Tasks</h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-xs border px-2 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-500 "
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start mt-7">
          <input
            className="border dark:border-gray-600  px-2 py-2 shadow-sm outline-none text-sm  w-full bg-white text-black dark:bg-[#2a2a2a] dark:text-white"
            type="text"
            placeholder="Add task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddOrSave();
              }
            }}
          />
          <div className="flex gap-2 ">
            {editingId !== null && (
            <button
              className="shadow-sm border ml-2 py-2 text-sm px-3 hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-500"
              onClick={() => {
                setEditingId(null);
                setText("");
              }}
            >
              cancel
            </button>
          )}
          <button
            onClick={handleAddOrSave}
            className="shadow-sm border py-2 text-sm px-3 hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-500"
          >
            {editingId !== null ? "Save" : "Add"}
          </button>
          </div>
        </div>
        <div>
          <input
            className="border mb-4 px-2 py-2 shadow-sm outline-none text-sm mt-5 w-full bg-white text-black dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600"
            placeholder="Search task..."
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex gap-3 text-sm my-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 border rounded dark:border-gray-600 ${
              filter === "all"
                ? "bg-gray-200 dark:bg-gray-700 dark:border-gray-500 "
                : ""
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-2 py-1 border rounded dark:border-gray-600 ${
              filter === "done"
                ? "bg-gray-200 dark:bg-gray-700 dark:border-gray-500"
                : ""
            }`}
          >
            ✅ Done
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-2 py-1 border rounded dark:border-gray-600 ${
              filter === "pending"
                ? "bg-gray-200 dark:bg-gray-700 dark:border-gray-500"
                : ""
            }`}
          >
            🕒 Pending
          </button>
        </div>
        <div className="text-sm font-medium mt-1 mb-4">
          Total: {todos.length} | ✅ Done:{" "}
          {todos.filter((t) => t.completed).length} | 🕒 Pending:{" "}
          {todos.filter((t) => !t.completed).length}
        </div>
        <ul className="border rounded-lg dark:border-gray-600">
  {filteredTodos.length === 0 ? (
    <li className="text-center text-sm text-gray-400 py-4">
      🎉 No tasks found. Add your first task!
    </li>
  ) : (
    filteredTodos.map((todo) => (
      <li
        key={todo.id}
        className="flex items-center justify-between shadow-sm border-b w-full py-2 px-3 mt-1 font-serif text-sm  hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <label className="flex items-center">
          <input
            className="mr-3 cursor-pointer accent-gray-700 dark:accent-green-400"
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
          />
          <span
            className={todo.completed ? "line-through text-gray-400" : ""}
          >
            {todo.text}
          </span>
        </label>
        <label className="flex items-center gap-3">
          <button
            onClick={() => handleDelete(todo.id)}
            className="border rounded-full flex items-center justify-center h-5 w-5 text-xs hover:bg-gray-400 dark:hover:bg-gray-600 sm:h-4 sm:w-4"
          >
            x
          </button>
          <button
            onClick={() => {
              setEditingId(todo.id);
              setText(todo.text);
            }}
            className="text-xs hover:-scale-125 rounded-full"
          >
            ✏️
          </button>
        </label>
      </li>
    ))
  )}
</ul>

        <div className=" sm:text-right text-center">
          <button
            onClick={handleClearAll}
            className="mt-4 px-3 py-1  text-sm rounded text-red-500 hover:text-red-600 border border-red-400 dark:hover:bg-gray-800 dark:border-gray-400 "
          >
            Clear All
          </button>
        </div>
      </div>
    </main>
  );
}
