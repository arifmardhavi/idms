const arcPercent = (data) => (params) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const percent = total ? ((params.value / total) * 100).toFixed(1) : 0;
  return `${percent}%`;
};

export default arcPercent;