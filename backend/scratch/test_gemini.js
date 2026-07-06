import dotenv from "dotenv";
import { researchGraph } from "../src/agent/graph.js";

dotenv.config();

async function test() {
  console.log("Starting full LangGraph invoke test...");
  try {
    const result = await researchGraph.invoke({ companyName: "Tesla" });
    
    console.log("\n--- REPORT SYNTHESIS RESULTS ---");
    console.log("Symbol:", result.ticker);
    console.log("Overview:", result.companyOverview);
    console.log("Business Model:", result.businessModel);
    console.log("Financial Analysis Health Score:", result.financialAnalysis?.healthScore);
    console.log("Sentiment Summary:", result.sentimentAnalysis?.summary);
    console.log("Verdict Decision:", result.decision?.decision);
    console.log("Confidence:", result.decision?.confidence);
    console.log("Reasoning sentences count:", result.decision?.reasoning.split(/[.!?]+/).filter(s => s.trim().length > 0).length);
    console.log("Key Factors count:", result.decision?.keyFactors?.length);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
