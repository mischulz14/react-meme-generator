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

  const imageUrl = topText
    ? `https://api.memegen.link/images/${memeTemplate}/${topText}/${bottomText}.jpg`
    : `https://api.memegen.link/images/${memeTemplate}/_/${bottomText}.jpg`;

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
          padding: 1rem 0;
        `}
      >
        Meme Generator
      </h1>
      <div
        className="App"
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <div className="container">
          <img data-test-id="meme-image" src={imageUrl} alt="meme" />

          <h2> How should your meme look like? </h2>

          <label htmlFor="select">Meme template</label>
          <select
            id="select"
            onChange={(e) => {
              setMemeTemplate(e.currentTarget.value);
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
              onChange={(e) =>
                setTopText(e.currentTarget.value.replace(' ', '_'))
              }
            />
          </label>
          <label>
            Bottom text
            <input
              value={bottomText}
              onChange={(e) =>
                setBottomText(e.currentTarget.value.replace(' ', '_'))
              }
            />
          </label>

          <button
            onClick={() =>
              handleDownload(
                imageUrl,
                `${memeTemplate}-${topText.replace(
                  ' ',
                  '-',
                )}-${bottomText.replace(' ', '-')}.jpg`,
              )
            }
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
