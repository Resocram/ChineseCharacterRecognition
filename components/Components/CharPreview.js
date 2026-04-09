import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import CharacterFormation from "../Components/CharacterFormation";
import HanziWriter from 'hanzi-writer';

const CharPreview = forwardRef(({ showPreview, char, onHide }, ref) => {
  const modalWriterRef = useRef(null);

  const clearModal = () => {
    modalWriterRef.current = null;
    const modalEl = document.getElementById('char-preview-modal');
    if (modalEl) {
      modalEl.innerHTML = '';
    }
  };

  useImperativeHandle(ref, () => ({
    animate: () => {
      if (modalWriterRef.current) {
        modalWriterRef.current.animateCharacter();
      }
    },
    hide: () => {
      clearModal();
      onHide();
    }
  }));

  useEffect(() => {
    if (showPreview && char) {
      const charToShow = char.answer.char.charAt(0);
      const modalEl = document.getElementById('char-preview-modal');
      
      if (modalEl) {
        if (!modalWriterRef.current) {
          modalWriterRef.current = HanziWriter.create(modalEl, charToShow, {
            width: 120,
            height: 120,
            padding: 5,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 200,
            showOutline: true,
          });
        } else {
          modalWriterRef.current.setCharacter(charToShow);
          modalWriterRef.current.showCharacter();
        }
      }
    }
  }, [showPreview, char]);

  return (
    <div className={`modal-overlay ${showPreview ? 'show' : ''}`} onClick={() => ref.current?.hide()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {char && ( 
          <>
            <div className="modal-char" id="char-preview-modal"></div>
            <div className="modal-pinyin">{char.answer.pinyin}</div>
            <div className="modal-def">{char.answer.definition}</div>
            <CharacterFormation charFormation={char.answer.charForm} />
          </>
        )}
        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button className="modal-btn secondary" onClick={() => ref.current?.hide()}>Close</button>
          <button className="modal-btn primary" onClick={() => ref.current?.animate()}>Animate</button>
        </div>
      </div>
    </div>
  );
});

export default CharPreview;
