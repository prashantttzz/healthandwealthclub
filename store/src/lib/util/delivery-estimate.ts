const GCC_COUNTRY_CODES = new Set(["ae", "sa", "kw", "bh", "om", "qa"])

const SIZE_ORDER = ["xs", "s", "m", "l", "lg", "xl", "xxl", "xxxl"]

type DeliveryEstimateInput = {
  countryCode?: string | null
  baseDate?: string | Date | null
}

const normalizeCountryCode = (countryCode?: string | null) =>
  countryCode?.trim().toLowerCase() || ""

export const getDeliveryEstimateDays = (countryCode?: string | null) => {
  const normalizedCountryCode = normalizeCountryCode(countryCode)

  if (normalizedCountryCode === "ae") {
    return 2
  }

  if (GCC_COUNTRY_CODES.has(normalizedCountryCode)) {
    return 5
  }

  return 8
}

export const getDeliveryEstimateLabel = (countryCode?: string | null) => {
  const normalizedCountryCode = normalizeCountryCode(countryCode)

  if (normalizedCountryCode === "ae") {
    return "UAE delivery in 2 days"
  }

  if (GCC_COUNTRY_CODES.has(normalizedCountryCode)) {
    return "GCC delivery in 5 days"
  }

  return "International delivery in 8 days"
}

export const getDeliveryEstimate = ({
  countryCode,
  baseDate,
}: DeliveryEstimateInput) => {
  const days = getDeliveryEstimateDays(countryCode)
  const referenceDate = baseDate ? new Date(baseDate) : new Date()
  const estimateDate = new Date(referenceDate.getTime() + days * 86400000)

  return {
    days,
    label: getDeliveryEstimateLabel(countryCode),
    date: estimateDate,
    formattedDate: estimateDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }
}

export const sortSizeValues = <T extends { value?: string | null }>(values: T[]) => {
  return [...values].sort((a, b) => {
    const aValue = a.value?.trim().toLowerCase() || ""
    const bValue = b.value?.trim().toLowerCase() || ""
    const aIndex = SIZE_ORDER.indexOf(aValue)
    const bIndex = SIZE_ORDER.indexOf(bValue)

    if (aIndex === -1 && bIndex === -1) {
      return aValue.localeCompare(bValue)
    }

    if (aIndex === -1) {
      return 1
    }

    if (bIndex === -1) {
      return -1
    }

    return aIndex - bIndex
  })
}
