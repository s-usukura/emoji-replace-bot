const MAX_LENGTH = 1024;

type EmojiDict = Record<string, string[]>;

function pickup_random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hiraToKana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, function (match) {
    var chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

type E = {
  text: string;
  c_emoji: number;
  c_not_emoji: number;
};

function score(e: E): number {
  return -e.c_not_emoji * MAX_LENGTH + e.c_emoji;
}

function to_emoji(inputText: string): string {
  let dp = new Array<E>(inputText.length + 1);
  dp[0] = { text: "", c_emoji: 0, c_not_emoji: 0 };
  for (let i = 1; i <= inputText.length; i++) {
    dp[i] = {
      text: dp[i - 1].text + inputText[i - 1],
      c_emoji: dp[i - 1].c_emoji,
      c_not_emoji: dp[i - 1].c_not_emoji + 1,
    };
    for (let j = 0; j < i; j++) {
      const q = hiraToKana(inputText.slice(j, i));
      if (!(q in emojiDict)) continue;
      const text = dp[j].text + pickup_random<string>(emojiDict[q]);
      const c_emoji = dp[j].c_emoji + 1;
      const c_not_emoji = dp[j].c_not_emoji;
      if (score(dp[i]) < score({ text, c_emoji, c_not_emoji })) {
        dp[i] = { text, c_emoji, c_not_emoji };
      }
    }
  }
  return dp[dp.length - 1].text;
}
