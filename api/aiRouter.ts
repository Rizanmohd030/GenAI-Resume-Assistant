import type { GenerateRequest, GenerationFocus } from "../types";

type SupportedGeminiModel = "gemini-2.5-flash-lite" | "gemini-2.5-flash" | "gemini-2.5-pro";

interface RouteDecision {
  model: SupportedGeminiModel;
  poolName: string;
  reason: string;
}

interface ProviderSelection extends RouteDecision {
  key: string;
}

const parseKeyList = (value?: string) =>
  (value || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);

const unique = (values: string[]) => [...new Set(values)];

const genericGeminiKeys = () => {
  const numberedKeys = Object.entries(process.env)
    .filter(([name, value]) => /^GEMINI_API_KEY(?:_\d+)?$/.test(name) && value?.trim())
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([, value]) => value!.trim());

  return unique([...numberedKeys, ...parseKeyList(process.env.GEMINI_API_KEYS)]);
};

const modelEnvPrefixes: Record<SupportedGeminiModel, string> = {
  "gemini-2.5-flash-lite": "GEMINI_FLASH_LITE",
  "gemini-2.5-flash": "GEMINI_FLASH",
  "gemini-2.5-pro": "GEMINI_PRO",
};

const modelSpecificKeys = (model: SupportedGeminiModel) => {
  const prefix = modelEnvPrefixes[model];
  const numberedKeys = Object.entries(process.env)
    .filter(([name, value]) => new RegExp(`^${prefix}_KEY(?:_\\d+)?$`).test(name) && value?.trim())
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([, value]) => value!.trim());

  return unique([...numberedKeys, ...parseKeyList(process.env[`${prefix}_KEYS`])]);
};

const rotationIndexes = new Map<string, number>();

const nextKeyFromPool = (poolName: string, keys: string[]) => {
  if (keys.length === 0) return null;

  const currentIndex = rotationIndexes.get(poolName) ?? 0;
  const key = keys[currentIndex % keys.length];
  rotationIndexes.set(poolName, (currentIndex + 1) % keys.length);
  return key;
};

const getTextComplexityScore = (request: GenerateRequest) => {
  const content = [request.role, request.jobDescription, request.companyContext, request.experienceLevel]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 0;
  if (content.length > 2200) score += 2;
  else if (content.length > 1200) score += 1;

  const harderSignals = [
    "system design",
    "distributed",
    "scalability",
    "architecture",
    "machine learning",
    "llm",
    "agent",
    "platform",
    "staff",
    "principal",
    "research",
    "optimization",
    "compiler",
    "kubernetes",
    "microservices",
  ];

  for (const signal of harderSignals) {
    if (content.includes(signal)) {
      score += 1;
    }
  }

  if (/8\+|10\+|senior|lead|staff|principal/i.test(request.experienceLevel || "")) {
    score += 1;
  }

  return score;
};

export const chooseModelForRequest = (request: GenerateRequest): RouteDecision => {
  const focus: GenerationFocus = request.focus || "full";
  const complexity = getTextComplexityScore(request);

  if (focus === "career") {
    return {
      model: "gemini-2.5-flash-lite",
      poolName: "gemini-2.5-flash-lite",
      reason: "Career prep is mostly structured rewriting, ATS extraction, and summarization.",
    };
  }

  if (focus === "interview") {
    if (complexity >= 4) {
      return {
        model: "gemini-2.5-flash",
        poolName: "gemini-2.5-flash",
        reason: "Interview generation needs stronger adaptation for a complex role or long job description.",
      };
    }

    return {
      model: "gemini-2.5-flash-lite",
      poolName: "gemini-2.5-flash-lite",
      reason: "Interview generation is latency-friendly and cost-sensitive for repeated refreshes.",
    };
  }

  if (focus === "dsa") {
    if (complexity >= 6) {
      return {
        model: "gemini-2.5-pro",
        poolName: "gemini-2.5-pro",
        reason: "Highly complex DSA targeting benefits from the strongest reasoning model.",
      };
    }

    return {
      model: "gemini-2.5-flash",
      poolName: "gemini-2.5-flash",
      reason: "DSA recommendations need better reasoning than simple summarization.",
    };
  }

  if (complexity >= 6) {
    return {
      model: "gemini-2.5-pro",
      poolName: "gemini-2.5-pro",
      reason: "Full generation for a complex role needs the highest reasoning budget.",
    };
  }

  return {
    model: "gemini-2.5-flash",
    poolName: "gemini-2.5-flash",
    reason: "Full generation combines reasoning and throughput, so Flash is the best default balance.",
  };
};

export const getProviderSelection = (request: GenerateRequest): ProviderSelection | null => {
  const route = chooseModelForRequest(request);
  const modelKeys = modelSpecificKeys(route.model);
  const fallbackKeys = genericGeminiKeys();
  const selectedKeys = modelKeys.length > 0 ? modelKeys : fallbackKeys;
  const poolName = modelKeys.length > 0 ? route.poolName : `${route.poolName}:shared`;
  const key = nextKeyFromPool(poolName, selectedKeys);

  if (!key) {
    return null;
  }

  return {
    ...route,
    poolName,
    key,
  };
};

export const getAvailableProviderCount = (request: GenerateRequest) => {
  const route = chooseModelForRequest(request);
  const modelKeys = modelSpecificKeys(route.model);
  return (modelKeys.length > 0 ? modelKeys : genericGeminiKeys()).length;
};
