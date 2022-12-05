import { useShell } from "../utils/shellProvider";
import {auth} from '../utils/firebase'

export const ShellPrompt = () => {
    const { directory } = useShell();
    let name = auth.currentUser != null ? auth.currentUser.displayName : "guest";
    name = name.replace(/\s/g, ''); //get rid of white space

    return (
        <span>{name + "@devchat:" + directory +"$"}</span>
    )
}

export default ShellPrompt;