import { researchGraph } from "../agent/graph.js";

/**
 * Executes the research workflow for a given company or topic.
 * @param {string} topic - The target company or topic to research.
 * @returns {Promise<object>} The final state/results of the research.
 */
export const runResearch = async (topic) => {
  if (!topic) {
    throw new Error("Topic is required for research");
  }

  console.log(`Starting research for topic: ${topic}`);

  // Run the LangGraph
  const initialState = {
    companyName: topic,
  };

  const finalState = await researchGraph.invoke(initialState);
  return finalState;
};
