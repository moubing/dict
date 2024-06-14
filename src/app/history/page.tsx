"use client";

import { useEffect, useState } from "react";
import queryKimi from "./queryKimi";
export default function History() {
  const [words, setWords] = useState([]);
  const [def, setDef] = useState();
  const [index, setIndex] = useState();
  const [ai, setAi] = useState();
  useEffect(() => {
    let mounted=true;
    window.model.createTextSession().then((ai) => {
      if(mounted)setAi(ai);}).catch(error => console.log(error))
    
    return ()=>{
      mounted=false;
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8787/fetch")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setWords(data);
        setIndex(10);
        console.log("fetched");
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    /*
    if(ai){
      console.log(`running ${words[index].word}`);      
      ai.prompt(`provide the definition of the word '${words[index].word}'`)
      .then((data) => {setDef(data);console.log("done")})
      .catch(error=>console.log(error));
    }
    */
    async function queryWord(ai, word) {
      if (ai) {
        //const res = await ai.prompt(`provide the definition of the word '${word.word}'`);
        //const res = await ai.prompt(`hello`);
        const res=await queryKimi(word);
        setDef(res);

      }
      else{

        setDef("ai not initialized ");
      }
    }
    if (words.length == 0) {
      return
    }
    queryWord(ai, words[index]);
  }, [index, ai]);
  const nextWord = (event) => setIndex(index + 1);
  const current = words ? words[index] : undefined;

  return !current ? (
    <h1>loading</h1>
  ) : (
    <>
      <h1>{current.word}</h1>
      <h2>{def}</h2>
      <button onClick={nextWord}>next word</button>
    </>
  );
}

