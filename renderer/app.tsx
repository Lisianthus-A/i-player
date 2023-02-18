import "./global.css";
import styles from "./app.module.scss";
import { Header, Canvas, Controler } from "@/components";

function App() {
    return (
        <div className={styles.app}>
            <Header />
            <Canvas />
            <Controler />
        </div>
    );
}

export default App;
