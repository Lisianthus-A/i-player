import "./global.css";
import styles from "./app.module.scss";
import { Header } from './components';

function App() {
    return (
        <div className={styles.app}>
            <Header />
        </div>
    );
}

export default App;
