import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const wireframeTools: TTool[] = [
    {
        title: "Draw.io",
        url: "https://diagrams.net",
        description: `A simple but powerfull and free diagramming tool.`,
        price: 0,
        category: subCategories.WIREFRAME,
        labels: [labels.productivity, labels.image, labels.diagram]
    }
]

export default wireframeTools; 