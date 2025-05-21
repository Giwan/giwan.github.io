import React from "react";

const ListItem = ({ name, target }) => {
  return (
    <li className="border-b border-border pb-4 mb-4 last:mb-0 last:border-b-0">
      <a 
        href={target}
        className="font-heading text-xl text-secondary hover:text-accent block transition-colors duration-200"
      >
        {name}
      </a>
    </li>
  );
};

export default ListItem;