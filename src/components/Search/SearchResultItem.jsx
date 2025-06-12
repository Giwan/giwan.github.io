import { Card, CardContent } from "@/components/ui/card";

const SearchResultItem = function ({ result }) {
    return (
        <li>
            <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                    <a
                        href={`/blog/${result.id}`}
                        alt={result.title}
                        className="block hover:no-underline"
                    >
                        <h3 className="font-semibold text-foreground hover:text-accent transition-colors mb-2">
                            {result.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">{result.date}</span>
                    </a>
                </CardContent>
            </Card>
        </li>
    );
};

export default SearchResultItem;
