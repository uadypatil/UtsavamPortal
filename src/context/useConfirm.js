import { useContext } from "react";
import ConfirmContext from "./ConfirmDialogContext";

export default function useConfirm() {
    const confirm = useContext(ConfirmContext);

    if (!confirm) {
        return ({ message = "Are you sure?" } = {}) =>
            Promise.resolve(window.confirm(message));
    }

    return confirm;
}