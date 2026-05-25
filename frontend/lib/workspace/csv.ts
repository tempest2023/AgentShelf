import type { Category, Product } from "@/lib/types";
import type {
  WorkspaceCatalogPreviewRow,
  WorkspaceImportPreview,
} from "@/lib/workspace/types";

const headerAliases: Record<string, keyof Product | "images"> = {
  id: "id",
  productid: "id",
  product_id: "id",
  handle: "id",
  slug: "id",
  title: "title",
  name: "title",
  productname: "title",
  product_name: "title",
  description: "description",
  details: "description",
  body: "description",
  brand: "brand",
  vendor: "brand",
  manufacturer: "brand",
  price: "price",
  amount: "price",
  listprice: "price",
  saleprice: "price",
  sku: "sku",
  gtin: "gtin",
  upc: "gtin",
  ean: "gtin",
  barcode: "gtin",
  category: "category",
  producttype: "category",
  product_type: "category",
  type: "category",
  image: "images",
  imageurl: "images",
  image_url: "images",
  images: "images",
  shipping: "shippingPolicy",
  shippingpolicy: "shippingPolicy",
  shipping_policy: "shippingPolicy",
  returns: "returnPolicy",
  returnpolicy: "returnPolicy",
  return_policy: "returnPolicy",
  ingredients: "ingredients",
  materials: "ingredients",
  audience: "targetAudience",
  targetaudience: "targetAudience",
  target_audience: "targetAudience",
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, "");
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 48);
}

function splitMultiValue(value: string) {
  return value
    .split(/[|,;/]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeCategory(value: string, fallback: Category): Category {
  const lower = value.trim().toLowerCase();
  if (
    lower.includes("electronic") ||
    lower.includes("computer") ||
    lower.includes("phone")
  ) {
    return "electronics";
  }
  if (
    lower.includes("outdoor") ||
    lower.includes("trail") ||
    lower.includes("camp") ||
    lower.includes("hiking")
  ) {
    return "outdoor";
  }
  if (
    lower.includes("pet") ||
    lower.includes("dog") ||
    lower.includes("cat")
  ) {
    return "pets";
  }
  if (
    lower.includes("health") ||
    lower.includes("supplement") ||
    lower.includes("vitamin")
  ) {
    return "health";
  }

  return fallback;
}

function parsePrice(value: string) {
  const parsed = Number(value.replaceAll(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      currentRow.push(currentCell.trim());
      currentCell = "";
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function parseCatalogCsv({
  text,
  fallbackCategory,
}: {
  text: string;
  fallbackCategory: Category;
}): WorkspaceImportPreview {
  const [headerRow = [], ...rawRows] = parseCsv(text);
  const normalizedHeaders = headerRow.map(normalizeHeader);
  const resolvedColumns = normalizedHeaders.map(
    (header) => headerAliases[header] ?? null
  );

  const recognizedColumns = headerRow.filter((_, index) => resolvedColumns[index]);
  const ignoredColumns = headerRow.filter((_, index) => !resolvedColumns[index]);
  const previewRows: WorkspaceCatalogPreviewRow[] = [];
  const products: Product[] = [];

  rawRows.forEach((row, rowIndex) => {
    const mapped: Partial<Product> = {};
    const extraAttributes: Record<string, string> = {};

    row.forEach((value, index) => {
      const resolvedColumn = resolvedColumns[index];
      const header = headerRow[index] ?? `column_${index + 1}`;
      if (!resolvedColumn) {
        if (value.trim()) {
          extraAttributes[header] = value.trim();
        }
        return;
      }

      switch (resolvedColumn) {
        case "price":
          mapped.price = parsePrice(value);
          break;
        case "images":
          mapped.images = splitMultiValue(value);
          break;
        case "ingredients":
          mapped.ingredients = splitMultiValue(value);
          break;
        case "targetAudience":
          mapped.targetAudience = splitMultiValue(value);
          break;
        case "category":
          mapped.category = normalizeCategory(value, fallbackCategory);
          break;
        case "id":
          mapped.id = value.trim();
          break;
        case "title":
          mapped.title = value.trim();
          break;
        case "description":
          mapped.description = value.trim();
          break;
        case "brand":
          mapped.brand = value.trim();
          break;
        case "sku":
          mapped.sku = value.trim();
          break;
        case "gtin":
          mapped.gtin = value.trim();
          break;
        case "shippingPolicy":
          mapped.shippingPolicy = value.trim();
          break;
        case "returnPolicy":
          mapped.returnPolicy = value.trim();
          break;
        default:
          break;
      }
    });

    if (Object.keys(extraAttributes).length > 0) {
      mapped.attributes = {
        ...(mapped.attributes ?? {}),
        ...extraAttributes,
      };
    }

    const title = mapped.title?.trim() ?? "";
    const brand = mapped.brand?.trim() ?? "";
    const rawPrice = mapped.price;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!title) {
      errors.push("Missing product title");
    }

    if (!Number.isFinite(rawPrice)) {
      errors.push("Missing or invalid price");
    }

    if (!mapped.description?.trim()) {
      warnings.push("Description is missing");
    }

    if (!brand) {
      warnings.push("Brand is missing");
    }

    const category = mapped.category ?? fallbackCategory;
    const idSeed = mapped.id?.trim() || mapped.sku?.trim() || title;
    const productId = slugify(idSeed);

    previewRows.push({
      rowNumber: rowIndex + 2,
      title,
      brand,
      priceText: Number.isFinite(rawPrice) ? `$${rawPrice}` : "Invalid",
      category,
      errors,
      warnings,
    });

    if (errors.length > 0 || !productId) {
      return;
    }

    products.push({
      id: productId,
      title,
      brand: brand || "Unknown brand",
      category,
      price: rawPrice as number,
      description: mapped.description?.trim() || "Imported from catalog CSV.",
      sku: mapped.sku?.trim() || undefined,
      gtin: mapped.gtin?.trim() || undefined,
      images: mapped.images?.length ? mapped.images : undefined,
      shippingPolicy: mapped.shippingPolicy?.trim() || undefined,
      returnPolicy: mapped.returnPolicy?.trim() || undefined,
      ingredients: mapped.ingredients?.length ? mapped.ingredients : undefined,
      targetAudience: mapped.targetAudience?.length
        ? mapped.targetAudience
        : undefined,
      attributes:
        mapped.attributes && Object.keys(mapped.attributes).length > 0
          ? mapped.attributes
          : undefined,
    });
  });

  return {
    headers: headerRow,
    recognizedColumns,
    ignoredColumns,
    rows: previewRows,
    products,
  };
}
