const apiKey = ""

async function Summary (data) {
	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				inputs: data
			}),
		}
	);
	const result = await response.json();
	return result[0].summary_text;
}


async function askQuestion(question, context) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          question: question,
          context: context,
        },
      }),
    }
  );

  const result = await response.json();
  return result.answer;
}

async function main() {
	var input = "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct"; 
	var question = "What is the height?";
	var summary = await Summary(input);
	console.log("Summary",summary)
	var answer = await askQuestion(question,summary)
	console.log("answer:",answer)
}
main()
