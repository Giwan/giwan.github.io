import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const dateOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
};

const ArticleHeader = ({ meta, isBlogPost }) => {
    const dateOptionsFiltered = {
        ...dateOptions,
        weekday: isBlogPost ? "long" : undefined,
    };

    const articleDate = meta.published || meta.createdDate;

    return (
        <Card className={cn("border-border bg-card hover:bg-muted/20 transition-colors", !isBlogPost && "cursor-pointer")}>
            <CardHeader>
                <ArticleTitle {...{ isBlogPost, meta }} />
                <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase">
                    <span>{meta.readTime} minutes</span>
                    <span>
                        {new Date(articleDate).toLocaleDateString(
                            "en-GB",
                            dateOptionsFiltered
                        )}
                    </span>
                    <OpenArrow {...{ isBlogPost }} />
                </div>
            </CardHeader>
            {!isBlogPost && meta.description && (
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed opacity-85 hover:opacity-100 transition-opacity">
                        {meta.description}
                    </p>
                </CardContent>
            )}
        </Card>
    );
};

export default ArticleHeader;

const DraftText = () => (
    <Badge variant="secondary" className="ml-2 text-xs">
        DRAFT
    </Badge>
);

const isDraft = (published) => published ? "" : <DraftText />;

const ArticleTitle = ({ isBlogPost, meta: { title, published } }) => (
    <div className={cn("space-y-1", !published && "opacity-75")}>
        {isBlogPost ? (
            <h1 className="text-2xl font-bold font-heading text-foreground leading-tight tracking-tight">
                {title}
                {isDraft(published)}
            </h1>
        ) : (
            <h2 className="text-xl font-semibold font-heading text-foreground leading-tight tracking-tight hover:text-accent transition-colors">
                {title}
                {isDraft(published)}
            </h2>
        )}
    </div>
);

const OpenArrow = ({ isBlogPost }) => {
    if (isBlogPost) return null;

    return (
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 opacity-60 hover:opacity-100 hover:text-accent transition-all">
            <ChevronRight className="h-4 w-4" />
        </Button>
    );
};
