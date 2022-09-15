/** @jsxImportSource @emotion/react */
import './App.css';
import { css } from '@emotion/react';
import axios from 'axios';
// link for download explanation: https://www.delftstack.com/de/howto/react/react-download-file/
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';

function App() {
  const [templates, setTemplates] = useState([]);
  const [memeTemplate, setMemeTemplate] = useState('aag');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  useEffect(() => {
    fetch('https://api.memegen.link/templates')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const imageUrl = `https://api.memegen.link/images/${memeTemplate}/${
    topText ? topText : '_'
  }/${bottomText ? bottomText : '_'}`;

  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: 'blob',
      })
      .then((res) => {
        fileDownload(res.data, filename);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h1
        css={css`
          margin: 0;
          text-align: center;
          padding: 2rem 0;
        `}
      >
        Generate Your Own Meme!
      </h1>
      <div
        className="App"
        css={css`
          display: flex;
          justify-content: space-evenly;
          align-items: flex-start;
          width: 100%;
          padding: 0;
          margin: 0;
        `}
      >
        <section
          className="meme-selection"
          css={css`
            height: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          <h2> How should your meme look like? </h2>
          <label htmlFor="select">Meme template</label>
          <select
            id="select"
            onChange={(e) => {
              setMemeTemplate(e.currentTarget.value);
              setTopText('');
              setBottomText('');
            }}
          >
            {templates.map((template) => {
              return (
                <option value={template.id} key={template.id}>
                  {template.name}
                </option>
              );
            })}
          </select>
          <label>
            Top text
            <input
              value={topText}
              onChange={(e) => setTopText(e.currentTarget.value)}
            />
          </label>
          <label>
            Bottom text
            <input
              value={bottomText}
              onChange={(e) => setBottomText(e.currentTarget.value)}
            />
          </label>
        </section>

        <section className="meme-preview">
          <div className="img-container">
            <img data-test-id="meme-image" src={imageUrl} alt="meme" />
          </div>
          <button
            onClick={() =>
              handleDownload(
                imageUrl,
                `${memeTemplate}-${topText.replace(
                  ' ',
                  '-',
                )}-${bottomText.replace(' ', '-')}.png`,
              )
            }
          >
            Download
          </button>
        </section>
      </div>
    </>
  );
}

export default App;
