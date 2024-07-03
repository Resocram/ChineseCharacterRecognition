
import React from "react";
export default function Answers({ prevAnswers, onPrevChar }) {
    return (
        <div className="answers-container half-width">
            <h2 className="header">Previous Answers</h2>
            <div className="horizontal-list">
                            {
                    prevAnswers.map((item, index) => (
                        item.answer.char.includes("(") ? (
                          <React.Fragment key={index}>
                            <span className={`chinese underline-${item.correct ? "green" : "red"} `} onClick={() =>{onPrevChar(item,null)}}>
                              {item.answer.char.charAt(0)}
                            </span>
                            <span className={`chinese`} onClick={() =>{onPrevChar(item,item.answer.char[item.answer.char.indexOf("(") + 1])}}>
                              {
                              "(" + item.answer.char[item.answer.char.indexOf("(") + 1] + ")" }
                              {index < prevAnswers.length - 1 && ","}

                            </span>
                          </React.Fragment>
                        ) : (
                            <React.Fragment key={index}>
                          <span className={`chinese underline-${item.correct ? "green" : "red"}`} onClick={() =>{onPrevChar(item,null)}}>
                            {item.answer.char.charAt(0)}
                            {index < prevAnswers.length - 1 && ","}
                          </span>
                        </React.Fragment>
                        )
                        
                      ))
                        }
            </div>
        </div>
    );
}