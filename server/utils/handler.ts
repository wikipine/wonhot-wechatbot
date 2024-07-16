// 获取机器人ID
export const getBotIdByName = (botName: string) => {
  if (!botName) {
    return 0;
  }
  return Number(botName.substring(3));
};
