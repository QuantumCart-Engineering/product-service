export interface CursorData {
    createdAt: string;
    id: string;
}

/**
 * Encode cursor data into a base64 string.
 */
export const encodeCursor = (
    data: CursorData
): string => {
    return Buffer
        .from(
            JSON.stringify(data),
            "utf-8"
        )
        .toString("base64url");
};

/**
 * Decode a cursor string.
 *
 * Throws a normal Error when the cursor
 * is invalid. Controller can convert this
 * into an AppError response.
 */
export const decodeCursor = (
    cursor: string
): CursorData => {
    try {
        const decoded =
            Buffer
                .from(
                    cursor,
                    "base64url"
                )
                .toString("utf-8");

        const data =
            JSON.parse(decoded) as CursorData;

        if (
            !data ||
            typeof data !== "object" ||
            typeof data.createdAt !==
                "string" ||
            typeof data.id !==
                "string" ||
            !data.createdAt ||
            !data.id
        ) {
            throw new Error(
                "Invalid cursor"
            );
        }

        return data;
    } catch {
        throw new Error(
            "Invalid cursor"
        );
    }
};