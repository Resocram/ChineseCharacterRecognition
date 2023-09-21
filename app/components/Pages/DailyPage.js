import { useState } from "react";

import { DATA } from "../../src/data/wordBank";
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import ExampleWords from "../Components/ExampleWords";
import Guesser from "../Components/Guesser";
import DailyScore from "../Components/DailyScore";

export default function DailyPage() {
    const [dailyProblem, setDailyProblem] = useState(DATA[new Date().getDate()]);
    const [correct, setCorrect] = useState(false);

    return (
        <div>
            <Pinyin pinyin={dailyProblem.pinyin}/>
            <Definition definition={dailyProblem.definition}/>
            <ExampleWords words={dailyProblem.exampleWord}/>
            <Guesser />
            <DailyScore correct={correct}/>
        </div>
    );
}