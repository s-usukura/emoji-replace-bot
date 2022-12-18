function doPost(e) {
  const token =
    PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");
  const event = JSON.parse(e.postData.contents).events[0];

  if (event.message.type !== "text") return;

  const receivedText: string = event.message.text.slice(0, MAX_LENGTH);
  let replayText: string | null = null;
  if (receivedText in emojiInfo) {
    // Return emoji information, if `receivedText` is an emoji
    replayText = emojiInfo[receivedText].toString();
  } else {
    // Replace words with emojis
    replayText = to_emoji(receivedText);
    if (receivedText === replayText) return;
  }

  const payload = {
    replyToken: event.replyToken,
    messages: [
      {
        type: "text",
        text: replayText,
      },
    ],
  };

  const options = {
    payload: JSON.stringify(payload),
    myamethod: "POST",
    headers: { Authorization: "Bearer " + token },
    contentType: "application/json",
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}
