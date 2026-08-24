ALTER TABLE products
    ADD CONSTRAINT chk_products_price_positive
    CHECK (price > 0);