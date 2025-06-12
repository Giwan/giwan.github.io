import { designPages } from "../../data/designPagesData";
import { Card } from "@/components/ui/card";
const cloudinaryPrefix = "https://res.cloudinary.com/mytoori/image/upload";

const DesignShots = () => (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {designPages.map((page) => (
            <Card key={page.url} className="overflow-hidden hover:shadow-lg transition-shadow">
                <a
                    href={page.url}
                    target="_blank"
                    rel="norel noreferrer"
                    alt={page.description}
                    className="block"
                >
                    <img
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        alt={`${page.url} landing page - ${page.description}`}
                        src={`${cloudinaryPrefix}${page.imgName}`}
                    />
                </a>
            </Card>
        ))}
    </section>
);

export default DesignShots;
