import React from "react";
import { button, basicPaginationContainer } from "./Pagination.module.css";

const numberButtons = [1, 2, 3, 4, 5];
const buttons = ["<<", "<", ">", ">>"];

const Pagination = function () {
    return (
        <div className="bg-background-light rounded-lg p-6 border border-border shadow-lg">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                    {numberButtons.map((label) => (
                        <button 
                            key={label} 
                            className="w-10 h-10 bg-background hover:bg-syntax-purple text-text-primary hover:text-background border border-border rounded transition-all duration-200 font-medium hover:shadow-md focus:ring-2 focus:ring-syntax-purple focus:outline-none"
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex space-x-2">
                    {buttons.map((label) => (
                        <button 
                            key={label} 
                            className="px-3 py-2 bg-background hover:bg-accent text-text-primary hover:text-background border border-border rounded transition-all duration-200 font-medium hover:shadow-md focus:ring-2 focus:ring-accent focus:outline-none"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pagination;
