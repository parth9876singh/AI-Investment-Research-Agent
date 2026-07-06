import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

/**
 * Defines the state schema for our LangGraph research agent.
 */
export const ResearchStateAnnotation = Annotation.Root({
  // The user query/topic for research
  topic: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  // Resolved company name
  companyName: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  // Stock ticker symbol
  ticker: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  // Raw financial profile and metrics data
  financialData: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  // Raw recent news data
  newsData: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  // LLM financial analysis assessment
  financialAnalysis: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  // LLM news sentiment analysis assessment
  sentimentAnalysis: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  // LLM final investment decision
  decision: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  // History of research findings
  findings: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  // Current status of the agent
  status: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "idle",
  })
});

/**
 * Zod schema for structured LLM financial analysis output.
 */
export const FinancialAnalysisSchema = z.object({
  healthScore: z.number().min(0).max(10),
  summary: z.string(),
  redFlags: z.array(z.string()),
  strengths: z.array(z.string())
});

/**
 * Zod schema for structured LLM sentiment analysis output.
 */
export const SentimentAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative", "mixed"]),
  summary: z.string(),
  keyThemes: z.array(z.string())
});

/**
 * Zod schema for structured LLM decision output.
 */
export const DecisionSchema = z.object({
  decision: z.enum(["INVEST", "PASS", "WATCH"]),
  confidence: z.number().min(0).max(100),
  reasoning: z.string().describe("A detailed explanation (at least 3 sentences) referencing specific data points."),
  keyFactors: z.array(z.string())
});

/**
 * Consolidated Zod schema for single LLM call containing all analyses and final decision.
 */
export const FullAnalysisSchema = z.object({
  companyOverview: z.string().describe("A clean summary of the company description, mission, and current market standing."),
  businessModel: z.string().describe("A clear explanation of the company's business model, how it generates revenue, and its primary products/services."),
  financialAnalysis: FinancialAnalysisSchema,
  sentimentAnalysis: SentimentAnalysisSchema,
  decision: DecisionSchema
});
