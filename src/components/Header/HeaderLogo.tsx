/**
 * The site logo - newspaper style masthead
 */
import React from "react";

const HeaderLogo = () => (
    <div className="flex flex-col">
        <div className="mb-2">{Logo()}</div>
    </div>
);

export default HeaderLogo;

function Logo() {
    return (
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-1">
            <a href="/" className="hover:opacity-90 transition-opacity">
                G1
            </a>
        </h1>
    );
}
