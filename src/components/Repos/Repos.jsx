import { Card, CardContent } from "@/components/ui/card";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repoData.map((rd) => (
            <Card key={rd.name} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                    <a href={rd.url} alt={rd.name} target="_blank" rel="noreferrer" className="block hover:no-underline">
                        <h2 className="text-lg font-semibold text-foreground hover:text-accent transition-colors mb-2 capitalize">{rd.name}</h2>
                        <div className="text-sm text-muted-foreground">{rd.url.replace(/https?:\/\//, "")}</div>
                    </a>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default Repos;
