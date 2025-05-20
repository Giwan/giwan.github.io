import styles from "./repos.module.css";

const repoData = [
    {
        name: "github",
        url: "https://github.com/giwan",
    },
    {
        name: "bitbucket",
        url: "https://bitbucket.org/gpersaud",
    },
    {
        name: "gitlab",
        url: "https://gitlab.com/giwan",
    },
];

const Repos = () => (
    <ul className={styles.repoContainer}>
        {repoData.map((rd) => (
            <li key={rd.name}>
                <a href={rd.url} alt={rd.name} target="_blank" rel="noreferrer">
                    <h2>{rd.name}</h2>
                    <div>{rd.url.replace(/https?:\/\//, "")}</div>
                </a>
            </li>
        ))}
    </ul>
);

export default Repos;
