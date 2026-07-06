import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// Import node functions
import { resolveCompanyNode } from "./nodes/resolveCompany.js";
import { fetchFinancialsNode } from "./nodes/fetchFinancials.js";
import { fetchNewsNode } from "./nodes/fetchNews.js";
import { analyzeFinancialsNode } from "./nodes/analyzeFinancials.js";
import { analyzeSentimentNode } from "./nodes/analyzeSentiment.js";
import { synthesizeDecisionNode } from "./nodes/synthesizeDecision.js";

/**
 * Defines the state schema for our LangGraph research agent.
 */
export const StateAnnotation = Annotation.Root({
  companyName: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  ticker: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  financialData: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  newsData: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  companyOverview: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  businessModel: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  financialAnalysis: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  sentimentAnalysis: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  decision: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});

// Initialize the state graph
const workflow = new StateGraph(StateAnnotation)
  // Add all nodes
  .addNode("resolveCompany", resolveCompanyNode)
  .addNode("fetchFinancials", fetchFinancialsNode)
  .addNode("fetchNews", fetchNewsNode)
  .addNode("analyzeFinancials", analyzeFinancialsNode)
  .addNode("analyzeSentiment", analyzeSentimentNode)
  .addNode("synthesizeDecision", synthesizeDecisionNode)

  // START -> resolveCompany
  .addEdge(START, "resolveCompany")

  // resolveCompany -> fetchFinancials AND fetchNews (Parallel execution)
  .addEdge("resolveCompany", "fetchFinancials")
  .addEdge("resolveCompany", "fetchNews")

  // fetchFinancials -> analyzeFinancials
  .addEdge("fetchFinancials", "analyzeFinancials")

  // fetchNews -> analyzeSentiment
  .addEdge("fetchNews", "analyzeSentiment")

  // (analyzeFinancials AND analyzeSentiment) -> synthesizeDecision (Fan-in join)
  .addEdge("analyzeFinancials", "synthesizeDecision")
  .addEdge("analyzeSentiment", "synthesizeDecision")

  // synthesizeDecision -> END
  .addEdge("synthesizeDecision", END);

// Compile the graph
export const researchGraph = workflow.compile();
