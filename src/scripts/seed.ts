/**
 * DEVELOPMENT SEED
 *
 * Populates the product database with a small, realistic electronics
 * catalogue so the storefront can be exercised locally.
 *
 * This script is:
 *   - opt-in (never invoked automatically by the service or by migrations)
 *   - idempotent (safe to run repeatedly; it upserts by unique slug/sku)
 *   - non-destructive (it never deletes or resets existing rows)
 *
 * Run with: npm run seed
 */
import { randomUUID } from "crypto";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import pool from "../config/database";

interface IdRow extends RowDataPacket {
    id: string;
}

interface SeedCategory {
    name: string;
    slug: string;
    description: string;
}

interface SeedProduct {
    name: string;
    sku: string;
    description: string;
    price: number;
    stockQuantity: number;
    status: "ACTIVE" | "OUT_OF_STOCK";
    categorySlugs: string[];
}

const categories: SeedCategory[] = [
    {
        name: "Mobiles",
        slug: "mobiles",
        description: "Smartphones and feature phones for every budget."
    },
    {
        name: "Laptops",
        slug: "laptops",
        description: "Ultrabooks, creator laptops and everyday notebooks."
    },
    {
        name: "Audio",
        slug: "audio",
        description: "Headphones, earbuds and speakers with rich sound."
    },
    {
        name: "Accessories",
        slug: "accessories",
        description: "Chargers, cables and everyday carry essentials."
    },
    {
        name: "Wearables",
        slug: "wearables",
        description: "Smart watches and fitness bands."
    },
    {
        name: "Cameras",
        slug: "cameras",
        description: "Mirrorless, action and vlogging cameras."
    },
    {
        name: "Gaming",
        slug: "gaming",
        description: "Consoles and gaming peripherals."
    },
    {
        name: "Smart Home",
        slug: "smart-home",
        description: "Hubs, lighting and connected home devices."
    }
];

const products: SeedProduct[] = [
    {
        name: "Aurora X5 Pro 5G",
        sku: "QC-MOB-AX5P",
        description:
            "Flagship 6.7-inch 120Hz display, triple camera and all-day battery.",
        price: 74999,
        stockQuantity: 24,
        status: "ACTIVE",
        categorySlugs: ["mobiles"]
    },
    {
        name: "Aurora X5 5G",
        sku: "QC-MOB-AX5",
        description:
            "Balanced 5G performer with a bright OLED panel and fast charging.",
        price: 54999,
        stockQuantity: 40,
        status: "ACTIVE",
        categorySlugs: ["mobiles"]
    },
    {
        name: "Nova Lite 4G",
        sku: "QC-MOB-NVL",
        description:
            "Everyday phone with a large battery and clean, dependable software.",
        price: 18999,
        stockQuantity: 60,
        status: "ACTIVE",
        categorySlugs: ["mobiles"]
    },
    {
        name: "Quantum Book Pro 14",
        sku: "QC-LAP-QBP14",
        description:
            "14-inch productivity laptop with a vivid display and all-day battery.",
        price: 129999,
        stockQuantity: 15,
        status: "ACTIVE",
        categorySlugs: ["laptops"]
    },
    {
        name: "Quantum Book Air 13",
        sku: "QC-LAP-QBA13",
        description:
            "Lightweight, silent and fast — built for work on the move.",
        price: 94999,
        stockQuantity: 22,
        status: "ACTIVE",
        categorySlugs: ["laptops"]
    },
    {
        name: "Aero Creator 16",
        sku: "QC-LAP-AC16",
        description:
            "Colour-accurate 16-inch screen with desktop-class performance.",
        price: 149999,
        stockQuantity: 8,
        status: "ACTIVE",
        categorySlugs: ["laptops"]
    },
    {
        name: "PulsePods Pro ANC",
        sku: "QC-AUD-PPP",
        description:
            "Wireless earbuds with adaptive noise cancellation and spatial audio.",
        price: 19999,
        stockQuantity: 50,
        status: "ACTIVE",
        categorySlugs: ["audio"]
    },
    {
        name: "PulsePods Lite",
        sku: "QC-AUD-PPL",
        description:
            "Comfortable everyday earbuds with clear calls and long playback.",
        price: 7999,
        stockQuantity: 80,
        status: "ACTIVE",
        categorySlugs: ["audio"]
    },
    {
        name: "Resonate Studio Headphones",
        sku: "QC-AUD-RSH",
        description:
            "Over-ear headphones tuned for balanced, room-filling sound.",
        price: 24999,
        stockQuantity: 18,
        status: "ACTIVE",
        categorySlugs: ["audio"]
    },
    {
        name: "BoomBox Mini Speaker",
        sku: "QC-AUD-BBM",
        description:
            "Pocket-sized Bluetooth speaker with surprising bass and IPX7 rating.",
        price: 4999,
        stockQuantity: 45,
        status: "ACTIVE",
        categorySlugs: ["audio"]
    },
    {
        name: "65W GaN Fast Charger",
        sku: "QC-ACC-GAN65",
        description:
            "Compact 65W charger that powers a laptop and phone at the same time.",
        price: 2999,
        stockQuantity: 120,
        status: "ACTIVE",
        categorySlugs: ["accessories"]
    },
    {
        name: "USB-C Braided Cable 2m",
        sku: "QC-ACC-UCB2",
        description:
            "Durable braided cable rated for fast charging and data transfer.",
        price: 799,
        stockQuantity: 300,
        status: "ACTIVE",
        categorySlugs: ["accessories"]
    },
    {
        name: "Wireless Charging Pad",
        sku: "QC-ACC-WCP",
        description:
            "Slim 15W wireless pad with a non-slip surface and case-friendly coil.",
        price: 1999,
        stockQuantity: 90,
        status: "ACTIVE",
        categorySlugs: ["accessories"]
    },
    {
        name: "Everyday Backpack 20L",
        sku: "QC-ACC-BP20",
        description:
            "Water-resistant 20L backpack with a padded laptop sleeve.",
        price: 3499,
        stockQuantity: 35,
        status: "ACTIVE",
        categorySlugs: ["accessories"]
    },
    {
        name: "Pulse Watch 2",
        sku: "QC-WEA-PW2",
        description:
            "Smart watch with health tracking, GPS and a bright always-on display.",
        price: 24999,
        stockQuantity: 30,
        status: "ACTIVE",
        categorySlugs: ["wearables"]
    },
    {
        name: "Pulse Band 5",
        sku: "QC-WEA-PB5",
        description:
            "Lightweight fitness band with 14-day battery and sleep insights.",
        price: 3499,
        stockQuantity: 70,
        status: "ACTIVE",
        categorySlugs: ["wearables"]
    },
    {
        name: "Orbit Mirrorless M1",
        sku: "QC-CAM-OMM1",
        description:
            "24MP mirrorless camera with 4K video and in-body stabilisation.",
        price: 89999,
        stockQuantity: 10,
        status: "ACTIVE",
        categorySlugs: ["cameras"]
    },
    {
        name: "Action Cam 5K",
        sku: "QC-CAM-AC5K",
        description:
            "Rugged 5K action camera with waterproof housing and stabilisation.",
        price: 34999,
        stockQuantity: 0,
        status: "OUT_OF_STOCK",
        categorySlugs: ["cameras"]
    },
    {
        name: "Nebula Console X",
        sku: "QC-GAM-NCX",
        description:
            "4K gaming console with an ultra-fast SSD and immersive controller.",
        price: 49999,
        stockQuantity: 12,
        status: "ACTIVE",
        categorySlugs: ["gaming"]
    },
    {
        name: "Pro Wireless Controller",
        sku: "QC-GAM-PWC",
        description:
            "Low-latency wireless controller with adjustable triggers.",
        price: 6499,
        stockQuantity: 55,
        status: "ACTIVE",
        categorySlugs: ["gaming"]
    },
    {
        name: "Smart Hub Mini",
        sku: "QC-SMH-SHM",
        description:
            "Compact hub that connects lights, sensors and appliances in one app.",
        price: 5999,
        stockQuantity: 40,
        status: "ACTIVE",
        categorySlugs: ["smart-home"]
    },
    {
        name: "Smart LED Bulb (2-pack)",
        sku: "QC-SMH-LED2",
        description:
            "16-million-colour bulbs with scheduling and voice control.",
        price: 1299,
        stockQuantity: 150,
        status: "ACTIVE",
        categorySlugs: ["smart-home"]
    },
    {
        name: "Security Camera 2K",
        sku: "QC-SMH-SC2K",
        description:
            "Indoor 2K camera with night vision, motion alerts and two-way audio.",
        price: 4499,
        stockQuantity: 33,
        status: "ACTIVE",
        categorySlugs: ["smart-home"]
    }
];

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const seedCategories = async (
    connection: PoolConnection
): Promise<Map<string, string>> => {
    const idBySlug = new Map<string, string>();

    for (const category of categories) {
        await connection.execute(
            `
                INSERT INTO categories (
                    id,
                    name,
                    slug,
                    description,
                    status
                )
                VALUES (?, ?, ?, ?, 'ACTIVE')
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    description = VALUES(description),
                    status = VALUES(status)
            `,
            [
                randomUUID(),
                category.name,
                category.slug,
                category.description
            ]
        );

        const [rows] = await connection.execute<
            IdRow[]
        >(
            "SELECT id FROM categories WHERE slug = ?",
            [category.slug]
        );

        if (rows.length > 0) {
            idBySlug.set(
                category.slug,
                rows[0].id
            );
        }
    }

    return idBySlug;
};

const seedProducts = async (
    connection: PoolConnection,
    categoryIdBySlug: Map<string, string>
): Promise<number> => {
    let created = 0;

    for (const product of products) {
        const slug = slugify(product.name);

        await connection.execute(
            `
                INSERT INTO products (
                    id,
                    sku,
                    name,
                    slug,
                    description,
                    price,
                    stock_quantity,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    slug = VALUES(slug),
                    description = VALUES(description),
                    price = VALUES(price),
                    stock_quantity = VALUES(stock_quantity),
                    status = VALUES(status)
            `,
            [
                randomUUID(),
                product.sku,
                product.name,
                slug,
                product.description,
                product.price,
                product.stockQuantity,
                product.status
            ]
        );

        const [rows] = await connection.execute<
            IdRow[]
        >(
            "SELECT id FROM products WHERE sku = ?",
            [product.sku]
        );

        if (rows.length === 0) {
            continue;
        }

        created += 1;
        const productId = rows[0].id;

        for (const categorySlug of product.categorySlugs) {
            const categoryId =
                categoryIdBySlug.get(categorySlug);

            if (!categoryId) {
                continue;
            }

            await connection.execute(
                `
                    INSERT IGNORE INTO product_categories (
                        product_id,
                        category_id
                    )
                    VALUES (?, ?)
                `,
                [productId, categoryId]
            );
        }
    }

    return created;
};

const seed = async (): Promise<void> => {
    console.log(
        "DEVELOPMENT SEED: inserting demo catalogue data (idempotent)."
    );

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const categoryIdBySlug =
            await seedCategories(connection);
        const productCount = await seedProducts(
            connection,
            categoryIdBySlug
        );

        await connection.commit();

        console.log(
            `DEVELOPMENT SEED complete: ${categoryIdBySlug.size} categories and ${productCount} products are available.`
        );
    } catch (error) {
        await connection.rollback();

        console.error(
            "DEVELOPMENT SEED failed:",
            error
        );

        process.exitCode = 1;
    } finally {
        connection.release();
        await pool.end();
    }
};

seed();
