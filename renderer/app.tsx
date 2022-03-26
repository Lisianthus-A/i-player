function App() {
    return (
        <div>
            <div>App</div>
            <button onClick={window.electronAPI.exit}>close</button>
        </div>
    );
}

export default App;
