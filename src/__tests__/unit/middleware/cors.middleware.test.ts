import {
    createOriginChecker,
    isOriginAllowed,
    parseAllowedOrigins
} from "../../../middlewares/cors.middleware";

describe("CORS Middleware", () => {
    describe("isOriginAllowed", () => {
        it("allows non-browser requests without an origin", () => {
            expect(
                isOriginAllowed(
                    undefined,
                    [],
                    "production"
                )
            ).toBe(true);
        });

        it("allows explicitly listed origins", () => {
            expect(
                isOriginAllowed(
                    "http://localhost:4200",
                    ["http://localhost:4200"],
                    "production"
                )
            ).toBe(true);
        });

        it("denies unlisted origins in production", () => {
            expect(
                isOriginAllowed(
                    "https://evil.example",
                    ["http://localhost:4200"],
                    "production"
                )
            ).toBe(false);
        });

        it("allows any origin outside production when nothing is configured", () => {
            expect(
                isOriginAllowed(
                    "https://anything.example",
                    [],
                    "development"
                )
            ).toBe(true);
        });

        it("still denies unlisted origins outside production when configured", () => {
            expect(
                isOriginAllowed(
                    "https://anything.example",
                    ["http://localhost:4200"],
                    "development"
                )
            ).toBe(false);
        });
    });

    describe("createOriginChecker", () => {
        it("denies a disallowed origin without raising an error", () => {
            const callback = jest.fn();

            createOriginChecker(
                ["http://localhost:4200"],
                "production"
            )(
                "https://evil.example",
                callback
            );

            // Regression: a CORS policy decision must not surface as a
            // thrown error (which the error middleware turns into a 500).
            expect(callback).toHaveBeenCalledWith(
                null,
                false
            );
        });

        it("allows a configured origin", () => {
            const callback = jest.fn();

            createOriginChecker(
                ["http://localhost:4200"],
                "production"
            )(
                "http://localhost:4200",
                callback
            );

            expect(callback).toHaveBeenCalledWith(
                null,
                true
            );
        });
    });

    describe("parseAllowedOrigins", () => {
        it("returns an empty list when unset", () => {
            expect(
                parseAllowedOrigins(undefined)
            ).toEqual([]);
        });

        it("splits, trims and drops empty entries", () => {
            expect(
                parseAllowedOrigins(
                    "http://localhost:3000, http://localhost:4200 ,"
                )
            ).toEqual([
                "http://localhost:3000",
                "http://localhost:4200"
            ]);
        });
    });
});
