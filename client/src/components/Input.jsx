import React ,{useEffect,useState, useRef} from 'react';
import axios from 'axios';
import "./DiagonalTextbox.css";
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Input = () => {

    const [textbox1Value, setTextbox1Value] = useState('');
    const [textbox2Value, setTextbox2Value] = useState('');
    const [text, setText] = useState('');
    function handleTextbox1Change(event) {
      setTextbox1Value(event.target.value);
    }
  
    function handleTextbox2Change(event) {
      setTextbox2Value(event.target.value);
    }
    function onChangeText(event) {
        setText(event.target.value);
      }

    function handleSendData() {
        let text= "Here is my resume \n"+ textbox1Value + "\n here is the job description: \n" + textbox2Value + "\nWrite me a cover letter"
        //console.log(text)
        //setText(text)
        axios.post('http://localhost:5000/ask', {
          text
          })
          .then(response => {
            console.log(response.data); // do something with the response data\
            setText(response.data.message)
          })
          .catch(error => {
            console.error(error);
          }); 
      }


      const handleDownload= async () => {
        console.log(text)
        /*const fileName = "my-document.doc";
        const fileType = "application/msword";
    
        // Replace line breaks with the Word document line break character
        const formattedText = text.replace(/\n/g, "\r\n");
    
        // Create a new blob with the formatted text
        const blob = new Blob([formattedText], { type: fileType });
    
        // Create a temporary anchor element to download the blob
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
    
        // Simulate a click on the anchor element to start the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);*/

        const doc = document.createElement('a');
        const file = new Blob([text], { type: 'application/msword' });
        doc.href = URL.createObjectURL(file);
        doc.download = 'document.doc';
        doc.style.display = 'none';
    
        const style = document.createElement('style');
        style.innerHTML = `
          @page { size: 8.5in 11in; margin: 1in }
          body { font-family: sans-serif }
        `;
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(style);
    
        document.body.appendChild(doc);
        doc.click();
        document.body.removeChild(doc);
    
        // Remove style tag
        head.removeChild(style);
    }
  



    return (
  
        <div className=" py-5">
             <div className="w-full h-64 flex justify-center px-8 ">
             
      
             <textarea
        className="square-textbox__input w-1/2 mr-2 px-3 py-2 border border-gray-300 rounded resize-none focus:border-transparent bg-white text-black"
        value={textbox1Value}
        onChange={handleTextbox1Change}
        rows="13"
      ></textarea>
      

      <textarea
        className="square-textbox__input w-1/2 mr-2 px-3 py-2 border border-gray-300 rounded resize-none focus:border-transparent bg-white text-black"
        value={textbox2Value}
        onChange={handleTextbox2Change}
        rows="13"
      ></textarea>
      </div>


      <div className="w-full flex justify-center mt-5">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSendData}>
        Send Data
      </button>
      </div>


      <div className="w-full flex justify-center mt-5 mb-10">
      <textarea
        className="square-textbox__input w-1/2 mr-2 px-3 py-2 border border-gray-300 rounded resize-none focus:border-transparent bg-white text-black"
        value={text}
        onChange={onChangeText}
        rows="13"
      ></textarea>
      </div>

      <div className="w-full flex justify-center mt-10 mt-5">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto" onClick={handleDownload}>
          Download
        </button>
      </div>

      </div>
    
      
  
  
    )
  }

export default Input;