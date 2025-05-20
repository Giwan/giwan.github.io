import { isValid } from "../paginationHelpers";

describe("Pagination", () => {

    it("should verify if it's valid when it's on page 1", () => {
        const pageNumber = 1;
        const totalPages = 100;
        expect(isValid(-4, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-2, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-1, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(0, pageNumber, totalPages)).toBe(true);
        expect(isValid(1, pageNumber, totalPages)).toBe(true);
        expect(isValid(2, pageNumber, totalPages)).toBe(true);
        expect(isValid(3, pageNumber, totalPages)).toBe(true);
        expect(isValid(4, pageNumber, totalPages)).toBe(true);
        expect(isValid(5, pageNumber, totalPages)).toBe(true); // this is wrong
    });

    it("should verify if it's valid when it's on page 2", () => {
        const pageNumber = 2;
        const totalPages = 100;
        expect(isValid(-4, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-2, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-1, pageNumber, totalPages)).toBe(true);
        expect(isValid(0, pageNumber, totalPages)).toBe(true);
        expect(isValid(1, pageNumber, totalPages)).toBe(true);
        expect(isValid(2, pageNumber, totalPages)).toBe(true);
        expect(isValid(3, pageNumber, totalPages)).toBe(true);
        expect(isValid(4, pageNumber, totalPages)).toBe(undefined);
    });

    it("should verify if it's valid when it's on page 3", () => {
        const pageNumber = 3;
        const totalPages = 100;
        expect(isValid(-4, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-2, pageNumber, totalPages)).toBe(true);
        expect(isValid(-1, pageNumber, totalPages)).toBe(true);
        expect(isValid(0, pageNumber, totalPages)).toBe(true);
        expect(isValid(1, pageNumber, totalPages)).toBe(true);
        expect(isValid(2, pageNumber, totalPages)).toBe(true);
        expect(isValid(3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(4, pageNumber, totalPages)).toBe(undefined);
    });

    it("should verify if it's valid when it's on page 98", () => {
        const pageNumber = 98;
        const totalPages = 100;
        expect(isValid(-4, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-2, pageNumber, totalPages)).toBe(true);
        expect(isValid(-1, pageNumber, totalPages)).toBe(true);
        expect(isValid(0, pageNumber, totalPages)).toBe(true);
        expect(isValid(1, pageNumber, totalPages)).toBe(true);
        expect(isValid(2, pageNumber, totalPages)).toBe(true);
        expect(isValid(3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(4, pageNumber, totalPages)).toBe(undefined);
    });
    it("should verify if it's valid when it's on page 99", () => {
        const pageNumber = 99;
        const totalPages = 100;
        expect(isValid(-4, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(-3, pageNumber, totalPages)).toBe(true);
        expect(isValid(-2, pageNumber, totalPages)).toBe(true);
        expect(isValid(-1, pageNumber, totalPages)).toBe(true);
        expect(isValid(0, pageNumber, totalPages)).toBe(true);
        expect(isValid(1, pageNumber, totalPages)).toBe(true);
        expect(isValid(2, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(4, pageNumber, totalPages)).toBe(undefined);
    });

    it("should verify if it's valid when it's on page 100", () => {
        const pageNumber = 100;
        const totalPages = 100;
        expect(isValid(-4, pageNumber, totalPages)).toBe(true);
        expect(isValid(-3, pageNumber, totalPages)).toBe(true);
        expect(isValid(-2, pageNumber, totalPages)).toBe(true);
        expect(isValid(-1, pageNumber, totalPages)).toBe(true);
        expect(isValid(0, pageNumber, totalPages)).toBe(true);
        expect(isValid(1, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(2, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(3, pageNumber, totalPages)).toBe(undefined);
        expect(isValid(4, pageNumber, totalPages)).toBe(undefined);
    });
});
