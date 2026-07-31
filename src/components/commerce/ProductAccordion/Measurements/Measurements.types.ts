export interface SkuMeasurements {
  height?: number | null
  width?: number | null
  length?: number | null
  weight?: number | null
  cubicWeight?: number | null
}

/** `skuDimensions` do `StoreProduct` — ver resolver `skuDimensions.ts`. */
export interface SkuDimensions {
  withPackage?: SkuMeasurements | null
  withoutPackage?: SkuMeasurements | null
}
