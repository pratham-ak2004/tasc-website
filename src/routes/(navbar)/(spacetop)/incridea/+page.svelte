<!-- <script lang="ts">
	import Quiz from '$lib/components/Incridea/quiz.svelte';
</script>

<section class={`h-screen w-full`}>
	<div class="background"></div>
	<Quiz />
</section>

<style>
	section {
		position: relative;
		display: flex;
		align-items: center;
		justify-items: center;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/LIR.jpg');
		background-size: cover;
		filter: blur(10px); /* Apply blur to the background image */
	}
</style> -->

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let score = 0;
	let currentQuestion = 0;
	let questionCounter = 0;

	function restart() {
		score = 0;
		currentQuestion = 0;
		questionCounter = 0;
		data.answers.forEach((answer) => {
			answer.answered = false;
			answer.answer = '';
		});
	}

	function prevClick() {
		if (currentQuestion === 0) {
			return;
		}
		currentQuestion--;
	}

	function nextClick() {
		currentQuestion++;
	}

	function handleClick(e: MouseEvent) {
		const target = e.target as HTMLButtonElement;
		if (data.answers[currentQuestion].answered) {
			return;
		}
		questionCounter++;
		data.answers[currentQuestion].answered = true;
		data.answers[currentQuestion].answer = target.value;
		if (data.answers[currentQuestion].answer === data.list[currentQuestion].answer) {
			score++;
		}
	}
</script>

<p>{JSON.stringify(data)}</p>
<p>Current question - {currentQuestion}</p>
<hr />

<div class="mx-auto flex w-96 flex-col items-center gap-4">
	<h1 class="self-start text-left text-xl font-medium">
		{currentQuestion + 1}. {data.list[currentQuestion].question}
	</h1>

	{#each data.answers[currentQuestion].order as i}
		<button
			type="button"
			class="btn {data.list[currentQuestion].answer === data.list[currentQuestion].options[i] && data.answers[currentQuestion].answered ? 'btn-success' : ''}
				{data.answers[currentQuestion].answer === data.list[currentQuestion].options[i] && data.list[currentQuestion].answer !== data.list[currentQuestion].options[i] && data.answers[currentQuestion].answered ? 'btn-error' : ''}
				w-full"
			value={data.list[currentQuestion].options[i]}
			on:click={(e) => handleClick(e)}>{data.list[currentQuestion].options[i]}</button
		>
	{/each}

	{#if currentQuestion === data.list.length - 1 && questionCounter === data.list.length}
		<h1>Score: {score}</h1>
	{/if}

	{#if currentQuestion !== 0}
		<button class="btn btn-primary w-32" on:click={() => prevClick()}>Previous</button>
	{/if}
	{#if currentQuestion !== data.list.length - 1}
		<button class="btn btn-primary w-32" on:click={() => nextClick()}>Next</button>
	{:else if questionCounter === data.list.length}
		<button class="btn btn-primary w-32" on:click={() => restart()}>Restart Quiz</button>
	{/if}
	<p>Questions Attempted: {questionCounter}/{data.list.length}</p>
	<div class="flex flex-row gap-10">
		{#each { length: data.list.length } as _, i}
			<button
				class="btn w-0 {data.answers[i].answered && currentQuestion !== i ? 'btn-warning' : 'btn-outline'} {currentQuestion === i ? 'btn-active' : ''}"
				on:click={() => {
					currentQuestion = i;
				}}>{i + 1}</button
			>
		{/each}
	</div>
</div>

<style>
	.btn {
		background-color: aqua;
		padding: 0.5rem;
		color: black;
		border-radius: 4px;
	}
</style>
