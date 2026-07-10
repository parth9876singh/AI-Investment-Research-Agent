import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// Import node functions
import { resolveCompanyNode } from "./nodes/resolveCompany.js";
import { fetchFinancialsNode } from "./nodes/fetchFinancials.js";
import { fetchNewsNode } from "./nodes/fetchNews.js";
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
  // Add all active work nodes
  .addNode("resolveCompany", resolveCompanyNode)
  .addNode("fetchFinancials", fetchFinancialsNode)
  .addNode("fetchNews", fetchNewsNode)
  .addNode("synthesizeDecision", synthesizeDecisionNode)

  // 1. Resolve search query to ticker symbol
  .addEdge(START, "resolveCompany")

  // 2. Fetch financials and search news articles in parallel
  .addEdge("resolveCompany", "fetchFinancials")
  .addEdge("resolveCompany", "fetchNews")

  // 3. Join the data streams and compile the final decision
  .addEdge("fetchFinancials", "synthesizeDecision")
  .addEdge("fetchNews", "synthesizeDecision")

  // 4. Complete the process
  .addEdge("synthesizeDecision", END);

// Compile the graph
export const researchGraph = workflow.compile();
