import { EvaluatedOption, WeightedArgument } from './types';

export function getOptionArguments(option: EvaluatedOption): {
  pros: WeightedArgument[];
  cons: WeightedArgument[];
} {
  const pros: WeightedArgument[] =
    option.prosArguments && option.prosArguments.length > 0
      ? option.prosArguments
      : (option.keyAdvantages || []).map((text, idx) => ({
          text,
          weight: Math.max(5, 9 - idx * 2),
          category: idx === 0 ? 'Primary Upside' : idx === 1 ? 'Long-Term Gain' : 'Advantage',
        }));

  const cons: WeightedArgument[] =
    option.consArguments && option.consArguments.length > 0
      ? option.consArguments
      : (option.criticalRisksOrDownsides || []).map((text, idx) => ({
          text,
          weight: Math.max(4, 7 - idx * 2),
          category: idx === 0 ? 'Core Friction' : idx === 1 ? 'Downside Risk' : 'Trade-Off',
        }));

  return { pros, cons };
}
