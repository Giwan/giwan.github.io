import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const socialTools: TTool[] = [
    {
        title: "Mibo",
        url: "https://getmibo.com/",
        description:
            "Social chatting app. Hangout on an island with a group of people and chat. Only works on Chrome browser for now though.",
        price: 0,
        category: subCategories.SOCIAL,
        labels: [labels.social],
    },
]; 

export default socialTools;