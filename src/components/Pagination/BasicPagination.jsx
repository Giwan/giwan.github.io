import React from "react";
import { Button } from "@/components/ui/button";

const numberButtons = [1, 2, 3, 4, 5];
const buttons = ["<<", "<", ">", ">>"];

const Pagination = function () {
    return (
        <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                    {numberButtons.map((label) => (
                        <Button 
                            key={label} 
                            variant="outline"
                            size="icon"
                            className="w-10 h-10"
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                <div className="flex space-x-2">
                    {buttons.map((label) => (
                        <Button 
                            key={label} 
                            variant="outline"
                            size="sm"
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pagination;
