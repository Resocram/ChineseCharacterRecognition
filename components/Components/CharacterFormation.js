export default function CharacterFormation({ charFormation }) {
    return (
      <div>
        <h2 className="header">Character Formation</h2>
        {charFormation.map((charInfo, index) => (
          <div key={index}>
            <p>
              {charInfo.char} [{charInfo.pinyin}] {charInfo.def}
            </p>
          </div>
        ))}
      </div>
    );
  }
