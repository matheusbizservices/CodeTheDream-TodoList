// simple header for the todo page
// might add a subtitle later if this app grows a bit

export default function Header() {

const titleText = "Todo List";

// keeping this separate for now instead of inline
// easier to tweak later maybe
return (
    <header className="todo-header">
        <h1>{titleText}</h1>

    </header>
);

}