/**
 * CORS origin policy for the product-service.
 *
 * The product-service sits behind the API Gateway, which terminates CORS at
 * the edge. Downstream CORS is defence in depth for direct access, so a
 * disallowed origin must be rejected by *omitting* the CORS headers — never by
 * raising an error, which the error middleware would turn into a 500.
 */

export const isOriginAllowed = (
    origin: string | undefined,
    allowedOrigins: string[],
    nodeEnv: string
): boolean => {
    // Non-browser clients (curl, server-to-server, the gateway) may not send
    // an Origin header at all.
    if (!origin) {
        return true;
    }

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    // Development fallback: allow any origin when nothing is configured.
    return (
        allowedOrigins.length === 0 &&
        nodeEnv !== "production"
    );
};

export type OriginCallback = (
    origin: string | undefined,
    callback: (error: Error | null, allowed?: boolean) => void
) => void;

export const createOriginChecker = (
    allowedOrigins: string[],
    nodeEnv: string
): OriginCallback => {
    return (origin, callback) => {
        // Deny by omitting the CORS headers rather than raising, so a policy
        // decision never becomes a 500 from the error handler.
        callback(
            null,
            isOriginAllowed(origin, allowedOrigins, nodeEnv)
        );
    };
};

export const parseAllowedOrigins = (
    raw: string | undefined
): string[] => {
    if (!raw) {
        return [];
    }

    return raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
};
