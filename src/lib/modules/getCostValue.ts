import { CostsSection } from "../interfaces/internshipCards";

export function getCostValue(costs: CostsSection): number {
    if (!costs || !costs.costs || costs.costs.length === 0) {
      return 0; // Consider as free if no cost data
    }

    const allCosts = costs.costs
      .filter((item) => typeof item.lowest === "number")
      .map((item) => item.lowest as number);

    if (allCosts.length === 0) return 0; // Consider as free if no numeric costs

    return Math.min(...allCosts);
  }