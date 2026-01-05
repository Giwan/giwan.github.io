import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const dataTools: TTool[] = [
    {
        title: "weTransfer",
        url: "https://wetransfer.com/",
        description: "Send large files across the web. The company makes great product and has stellar design. ",
        price: 0,
        category: subCategories.DATA_MANAGEMENT,
        labels: [labels.productivity, labels.email],
    }
];

export default dataTools; 