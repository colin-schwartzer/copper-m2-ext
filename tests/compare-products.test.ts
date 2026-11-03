// Extension: the fifth Ask Copper tool, compare_products.
import { describe, expect, it } from "vitest";
import { getProducts } from "@/lib/copper/catalog";
import {
  compareProducts,
  compareProductsInput,
  copperTools,
} from "@/lib/copper/assistant/tools";

describe("compare_products", () => {
  it("is registered as a tool the model can use", () => {
    expect(Object.keys(copperTools)).toContain("compare_products");
  });

  it("returns both products from the catalog with the price difference", () => {
    const result = compareProducts({
      products: ["copper-home", "copper-notes"],
    });
    const [home, notes] = getProducts();
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.products.map((p) => p.name)).toEqual([home.name, notes.name]);
    expect(result.products[0].priceUsd).toBe(home.priceUsd);
    expect(result.products[1].colors).toEqual(notes.colors);
    expect(result.priceDifferenceUsd).toBe(home.priceUsd - notes.priceUsd);
  });

  it("asks for two different products instead of comparing one to itself", () => {
    const result = compareProducts({
      products: ["copper-notes", "copper-notes"],
    });
    expect(result.status).toBe("same_product");
  });

  it("rejects input that is not exactly two known products", () => {
    expect(
      compareProductsInput.safeParse({ products: ["copper-home"] }).success,
    ).toBe(false);
    expect(
      compareProductsInput.safeParse({ products: ["copper-home", "toaster"] })
        .success,
    ).toBe(false);
  });
});
