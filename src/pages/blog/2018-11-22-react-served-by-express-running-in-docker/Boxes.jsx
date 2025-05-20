import React, { useState } from "react";
import styles from "./boxes.module.css";

const boxesData = [
    {
        label: "ENV_VARS",
        description:
            "The environment variables that are passed into the docker container",
    },
    {
        label: "Docker container",
        description:
            "The docker container receives the environment variables and injects them into the express server when starting it up",
    },
    {
        label: "Express server",
        description:
            "The express server now receives the environment variables which it can send to the front-end",
    },
    {
        label: "Front-end",
        description:
            "The front-end can now request the environment variables before rendering the rest of the app",
    },
];

const Box = ({
    children: { label, description },
    arrow = "➔",
    handleClick,
    isDetail = false,
}) => (
    <button
        onClick={() => handleClick({ label, description })}
        className={styles.box}
    >
        {label} {!isDetail && arrow}
        {isDetail && <div>{description}</div>}
    </button>
);

const Boxes = () => {
    const [currentBox, setCurrentBox] = useState(null);
    const handleClick = (currentBox) => setCurrentBox(currentBox);

    const reset = () => setCurrentBox(null);

    if (currentBox) {
        return (
            <Box handleClick={reset} isDetail={true}>
                {currentBox}
            </Box>
        );
    }

    return (
        <div className={styles.boxesContainer}>
            {boxesData.map((item) => (
                <Box key={item.label} handleClick={handleClick}>
                    {item}
                </Box>
            ))}
        </div>
    );
};

export default Boxes;
