const prefixSign = (value) => (value > 0 ? '+' : '');

export const formatTrend = (trend) => {
  if (typeof trend !== 'number') {
    return null;
  }

  return `${prefixSign(trend)}${trend}%`;
};
