const { Configuration, OpenAIApi } = require("openai");

const openAi = new OpenAIApi(
	new Configuration({
		apiKey: "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",
	})
);

async function askGpt(prompt) {
	const completion = await openAi.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [{ role: "user", content: prompt }],
	});
	console.log(completion.data.choices[0].message.content);
}

console.log(askGpt("Hi, how many planets are there?"));
