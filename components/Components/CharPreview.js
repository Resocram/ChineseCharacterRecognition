import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import CharacterFormation from "../Components/CharacterFormation";
import HanziWriter from 'hanzi-writer';

// wordBank char field format: "simplified(traditional)" or "simplified(Afinancial,traditional)"

function parseCharVariants(rawChar) {
  const match = rawChar.match(/^([^(]+)(?:\(([^)]+)\))?/);
  const simplified = match ? match[1].charAt(0) : rawChar.charAt(0);
  const parenContent = match && match[2] ? match[2] : '';
  const traditional = parenContent
    .split(',')
    .map((s) => s.trim())
    .find((s) => s && !s.startsWith('A')) || '';
  return { simplified, traditional };
}

const CharPreview = forwardRef(({ showPreview, char, onHide }, ref) => {
  const modalWriterRef = useRef(null);
  const [showTraditional, setShowTraditional] = useState(false);

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

  // Reset back to the simplified form whenever a different character is opened
  useEffect(() => {
    setShowTraditional(false);
  }, [char]);

  const { simplified: simplifiedChar, traditional: traditionalChar } = char
    ? parseCharVariants(char.answer.char)
    : { simplified: '', traditional: '' };
  const hasTraditionalVariant = !!traditionalChar && traditionalChar !== simplifiedChar;

  useEffect(() => {
    if (showPreview && char) {
      const charToShow = showTraditional && hasTraditionalVariant ? traditionalChar : simplifiedChar;
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
  }, [showPreview, char, showTraditional]);

  const toggleVariant = () => {
    if (hasTraditionalVariant) {
      setShowTraditional((prev) => !prev);
    }
  };

  return (
    <div className={`modal-overlay ${showPreview ? 'show' : ''}`} onClick={() => ref.current?.hide()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {char && ( 
          <>
            <div className="modal-char-row">
              <div className="modal-char" id="char-preview-modal"></div>
              {hasTraditionalVariant && (
                <button
                  className="char-variant-arrow"
                  title={showTraditional ? 'Switch to simplified form' : 'Switch to traditional form'}
                  onClick={toggleVariant}
                >
                  {showTraditional ? '‹' : '›'}
                </button>
              )}
            </div>
            {hasTraditionalVariant && (
              <div className="char-variant-label">{showTraditional ? 'Traditional' : 'Simplified'}</div>
            )}
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

