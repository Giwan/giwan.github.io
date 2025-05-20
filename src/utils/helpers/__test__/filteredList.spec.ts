import filteredList from "../filteredList";

describe("filtered list ", () => {
    it("should return the parent object if the label was found", () => {
        const toolTemplate = {
            category: "",
            title: "",
            url: "",
            description: "",
            price: 0,
            labels: [""]
        }

        let tools = [{ ...toolTemplate }];
        expect(filteredList(tools)).toEqual(tools);
        expect(filteredList(tools, "design")).toEqual([]);

        tools = [
            {
                ...toolTemplate,
                category: "design",
            },
        ];
        expect(filteredList(tools, "design")).toEqual(tools);

        tools.push({ ...toolTemplate, category: "writing" });
        expect(filteredList(tools, "writing")).toMatchObject([
            { category: "writing" },
        ]);
        expect(filteredList(tools, "design")).toMatchObject([{ category: "design" }]);
    });
});
