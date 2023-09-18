import { useState } from "react";

import { DATA } from "../../src/data/wordBank";
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import ExampleWords from "../Components/ExampleWords";
import Guesser from "../Components/Guesser";
import Score from "../Components/Score";
import DifficultySetter from "../Components/DifficultySetter";
import Answers from "../Components/Answers";

export default function HomePage() {
    const [problem, setProblem] = useState(DATA[1]);
    const [numCorrect, setNumCorrect] = useState(0);
    const [numRounds, setNumRounds] = useState(0);

    return (
        <div>
            Chinese Character Recognition
            <Pinyin pinyin={problem.pinyin}/>
            <Definition definition={problem.definition}/>
            <ExampleWords words={problem.exampleWord}/>
            <Guesser />
            <Answers />
            <Score numCorrect={numCorrect} numRounds={numRounds} />
            <DifficultySetter />
        </div>
    );
}