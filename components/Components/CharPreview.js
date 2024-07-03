import React from 'react';
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import CharacterFormation from "../Components/CharacterFormation";

export default function CharPreview({ showPreview, onHide, onAnimate,char }) {
  const charPreviewClasses = showPreview ? 'char-preview-container' : 'hidden';
  return (
    <div className={`half-width ${charPreviewClasses} `}>
      <div>
        <div id='char-preview'>

        </div>
        <div className="button-container">
            <button className="button" onClick={onAnimate}>Animate</button>
            <button className="button" onClick={onHide}>Hide</button>
          </div>
      </div>
      {char && ( 
        <div>
          <Pinyin pinyin={char.answer.pinyin} />
          <Definition definition={char.answer.definition} />
          <CharacterFormation charFormation={char.answer.charForm} />
        </div>
      )}
    </div>




  );
}