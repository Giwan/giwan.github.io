import styles from "./headernav.module.css";
import { getStyle } from "../../utils/helpers";

const ListItem = ({ name, target }) => (
    <li>
        <a href={target} prefetch={`false`}>
            <span alt={name}>{name}</span>
        </a>
    </li>
);

export default ListItem;
