/* eslint-disable no-unused-expressions */
import React,{useState, useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import moment from 'moment';
import './form.scss'

import TextArea from '../textArea/textarea';
import FileLoad from '../fileLoad/fileLoad';
import FileInfo from '../fileInfo/fileInfo';

export default function Form (){
    
      const [email, setEmail] = useState("");
      const [name, setName] = useState("");
      const [text, setText] = useState("");
      const [language, setLanguage] = useState("0");
      const [comment, setComment] = useState("");
      const [fileLoaded, setFileLoaded] = useState(false);
      const [fileInfo, setFileInfo] = useState({});
      const [file, setFile] = useState();
      const [symbolsValue, setSymbolsValue] = useState();
      const [price, setPrice] = useState('0.00');
      const [endDate, setEndDate] = useState('1');

    const textAreaValue = (e) => {
        setText(e.target.value);
        setSymbolsValue(e.target.value.length);
    }

    const langValue = (e) => {
        setLanguage(e.target.value);
    }

    const removeFile = () => {
        setFileLoaded(false);
        setSymbolsValue();
        setFileInfo({});
    }

    const readFile = (e) => {
        const fileIn = e.target.files[0];
        const reader = new FileReader();

       reader.onload = function(event) {

            const res = event.target.result.length;
            setFileLoaded(true);
            setFileInfo({
                fileName: fileIn.name,
                symbols: res,
                type: fileIn.type
            })
            setSymbolsValue(res);
            setFile(fileIn);
      }

      reader.readAsText(fileIn);

      }

    useEffect(() => {
        const priceCounter = (price) => {
            switch (true) {
                case (symbolsValue === 0):
                    price = 0;
                    break;
                case (language.includes('0')):
                    price = 0;
                    break;
                case (symbolsValue > 1000 && language.includes('en')):
                    price = symbolsValue * 0.12;
                    break;
                case (symbolsValue > 1000 && !language.includes('en')):
                        price = symbolsValue * 0.05;
                        break;
                case (symbolsValue < 1000 && language.includes('en')):
                    price = 120;
                    break;
                case (symbolsValue < 1000 && !language.includes('en')):
                    price = 50;
                    break;

                default:
                    price = 0;
                    break;
            }

            if (fileLoaded && !(fileInfo.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileInfo.type === 'application/msword' || fileInfo.type === 'application/rtf')) {
                price = price * 1.20;
            }

            return price.toFixed(2);
      }
        setPrice(priceCounter);
    }, [language, symbolsValue]);

    useEffect(() => {
        const timeCounter = (time) => {

            let timeToDo = 0;
            switch (true) {
                case (symbolsValue === 0):
                    time = '';
                    break;
                case (language.includes('0')):
                    time = '';
                    break;
                case (symbolsValue >= 333 && language.includes('en')):
                    timeToDo = (symbolsValue / 333) + 0.50;

                    time = timeToDo;
                    break;
                case (symbolsValue >= 1000 && !language.includes('en')):
                        timeToDo = (symbolsValue / 1333) + 0.50;
                        time = timeToDo;
                        break;
                case (symbolsValue < 333 && language.includes('en')):
                    time = 1;
                    break;
                case (symbolsValue < 1000 && !language.includes('en')):
                    time = 1;
                    break;

                default:
                    time = 0;
                    break;
            }

            if (fileLoaded && !(fileInfo.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileInfo.type === 'application/msword' || fileInfo.type === 'application/rtf')) {
                time = time * 1.20;
            }
            return Math.ceil(time);
        }

        const countdownTime = () => {
            moment.locale();      

                let a = moment();
                let b = moment([10,0,0], "HH:mm:ss");
                let d = moment([19,0,0], "HH:mm:ss");

                let hours = timeCounter();

                const checkDay = (dayNum, hoursAdd, dayAdd) => {
                    if (b.isoWeekday() === dayNum) {
                        a = a.add(hoursAdd,'hours');
                        b.add(dayAdd, 'days');
                        d.add(dayAdd, 'days');
                    }
                }

                for (let i = 0; i < hours; i++) {
                    a.add(1,'hours'); 
                    if (!a.isBetween(b, d)) {
                        a.add(15,'hours');
                        b.add(1, 'days');
                        d.add(1, 'days');
                        continue;
                    } 

                    checkDay(6, 48, 2);
                    checkDay(7, 24, 1);
                }
                
                return a.format('DD.MM.YYYY об HH:mm');
            
        }
    
        setEndDate(countdownTime);


    }, [fileInfo.type, fileLoaded, language, symbolsValue]);


      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`
        Email: ${email}
        Name: ${name}
        Text: ${text}
        Lang: ${language}
        Comment: ${comment}
        Price: ${price}
        File: ${file}

        `);
      }
          return (
            <form className="form" onSubmit={handleSubmit}>
                <Row>
                    <Col lg="9">
                        <div className="form__left">
                            <h3>ЗАМОВИТИ РЕДАГУВАННЯ</h3>
                            <p className="form__desk">
                            Виправимо всі помилки, приберемо всі дурниці, перефразуємо невдалі місця, але сильно текст<br/> не переписуватимемо. Зайвих виправлень не буде. Детальніше про редагування
                            </p>

                            <div className="input__row required">
                                <input 
                                    type="text"
                                    name="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="Ваша эл.почта"
                                />
                            </div>

                            <div className="input__row">
                                <input 
                                    type="text" 
                                    name="name"
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder="Ваше имя"
                                />
                            </div>

                            <div className="input__row area__row">

                                {!fileLoaded ? <TextArea value={text} textAreaValue={textAreaValue}/> : <FileInfo file={fileInfo} selfRemove={removeFile}/>}     
                                
                                {text.length === 0 && !fileLoaded ? <FileLoad file={readFile}/>: null}
                                
                                <div className="symbols__value" id="symbols__value">{symbolsValue}</div>
                            </div>
                           
                           
                            <div className="lang__row">
                                <h3>МОВА</h3>
                                <div className="radioBtn__item">
                                    <input 
                                        type="radio" 
                                        id="ua"
                                        name="language"
                                        value="ua" 
                                        onClick={langValue} 
                                    />
                                    <label htmlFor="ua">Українська</label>
                                </div>
                                <div className="radioBtn__item">
                                    <input 
                                        type="radio" 
                                        id="ru"
                                        name="language"
                                        value="ru" 
                                        onClick={langValue} 
                                    />
                                    <label htmlFor="ru">Русский</label>
                                </div>
                                <div className="radioBtn__item">
                                    <input 
                                        type="radio" 
                                        id="en"
                                        name="language"
                                        value="en" 
                                        onClick={langValue}
                                    />
                                    <label htmlFor="en">English</label>
                                </div>
                            </div>

                            <div className="input__row">
                                <input 
                                    type="text" 
                                    name="comment"
                                    value={comment} 
                                    onChange={e => setComment(e.target.value)} 
                                    placeholder="Стислий коментар"
                                />
                            </div>

                            
                        </div>
                    </Col>
                    <Col lg="3">
                        <div className="form__right">
                            <div className="price__content">
                            <div className="price">{price === '0.00' ? price + ' грн' : `${price} грн`}</div>
                            <div className="time">{language === '0' || symbolsValue === 0 ? null : `Термін виконання: ${endDate}`}</div>

                                <button type="submit" className="order__btn">Замовити</button>
                            </div>
                        </div>
                    </Col>
                </Row>
                
            </form>
          )
}


