import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
            <Button
                onClick={() => handleClick({ label, description })}
                variant="ghost"
                className="w-full h-auto p-0 justify-start text-left"
            >
                <div className="w-full">
                    <div className="font-semibold">
                        {label} {!isDetail && <span className="text-accent ml-2">{arrow}</span>}
                    </div>
                    {isDetail && <div className="text-sm text-muted-foreground mt-2">{description}</div>}
                </div>
            </Button>
        </CardContent>
    </Card>
);

const Boxes = () => {
    const [currentBox, setCurrentBox] = useState(null);
    const handleClick = (currentBox) => setCurrentBox(currentBox);

    const reset = () => setCurrentBox(null);

    if (currentBox) {
        return (
            <div className="max-w-2xl mx-auto">
                <Box handleClick={reset} isDetail={true}>
                    {currentBox}
                </Box>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {boxesData.map((item) => (
                <Box key={item.label} handleClick={handleClick}>
                    {item}
                </Box>
            ))}
        </div>
    );
};

export default Boxes;
