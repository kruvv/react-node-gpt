import styles from './Loader.module.css';
import {PulseLoader} from "react-spinners";

// interface LoaderType  {
//     // isTyping: boolean
// }

const Loader/*: React.FC<LoaderType>*/ = (/*{isTyping}*/) => {

    return (
        <div className={styles.loader}>
            {/*<span><b className={styles.label}>ASSISTANT</b></span>*/}
            {/*<span>:</span>*/}
            {/*<span></span>*/}
            <PulseLoader
                color="#b1b1b1"
                cssOverride={{}}
                loading
                margin={3}
                size={10}
                speedMultiplier={1}
            />
        </div>

    );
};

export default Loader;